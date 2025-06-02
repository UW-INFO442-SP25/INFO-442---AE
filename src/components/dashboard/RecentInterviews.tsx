// Updated RecentInterviews.tsx component
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

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

interface DashboardInterview {
  id: string;
  company: string;
  role: string;
  title: string;
  sharedBy: string;
  date: string;
}

// Sample recent interviews as fallback
const sampleRecentInterviews: DashboardInterview[] = [
  {
    id: "1",
    company: "Figma",
    role: "Product Designer",
    title: "Full Interview Process (5 rounds)",
    sharedBy: "UC Berkeley grad",
    date: "Apr 2025",
  },
  {
    id: "2",
    company: "Airbnb",
    role: "UX Designer",
    title: "Whiteboard Challenge Experience",
    sharedBy: "Stanford grad",
    date: "Mar 2025",
  },
];

// Helper function to convert Firebase interview to dashboard format
const convertFirebaseToDashboardData = (firebaseInterview: FirebaseInterview): DashboardInterview => {
  const createdDate = firebaseInterview.createdAt?.toDate ? 
    firebaseInterview.createdAt.toDate() : 
    new Date();
  
  return {
    id: firebaseInterview.id,
    company: firebaseInterview.company,
    role: firebaseInterview.role,
    title: `${firebaseInterview.rounds} Round Interview Process`,
    sharedBy: firebaseInterview.createdByEmail?.split('@')[0] || "Anonymous User",
    date: createdDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
  };
};

const RecentInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<DashboardInterview[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch recent interviews from Firebase
  useEffect(() => {
    const fetchRecentInterviews = async () => {
      try {
        console.log("Fetching recent interviews for dashboard...");
        const interviewsRef = collection(db, "interviews");
        const q = query(
          interviewsRef, 
          orderBy("createdAt", "desc"), 
          limit(4) // Show only the 4 most recent for dashboard
        );
        const querySnapshot = await getDocs(q);
        
        console.log("Found recent interviews for dashboard:", querySnapshot.size);
        
        const firebaseInterviews: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          firebaseInterviews.push({
            id: doc.id,
            ...data
          });
        });

        // Convert Firebase interviews to dashboard format
        const convertedInterviews = firebaseInterviews
          .filter(interview => interview.status === 'pending' || interview.status === 'approved')
          .map(convertFirebaseToDashboardData);

        // If we have Firebase interviews, use them, otherwise fallback to sample data
        const displayInterviews = convertedInterviews.length > 0 
          ? [...convertedInterviews, ...sampleRecentInterviews].slice(0, 4)
          : sampleRecentInterviews;
          
        setInterviews(displayInterviews);
        
        console.log("Successfully loaded recent interviews for dashboard:", displayInterviews.length);
      } catch (error) {
        console.error("Error fetching recent interviews for dashboard:", error);
        // Fallback to sample data
        setInterviews(sampleRecentInterviews);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInterviews();
  }, []);
  
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Interview Experiences</h2>
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Loading recent interviews...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Interview Experiences</h2>
      <div className="space-y-4">
        {interviews.map((interview) => (
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