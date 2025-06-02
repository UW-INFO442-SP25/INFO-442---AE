// src/pages/Interviews.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InterviewCard from "@/components/InterviewCard";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

import useDebounce from "@/hooks/useDebounce";
import useInterviewSearch from "@/hooks/useInterviewSearch";

/* ------------------------------------------------------------------ */
/*  Types */
/* ------------------------------------------------------------------ */

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
  createdAt: Timestamp;
  createdBy: string;
  createdByEmail: string;
  status: string;
}

interface RemoteInterview {
  id: number;
  company: string;
  role: string;
  type: string;
  outcome?: string;
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

/* ------------------------------------------------------------------ */
/*  Helpers */
/* ------------------------------------------------------------------ */

// Convert a Firestore doc to the structure InterviewCard expects
const convertFirebaseToCardData = (
  fb: FirebaseInterview,
): InterviewCardData => ({
  company: fb.company,
  role: fb.role,
  interviewType: fb.interviewType
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean),
  rounds: fb.rounds,
  questions: fb.questions
    .split("\n")
    .filter((q) => q.trim())
    .slice(0, 3),
  user: {
    name: fb.createdByEmail?.split("@")[0] || "Anonymous",
    university: "University",
    year: "2024",
  },
});

// Convert a row returned by /api/search to InterviewCardData
const convertRemoteToCardData = (r: RemoteInterview): InterviewCardData => ({
  company: r.company,
  role: r.role,
  interviewType: [r.type],
  rounds: 0,
  questions: [],
  user: {
    name: "Contributor",
    university: "",
    year: "",
  },
});

/* ------------------------------------------------------------------ */
/*  Fallback sample data */
/* ------------------------------------------------------------------ */

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
    user: { name: "Alex Chen", university: "Stanford", year: "2024" },
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
    user: { name: "Sarah Johnson", university: "MIT", year: "2025" },
  },
];

/* ------------------------------------------------------------------ */
/*  Component */
/* ------------------------------------------------------------------ */

const Interviews = () => {
  /* ------------------------ local state ------------------------ */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  const [firebaseInterviews, setFirebaseInterviews] = useState<
    InterviewCardData[]
  >([]);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  const navigate = useNavigate();

  /* ------------------------ Firestore ------------------------- */
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const ref = collection(db, "interviews");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const converted = snap.docs
          .map(
            (d) =>
              ({
                id: d.id,
                ...d.data(),
              } as FirebaseInterview),
          )
          .filter((ivw) => ivw.status === "pending" || ivw.status === "approved")
          .map(convertFirebaseToCardData);

        setFirebaseInterviews([...converted, ...sampleInterviews]);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load interviews. Showing sample data.",
          variant: "destructive",
        });
        setFirebaseInterviews(sampleInterviews);
      } finally {
        setFirebaseLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  /* ------------------------ Server search ---------------------- */
  const {
    data: remoteRaw = [],
    isFetching: searchLoading,
  } = useInterviewSearch(debouncedQuery);

  const remoteResults: InterviewCardData[] = (
    remoteRaw as RemoteInterview[]
  ).map(convertRemoteToCardData);

  /* ------------------------ filtering -------------------------- */
  // Which list are we currently displaying?
  const baseInterviews =
    debouncedQuery.trim().length > 0 ? remoteResults : firebaseInterviews;

  const filteredInterviews = baseInterviews.filter((ivw) => {
    const matchCompany =
      selectedCompany === "All Companies" || ivw.company === selectedCompany;
    const matchRole =
      selectedRole === "All Roles" ||
      ivw.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchCompany && matchRole;
  });

  // Dropdown options should come from whatever list we’re viewing
  const companies = [
    "All Companies",
    ...Array.from(new Set(baseInterviews.map((ivw) => ivw.company))),
  ];
  const roles = [
    "All Roles",
    ...Array.from(
      new Set(
        baseInterviews.map((ivw) =>
          ivw.role.replace(/\s+(Intern|Internship)$/i, "").trim(),
        ),
      ),
    ),
  ];

  /* ------------------------ loading states --------------------- */
  if (firebaseLoading || searchLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading interviews…</p>
          </div>
        </div>
      </Layout>
    );
  }

  /* ------------------------ render ----------------------------- */
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Experiences
              </h1>
              <p className="text-gray-600 mt-1">
                {firebaseInterviews.length} total experiences
              </p>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                navigate("/create-interview");
                toast({
                  title: "Share Your Experience",
                  description:
                    "Help others by sharing your interview experience.",
                });
              }}
            >
              Share New Experience
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
            {filteredInterviews.map((ivw, idx) => (
              <InterviewCard key={`${ivw.company}-${idx}`} {...ivw} />
            ))}
          </div>

          {/* Empty state */}
          {filteredInterviews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <h3 className="text-xl font-medium mb-2">No interviews found</h3>
              <p className="text-gray-500 mb-4">
                {firebaseInterviews.length === 0
                  ? "Be the first to share an interview experience!"
                  : "Try adjusting your search or filters to find more interviews"}
              </p>
              <div className="flex gap-2 justify-center">
                {firebaseInterviews.length > 0 && (
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
                  onClick={() => navigate("/create-interview")}
                >
                  Share Your Experience
                </Button>
              </div>
            </div>
          )}

          {/* Pagination (placeholder) */}
          {filteredInterviews.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
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
