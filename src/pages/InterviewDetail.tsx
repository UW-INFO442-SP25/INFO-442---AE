
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, User, Clock, Bookmark, Share } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// In a real app, this would come from an API
const getInterviewDetail = (id: string) => {
  return {
    company: "Tech Giant Corp",
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
      name: "Alex Chen",
      university: "Stanford University",
      year: "2024",
    },
  };
};

const InterviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const interview = getInterviewDetail(id || "");

  const handleBookmark = () => {
    toast({
      title: "Interview bookmarked",
      description: "This interview has been added to your bookmarks",
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Interview URL has been copied to clipboard",
    });
  };

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
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Bookmark
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
