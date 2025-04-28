
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Sample featured companies data
const featuredCompanies = [
  {
    id: 1,
    name: "Google",
    roles: ["Software Engineer", "Product Designer", "Data Scientist"],
    industry: "Technology",
    interviewCount: 12,
  },
  {
    id: 2,
    name: "Amazon",
    roles: ["UX Designer", "Software Developer", "Product Manager"],
    industry: "E-commerce",
    interviewCount: 8,
  },
  {
    id: 3,
    name: "Meta",
    roles: ["Frontend Engineer", "UX Researcher", "UI Designer"],
    industry: "Social Media",
    interviewCount: 10,
  },
  {
    id: 4,
    name: "Apple",
    roles: ["iOS Engineer", "Product Designer", "Machine Learning Engineer"],
    industry: "Technology",
    interviewCount: 7,
  },
  {
    id: 5,
    name: "Microsoft",
    roles: ["Software Engineer", "Cloud Architect", "Data Engineer"],
    industry: "Technology",
    interviewCount: 9,
  },
  {
    id: 6,
    name: "Ramp",
    roles: ["UX Designer", "Frontend Developer", "Product Manager"],
    industry: "FinTech",
    interviewCount: 5,
  },
];

const FeaturedCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Filter companies based on search query
  const filteredCompanies = featuredCompanies.filter(
    (company) => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="featured-companies-section space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Companies</h2>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          className="pl-10 pr-4 py-2" 
          placeholder="Search companies, roles, industries..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {company.industry}
                </Badge>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Popular Roles</div>
                <div className="flex flex-wrap gap-2">
                  {company.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-gray-600">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {company.interviewCount} interviews
                </div>
                <Button 
                  onClick={() => navigate(`/interview/${company.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No companies found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default FeaturedCompanies;
