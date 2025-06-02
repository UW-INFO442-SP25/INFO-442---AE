import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, User, Clock, Bookmark, BookmarkCheck, Share, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useBookmarks } from "@/contexts/BookmarksContext";

interface FirebaseInterview {
  id: string;
  company: string;
  role: string;
  interviewType: string;
  rounds: number;
  process: string;
  questions: string;
  preparation?: string;
  timeline?: string;
  difficulty: string;
  createdAt: any;
  createdBy: string;
  createdByEmail: string;
  status: string;
}

interface ProcessedInterview {
  company: string;
  role: string;
  interviewType: string[];
  rounds: number;
  questions: Array<{
    round: number;
    type: string;
    questions: string[];
  }>;
  preparation: string[];
  timeline: string;
  difficulty: string;
  user: {
    name: string;
    university: string;
    year: string;
  };
}

// Fallback data for when no interview is found
const getFallbackData = (companyName: string): ProcessedInterview => ({
  company: companyName.charAt(0).toUpperCase() + companyName.slice(1),
  role: "Software Engineer Intern",
  interviewType: ["Technical", "Behavioral"],
  rounds: 3,
  questions: [
    {
      round: 1,
      type: "Technical",
      questions: [
        "Implement a binary search tree",
        "Write a function to find the longest palindromic substring",
        "Explain time complexity of your solution",
      ],
    },
    {
      round: 2,
      type: "System Design",
      questions: [
        "Design a URL shortener",
        "How would you scale this solution?",
        "Discuss potential bottlenecks",
      ],
    },
    {
      round: 3,
      type: "Behavioral",
      questions: [
        "Tell me about a time you worked in a team",
        "How do you handle conflicts?",
        "What's your biggest achievement?",
      ],
    },
  ],
  preparation: [
    "Review data structures and algorithms",
    "Practice system design fundamentals",
    "Prepare STAR format answers",
  ],
  timeline: "2 weeks from application to offer",
  difficulty: "Medium",
  user: {
    name: "Anonymous User",
    university: "University",
    year: "2024",
  },
});

// Helper function to process Firebase interview data
const processFirebaseInterview = (firebaseInterview: FirebaseInterview): ProcessedInterview => {
  const interviewTypes = firebaseInterview.interviewType.split(',').map(type => type.trim());
  
  // Parse questions into rounds
  const questionLines = firebaseInterview.questions.split('\n').filter(q => q.trim().length > 0);
  const questionsPerRound = Math.ceil(questionLines.length / firebaseInterview.rounds);
  
  const questions = [];
  for (let i = 0; i < firebaseInterview.rounds; i++) {
    const startIndex = i * questionsPerRound;
    const endIndex = Math.min(startIndex + questionsPerRound, questionLines.length);
    const roundQuestions = questionLines.slice(startIndex, endIndex);
    
    if (roundQuestions.length > 0) {
      questions.push({
        round: i + 1,
        type: interviewTypes[i] || interviewTypes[0] || "Interview",
        questions: roundQuestions,
      });
    }
  }
  
  // Parse preparation tips
  const preparation = firebaseInterview.preparation 
    ? firebaseInterview.preparation.split('\n').filter(tip => tip.trim().length > 0)
    : ["No specific preparation tips provided"];
  
  const createdDate = firebaseInterview.createdAt?.toDate ? 
    firebaseInterview.createdAt.toDate() : 
    new Date();

  return {
    company: firebaseInterview.company,
    role: firebaseInterview.role,
    interviewType: interviewTypes,
    rounds: firebaseInterview.rounds,
    questions,
    preparation,
    timeline: firebaseInterview.timeline || "Timeline not specified",
    difficulty: firebaseInterview.difficulty,
    user: {
      name: firebaseInterview.createdByEmail?.split('@')[0] || "Anonymous User",
      university: "University",
      year: createdDate.getFullYear().toString(),
    },
  };
};

const InterviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [interview, setInterview] = useState<ProcessedInterview | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching interview for company:", id);
        
        // Convert URL parameter back to company name
        const companyName = id.replace(/-/g, ' ');
        
        const interviewsRef = collection(db, "interviews");
        const q = query(
          interviewsRef,
          where("company", "==", companyName)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log("No interview found, trying case-insensitive search...");
          
          // Try a broader search if exact match fails
          const allInterviewsQuery = collection(db, "interviews");
          const allQuerySnapshot = await getDocs(allInterviewsQuery);
          
          let foundInterview: FirebaseInterview | null = null;
          
          allQuerySnapshot.forEach((doc) => {
            const data = doc.data() as Omit<FirebaseInterview, 'id'>;
            const interview = { id: doc.id, ...data };
            
            // Case-insensitive comparison
            if (interview.company.toLowerCase() === companyName.toLowerCase()) {
              foundInterview = interview;
            }
          });
          
          if (foundInterview) {
            const processedInterview = processFirebaseInterview(foundInterview);
            setInterview(processedInterview);
            setInterviewId(foundInterview.id);
          } else {
            console.log("No interview found, using fallback data");
            setInterview(getFallbackData(companyName));
            setNotFound(true);
          }
        } else {
          // Use the first matching interview
          const doc = querySnapshot.docs[0];
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          const firebaseInterview = { id: doc.id, ...data };
          
          const processedInterview = processFirebaseInterview(firebaseInterview);
          setInterview(processedInterview);
          setInterviewId(firebaseInterview.id);
          console.log("Found interview:", processedInterview);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast({
          title: "Error",
          description: "Failed to load interview details.",
          variant: "destructive",
        });
        
        // Use fallback data on error
        if (id) {
          const companyName = id.replace(/-/g, ' ');
          setInterview(getFallbackData(companyName));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleBookmark = async () => {
    if (!interview || !interviewId) {
      toast({
        title: "Error",
        description: "Cannot bookmark this interview.",
        variant: "destructive",
      });
      return;
    }

    const bookmarked = isBookmarked(interviewId);
    
    if (bookmarked) {
      await removeBookmark(interviewId);
    } else {
      await addBookmark({
        interviewId: interviewId,
        company: interview.company,
        role: interview.role,
        title: `${interview.rounds} Round ${interview.interviewType.join(", ")} Process`,
        description: `Learn about ${interview.company}'s interview process for ${interview.role} position.`,
        tags: interview.interviewType,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Interview URL has been copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading interview details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" />
            Back to Interviews
          </Button>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Interview Not Found</h2>
            <p className="text-gray-600 mb-6">
              The interview you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/interviews')}>
              Browse All Interviews
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back to Interviews
        </Button>

        {notFound && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              📝 This is sample data. The actual interview for "{interview.company}" may not be available yet.
            </p>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{interview.company}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{interview.role}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBookmark}
                  className={
                    interviewId && isBookmarked(interviewId) 
                      ? "border-blue-500 bg-blue-50 text-blue-600" 
                      : "border-gray-300"
                  }
                >
                  {interviewId && isBookmarked(interviewId) ? (
                    <BookmarkCheck className="h-4 w-4 mr-1" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-1" />
                  )}
                  {interviewId && isBookmarked(interviewId) ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {interview.interviewType.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
              <Badge className="bg-blue-100 text-blue-800">
                {interview.difficulty}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {interview.questions.map((round) => (
                  <div key={round.round} className="mb-6">
                    <h3 className="font-semibold mb-2">
                      Round {round.round}: {round.type}
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {round.questions.map((question, idx) => (
                        <li key={idx} className="text-gray-600">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preparation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {interview.preparation.map((tip, idx) => (
                    <li key={idx} className="text-gray-600">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{interview.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>
                    Shared by {interview.user.name} • {interview.user.university} •
                    Class of {interview.user.year}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;