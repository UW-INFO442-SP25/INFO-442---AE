
import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InterviewCard from "@/components/InterviewCard";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Sample data - extended version with more interviews
const allInterviews = [
  {
    company: "Tech Giant Corp",
    role: "Software Engineer Intern",
    interviewType: ["Technical", "Behavioral"],
    rounds: 3,
    questions: [
      "Implement a binary search tree",
      "Tell me about a time you worked in a team",
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
  {
    company: "Design Studio Co",
    role: "UX Designer Intern",
    interviewType: ["Portfolio", "Design Challenge"],
    rounds: 4,
    questions: [
      "Walk us through your portfolio",
      "Design an app for elderly users in 30 minutes",
    ],
    user: {
      name: "Michael Brown",
      university: "RISD",
      year: "2024",
    },
  },
  {
    company: "Finance First",
    role: "Business Analyst Intern",
    interviewType: ["Case Study", "Technical"],
    rounds: 3,
    questions: [
      "Analyze this market opportunity",
      "How would you value this company?",
    ],
    user: {
      name: "Emma Wilson",
      university: "Harvard University",
      year: "2023",
    },
  },
  {
    company: "Health Tech",
    role: "Data Science Intern",
    interviewType: ["Technical", "Case Study"],
    rounds: 3,
    questions: [
      "Explain how you would build a model for patient outcomes",
      "Analyze this healthcare dataset",
    ],
    user: {
      name: "David Kim",
      university: "UC Berkeley",
      year: "2024",
    },
  },
  {
    company: "Social Network",
    role: "Frontend Engineer Intern",
    interviewType: ["Coding", "System Design"],
    rounds: 2,
    questions: [
      "Implement a responsive dropdown menu",
      "Design a notification system",
    ],
    user: {
      name: "Lisa Garcia",
      university: "CMU",
      year: "2025",
    },
  },
];

// Filter options
const companies = ["All Companies", "Tech Giant Corp", "Startup Innovation", "Design Studio Co", "Finance First", "Health Tech", "Social Network"];
const roles = ["All Roles", "Software Engineer", "Product Management", "UX Designer", "Business Analyst", "Data Science", "Frontend Engineer"];


const Interviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const navigate = useNavigate();


  // Filter interviews based on search and filters
  const filteredInterviews = allInterviews.filter((interview) => {
    const matchesSearch = 
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewType.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompany = selectedCompany === "All Companies" || interview.company === selectedCompany;
    const matchesRole = selectedRole === "All Roles" || interview.role.includes(selectedRole);
    
    return matchesSearch && matchesCompany && matchesRole;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Interview Experiences</h1>
            <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              navigate('/create-interview')
              toast({
                title: "Create New Interview Experience",
                description: "The form has been opened.",
              });
            }}
          >
            Share New Experience
          </Button>
          </div>

          <div className="mb-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
            {filteredInterviews.map((interview, index) => (
              <InterviewCard key={index} {...interview} />
            ))}
          </div>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-xl font-medium mb-2">No interviews found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters to find more interviews
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCompany("All Companies");
                  setSelectedRole("All Roles");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Layout>
  );
};

export default Interviews;
