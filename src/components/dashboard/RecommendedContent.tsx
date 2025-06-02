import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Star, Clock } from "lucide-react";

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

interface RecommendedItem {
  id: string;
  company: string;
  role: string;
  title: string;
  description: string;
  isNew: boolean;
  isRecommended: boolean;
  difficulty: string;
  rounds: number;
}

// Helper function to generate description based on interview data
const generateDescription = (interview: FirebaseInterview): string => {
  const types = interview.interviewType.split(',').map(t => t.trim()).join(', ');
  return `Learn about ${interview.company}'s ${interview.rounds}-round ${types.toLowerCase()} interview process and get insights from real candidate experiences.`;
};

// Helper function to determine if interview is "new" (within last 30 days)
const isNewInterview = (createdAt: any): boolean => {
  if (!createdAt || !createdAt.toDate) return false;
  const interviewDate = createdAt.toDate();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return interviewDate > thirtyDaysAgo;
};

// Helper function to determine if interview should be "recommended" 
const isRecommendedInterview = (interview: FirebaseInterview): boolean => {
  // Recommend if it has good preparation tips or is from a well-known company
  const wellKnownCompanies = ['google', 'microsoft', 'apple', 'meta', 'amazon', 'netflix', 'uber', 'airbnb'];
  const companyLower = interview.company.toLowerCase();
  
  return wellKnownCompanies.some(company => companyLower.includes(company)) || 
         (interview.preparation && interview.preparation.length > 50);
};

const RecommendedContent = () => {
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRecommendedContent = async () => {
      try {
        console.log("Fetching recommended content from Firebase...");
        const interviewsRef = collection(db, "interviews");
        const q = query(
          interviewsRef,
          orderBy("createdAt", "desc"),
          limit(10) // Get recent interviews to choose from
        );
        const querySnapshot = await getDocs(q);
        
        const interviewsData: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          interviewsData.push({
            id: doc.id,
            ...data
          });
        });

        // Convert to recommended items format
        const items: RecommendedItem[] = interviewsData
          .filter(interview => interview.status === 'pending' || interview.status === 'approved')
          .map((interview) => ({
            id: interview.id,
            company: interview.company,
            role: interview.role,
            title: `${interview.rounds}-Round ${interview.interviewType} Process`,
            description: generateDescription(interview),
            isNew: isNewInterview(interview.createdAt),
            isRecommended: isRecommendedInterview(interview),
            difficulty: interview.difficulty,
            rounds: interview.rounds,
          }))
          .slice(0, 4); // Show top 4 recommended items

        setRecommendedItems(items);
        console.log("Successfully loaded recommended content:", items);
      } catch (error) {
        console.error("Error fetching recommended content:", error);
        setRecommendedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedContent();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for you</h2>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (recommendedItems.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for you</h2>
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
          <p className="text-gray-500 mb-4">
            Share an interview experience to help us create better recommendations!
          </p>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate('/create-interview')}
          >
            Share Your Experience
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {item.company}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {item.role}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {item.isNew && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <Clock className="h-3 w-3 mr-1" />
                      NEW
                    </Badge>
                  )}
                  {item.isRecommended && (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      <Star className="h-3 w-3 mr-1" />
                      RECOMMENDED
                    </Badge>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.rounds} Rounds
                  </Badge>
                </div>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const companySlug = item.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    navigate(`/interview/${companySlug}`);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedContent;