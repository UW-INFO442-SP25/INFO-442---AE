import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardSidebar from "@/components/DashboardSidebar";
import FeaturedCompanies from "@/components/FeaturedCompanies";

// Sample recommended interview content
const recommendedContent = [
  {
    id: 1,
    company: "Google",
    role: "Product Designer",
    title: "Design Exercise Process",
    description: "Learn about Google's product design case study format and evaluation criteria.",
    isNew: false,
    isRecommended: true,
  },
  {
    id: 2,
    company: "Ramp",
    role: "UX Designer",
    title: "Portfolio Review Tips",
    description: "Get insights on Ramp's portfolio review process from recent interviews.",
    isNew: true,
    isRecommended: false,
  },
];

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

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="w-80">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10 pr-4 py-2" 
                  placeholder="Search for companies, roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              className="p-6 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors" 
              onClick={() => navigate('/interviews')}
            >
              <div className="text-4xl font-bold text-blue-500 mb-1">47</div>
              <div className="text-gray-700 mb-2">Interviews Explored</div>
              <div className="text-sm text-gray-500">+12 from last week</div>
            </Card>
            
            <Card className="p-6 bg-blue-50">
              <div className="text-4xl font-bold text-blue-500 mb-1">18</div>
              <div className="text-gray-700 mb-2">Companies Researched</div>
              <div className="text-sm text-gray-500">+3 from last week</div>
            </Card>
            
            <Card 
              className="p-6 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => navigate('/my-contributions')}
            >
              <div className="text-4xl font-bold text-blue-500 mb-1">2</div>
              <div className="text-gray-700 mb-2">Your Contributions</div>
              <div className="text-sm text-gray-500">Help others by sharing more</div>
            </Card>
          </div>

          {/* Featured Companies with Search */}
          <div className="mb-12">
            <FeaturedCompanies />
          </div>

          {/* Recommended Content */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedContent.map((item) => (
                <Card key={item.id} className="overflow-hidden">
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
                      {item.isNew && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          NEW
                        </Badge>
                      )}
                      {item.isRecommended && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          RECOMMENDED
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/interview/${item.company.toLowerCase()}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Interview Experiences */}
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
