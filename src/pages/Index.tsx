
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import InterviewCard from "@/components/InterviewCard";
import InterviewSubmissionForm from "@/components/InterviewSubmissionForm";
import { Button } from "@/components/ui/button";

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

  const filteredInterviews = sampleInterviews.filter(
    (interview) =>
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Intern Interview Unlocked
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover real internship interview experiences shared by students, for students.
          </p>
        </div>

        <div className="mb-12">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Recent Interview Experiences
          </h2>
          <Button
            onClick={() => setShowSubmissionForm(!showSubmissionForm)}
            className="bg-primary hover:bg-primary/90"
          >
            {showSubmissionForm ? "Close Form" : "Share Your Experience"}
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
  );
};

export default Index;
