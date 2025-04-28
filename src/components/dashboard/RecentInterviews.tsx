
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample recent interviews
const recentInterviews = [
  {
    id: 1,
    company: "Figma",
    role: "Product Designer",
    title: "Full Interview Process (5 rounds)",
    sharedBy: "UC Berkeley grad",
    date: "Apr 2025",
  },
  {
    id: 2,
    company: "Airbnb",
    role: "UX Designer",
    title: "Whiteboard Challenge Experience",
    sharedBy: "Stanford grad",
    date: "Mar 2025",
  },
];

const RecentInterviews = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Interview Experiences</h2>
      <div className="space-y-4">
        {recentInterviews.map((interview) => (
          <Card key={interview.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {interview.company}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {interview.role}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold">{interview.title}</h3>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-sm text-gray-500 text-right">
                  Shared by {interview.sharedBy} • {interview.date}
                </div>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/interview/${interview.company.toLowerCase()}`);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          className="px-8"
          onClick={() => navigate('/interviews')}
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default RecentInterviews;
