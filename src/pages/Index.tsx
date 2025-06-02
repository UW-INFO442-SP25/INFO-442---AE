import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Users, BookOpen, Target, Play } from "lucide-react";

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

interface InterviewCardData {
  company: string;
  role: string;
  interviewType: string[];
  rounds: number;
  questions: string[];
  user: {
    name: string;
    university: string;
    year: string;
  };
}

// Sample data as fallback
const sampleInterviews: InterviewCardData[] = [
  {
    company: "Tech Giant Corp",
    role: "Software Engineer Intern",
    interviewType: ["Technical", "Behavioral"],
    rounds: 3,
    questions: [
      "Implement a binary search tree",
      "Tell me about a time you worked in a team",
      "System design: Design a URL shortener",
    ],
    user: {
      name: "Alex Chen",
      university: "Stanford University",
      year: "2024",
    },
  },
  {
    company: "Startup Innovation",
    role: "Product Management Intern",
    interviewType: ["Case Study", "Behavioral"],
    rounds: 2,
    questions: [
      "How would you improve our main product?",
      "Tell me about a project you led",
    ],
    user: {
      name: "Sarah Johnson",
      university: "MIT",
      year: "2025",
    },
  },
];

// Helper function to convert Firebase interview to InterviewCard format
const convertFirebaseToCardData = (firebaseInterview: FirebaseInterview): InterviewCardData => {
  return {
    company: firebaseInterview.company,
    role: firebaseInterview.role,
    interviewType: firebaseInterview.interviewType.split(',').map(type => type.trim()),
    rounds: firebaseInterview.rounds,
    questions: firebaseInterview.questions.split('\n').filter(q => q.trim().length > 0).slice(0, 3),
    user: {
      name: firebaseInterview.createdByEmail?.split('@')[0] || "Anonymous User",
      university: "University",
      year: "2024",
    },
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [interviews, setInterviews] = useState<InterviewCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recent interviews from Firebase
  useEffect(() => {
    const fetchRecentInterviews = async () => {
      try {
        console.log("Fetching recent interviews from Firebase...");
        const interviewsRef = collection(db, "interviews");
        const q = query(
          interviewsRef, 
          orderBy("createdAt", "desc"), 
          limit(6) // Show only the 6 most recent
        );
        const querySnapshot = await getDocs(q);
        
        console.log("Found recent interviews:", querySnapshot.size);
        
        const firebaseInterviews: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          firebaseInterviews.push({
            id: doc.id,
            ...data
          });
        });

        // Convert Firebase interviews to card format
        const convertedInterviews = firebaseInterviews
          .filter(interview => interview.status === 'pending' || interview.status === 'approved')
          .map(convertFirebaseToCardData);

        // If we have Firebase interviews, use them, otherwise fallback to sample data
        const displayInterviews = convertedInterviews.length > 0 
          ? [...convertedInterviews, ...sampleInterviews].slice(0, 6)
          : sampleInterviews;
          
        setInterviews(displayInterviews);
        
        console.log("Successfully loaded recent interviews:", displayInterviews.length);
      } catch (error) {
        console.error("Error fetching recent interviews:", error);
        // Fallback to sample data
        setInterviews(sampleInterviews);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInterviews();
  }, []);

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewType.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner - Updated to blue theme */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Intern Interview Unlocked
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Your gateway to transparent internship interviews. Learn from real experiences, 
                share your journey, and help create equal opportunities for all students.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => navigate('/create-interview')}
                >
                  Share Your Experience
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById('recent')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Interviews
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features - Updated styling */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Prep Well?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of students who have unlocked interview success through our platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Real Experiences</h3>
                <p className="text-gray-600">
                  Learn from verified student experiences at top companies and startups
                </p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Detailed Insights</h3>
                <p className="text-gray-600">
                  Get specific interview questions, processes, and preparation strategies
                </p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Community Driven</h3>
                <p className="text-gray-600">
                  Join a supportive community of students helping each other succeed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Video Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Tips & Tricks</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch our expert tips on how to ace your internship interviews
              </p>
            </div>
            <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/we7ba0slWrc"
                title="Internship Interview Tips"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/interviews')}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch More Tips
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Content Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="flex justify-between items-center mb-8" id="recent">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Recent Interview Experiences
                </h2>
                <p className="text-gray-600 mt-1">
                  Latest insights from students who landed their dream internships
                </p>
              </div>
              <Button 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/interviews')}
              >
                View All
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-gray-600">Loading recent interviews...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredInterviews.map((interview, index) => (
                    <InterviewCard key={`${interview.company}-${index}`} {...interview} />
                  ))}
                </div>

                {filteredInterviews.length === 0 && searchQuery && (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <h3 className="text-xl font-medium mb-2">No interviews found</h3>
                    <p className="text-gray-500 mb-4">
                      No interviews match your search for "{searchQuery}"
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}

                {interviews.length === 0 && !searchQuery && (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <h3 className="text-xl font-medium mb-2">No interviews yet</h3>
                    <p className="text-gray-500 mb-4">
                      Be the first to share an interview experience!
                    </p>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => navigate('/create-interview')}
                    >
                      Share Your Experience
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-500 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Help other students by sharing your interview experience and build a stronger community together.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-white text-blue-500 hover:bg-gray-100"
                onClick={() => navigate('/create-interview')}
              >
                Share Interview Experience
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-blue-600"
                onClick={() => navigate('/about')}
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;