import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface StatCardProps {
  value: string | number;
  label: string;
  change?: string;
  route?: string;
  className?: string;
  loading?: boolean;
}

const StatCard = ({ value, label, change, route, className = "", loading = false }: StatCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`p-6 bg-blue-50 ${route ? "cursor-pointer hover:bg-blue-100 transition-colors" : ""} ${className}`}
      onClick={route ? () => navigate(route) : undefined}
    >
      <div className="text-4xl font-bold text-blue-500 mb-1">
        {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : value}
      </div>
      <div className="text-gray-700 mb-2">{label}</div>
      {change && <div className="text-sm text-gray-500">{change}</div>}
    </Card>
  );
};

const StatsCards = () => {
  const [contributionsCount, setContributionsCount] = useState<number>(0);
  const [totalInterviews, setTotalInterviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user's contributions
        const userInterviewsRef = collection(db, "interviews");
        const userQuery = query(
          userInterviewsRef,
          where("createdBy", "==", currentUser.uid)
        );
        const userSnapshot = await getDocs(userQuery);
        setContributionsCount(userSnapshot.size);

        // Fetch total interviews in the platform
        const allInterviewsSnapshot = await getDocs(collection(db, "interviews"));
        setTotalInterviews(allInterviewsSnapshot.size);

      } catch (error) {
        console.error("Error fetching stats:", error);
        setContributionsCount(0);
        setTotalInterviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <StatCard 
        value={contributionsCount} 
        label="Your Contributions" 
        change={contributionsCount === 0 ? "Share your first interview experience" : "Thank you for helping others!"} 
        route="/my-contributions"
        loading={loading}
      />
      <StatCard 
        value={totalInterviews} 
        label="Total Platform Interviews" 
        change="Growing community of shared experiences"
        route="/interviews"
        loading={loading}
      />
    </div>
  );
};

export default StatsCards;