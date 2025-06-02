import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InterviewCard from "@/components/InterviewCard";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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

interface InterviewCardData {
  company: string;
  role: string;
  interviewType: string[];
  rounds: number;
  questions: string[];
  user: {
    name: string;
    university: string;
    year: string;
  };
}

// Sample data as fallback
const sampleInterviews: InterviewCardData[] = [
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
];

// Helper function to convert Firebase interview to InterviewCard format
const convertFirebaseToCardData = (firebaseInterview: FirebaseInterview): InterviewCardData => {
  return {
    company: firebaseInterview.company,
    role: firebaseInterview.role,
    interviewType: firebaseInterview.interviewType.split(',').map(type => type.trim()),
    rounds: firebaseInterview.rounds,
    questions: firebaseInterview.questions.split('\n').filter(q => q.trim().length > 0).slice(0, 3),
    user: {
      name: firebaseInterview.createdByEmail?.split('@')[0] || "Anonymous User",
      university: "University",
      year: "2024",
    },
  };
};

const Interviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [interviews, setInterviews] = useState<InterviewCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch interviews from Firebase
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        console.log("Fetching interviews from Firebase...");
        const interviewsRef = collection(db, "interviews");
        const q = query(interviewsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        console.log("Found interviews:", querySnapshot.size);
        
        const firebaseInterviews: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          firebaseInterviews.push({
            id: doc.id,
            ...data
          });
        });

        // Convert Firebase interviews to card format
        const convertedInterviews = firebaseInterviews
          .filter(interview => interview.status === 'pending' || interview.status === 'approved')
          .map(convertFirebaseToCardData);

        // Combine with sample data for now
        const allInterviews = [...convertedInterviews, ...sampleInterviews];
        setInterviews(allInterviews);
        
        console.log("Successfully loaded interviews:", allInterviews.length);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        toast({
          title: "Error",
          description: "Failed to load interviews. Showing sample data.",
          variant: "destructive",
        });
        // Fallback to sample data
        setInterviews(sampleInterviews);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Generate filter options from current interviews
  const companies = ["All Companies", ...Array.from(new Set(interviews.map(interview => interview.company)))];
  const roles = ["All Roles", ...Array.from(new Set(interviews.map(interview => {
    // Extract base role (remove "Intern" suffix for grouping)
    return interview.role.replace(/\s+(Intern|Internship)$/i, '').trim();
  })))];

  // Filter interviews based on search and filters
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = 
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewType.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompany = selectedCompany === "All Companies" || interview.company === selectedCompany;
    const matchesRole = selectedRole === "All Roles" || interview.role.toLowerCase().includes(selectedRole.toLowerCase());
    
    return matchesSearch && matchesCompany && matchesRole;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading interviews...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Experiences</h1>
              <p className="text-gray-600 mt-1">{interviews.length} total experiences</p>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                navigate('/create-interview')
                toast({
                  title: "Share Your Experience",
                  description: "Help others by sharing your interview experience.",
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
              <InterviewCard key={`${interview.company}-${index}`} {...interview} />
            ))}
          </div>

          {filteredInterviews.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-xl font-medium mb-2">No interviews found</h3>
              <p className="text-gray-500 mb-4">
                {interviews.length === 0 
                  ? "Be the first to share an interview experience!"
                  : "Try adjusting your search or filters to find more interviews"
                }
              </p>
              <div className="flex gap-2 justify-center">
                {interviews.length > 0 && (
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
                )}
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => navigate('/create-interview')}
                >
                  Share Your Experience
                </Button>
              </div>
            </div>
          )}

          {filteredInterviews.length > 0 && (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Interviews;