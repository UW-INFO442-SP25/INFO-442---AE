
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import RecommendedContent from "@/components/dashboard/RecommendedContent";
import RecentInterviews from "@/components/dashboard/RecentInterviews";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader searchQuery={searchQuery} onSearch={setSearchQuery} />
          <StatsCards />
          <div className="mb-12">
            <FeaturedCompanies />
          </div>
          <RecommendedContent />
          <RecentInterviews />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
