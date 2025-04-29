
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import InterviewCard from "@/components/InterviewCard";
import InterviewSubmissionForm from "@/components/InterviewSubmissionForm";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";

// Sample data - in a real app, this would come from a database
const sampleInterviews = [
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const navigate = useNavigate();

  const filteredInterviews = sampleInterviews.filter(
    (interview) =>
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-primary/10 py-16">
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
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                  navigate('/create-interview')
                  setShowSubmissionForm(!showSubmissionForm)
                  }}>
                  Share Your Experience
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('recent')?.scrollIntoView({ behavior: 'smooth' })}>
                  Browse Interviews
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Real Experiences</h3>
                <p className="text-gray-600">
                  Learn from verified student experiences at top companies
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Detailed Insights</h3>
                <p className="text-gray-600">
                  Get specific interview questions, processes, and preparation tips
                </p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                <p className="text-gray-600">
                  Join a community of students helping each other succeed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-12">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div className="flex justify-between items-center mb-8" id="recent">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Interview Experiences
            </h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/interviews')}
            >
              View All
            </Button>
          </div>

          {showSubmissionForm && (
            <div className="mb-8">
              <InterviewSubmissionForm />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredInterviews.map((interview, index) => (
              <InterviewCard key={index} {...interview} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
