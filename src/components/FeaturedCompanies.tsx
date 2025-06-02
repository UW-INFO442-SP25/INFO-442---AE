import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
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

interface CompanyData {
  name: string;
  roles: string[];
  industry: string;
  interviewCount: number;
}

// Helper function to determine industry based on company name
const getIndustryFromCompany = (companyName: string): string => {
  const tech = ['google', 'microsoft', 'apple', 'meta', 'amazon', 'netflix', 'uber', 'airbnb', 'stripe', 'spotify'];
  const finance = ['goldman', 'morgan', 'jpmorgan', 'blackrock', 'citadel', 'two sigma'];
  const consulting = ['mckinsey', 'bain', 'bcg', 'deloitte', 'accenture'];
  const startup = ['startup', 'tech startup', 'fintech'];
  
  const company = companyName.toLowerCase();
  
  if (tech.some(t => company.includes(t))) return 'Technology';
  if (finance.some(f => company.includes(f))) return 'Finance';
  if (consulting.some(c => company.includes(c))) return 'Consulting';
  if (startup.some(s => company.includes(s))) return 'Startup';
  
  return 'Technology'; // Default
};

const FeaturedCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log("Fetching companies from Firebase...");
        const interviewsRef = collection(db, "interviews");
        const querySnapshot = await getDocs(interviewsRef);
        
        const interviewsData: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          interviewsData.push({
            id: doc.id,
            ...data
          });
        });

        // Group interviews by company
        const companyMap = new Map<string, { roles: Set<string>, count: number }>();
        
        interviewsData.forEach((interview) => {
          const companyName = interview.company;
          if (!companyMap.has(companyName)) {
            companyMap.set(companyName, { roles: new Set(), count: 0 });
          }
          
          const companyData = companyMap.get(companyName)!;
          companyData.roles.add(interview.role);
          companyData.count += 1;
        });

        // Convert to array and sort by interview count
        const companiesArray: CompanyData[] = Array.from(companyMap.entries())
          .map(([name, data]) => ({
            name,
            roles: Array.from(data.roles),
            industry: getIndustryFromCompany(name),
            interviewCount: data.count
          }))
          .sort((a, b) => b.interviewCount - a.interviewCount) // Sort by most interviews
          .slice(0, 6); // Show top 6 companies

        setCompanies(companiesArray);
        console.log("Successfully loaded companies:", companiesArray);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);
  
  // Filter companies based on search query
  const filteredCompanies = companies.filter(
    (company) => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="featured-companies-section space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Companies</h2>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      {companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">No companies yet</h3>
          <p className="text-gray-500 mb-4">
            Be the first to share an interview experience!
          </p>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate('/create-interview')}
          >
            Share Your Experience
          </Button>
        </div>
      ) : (
        <>
          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.name} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{company.name}</h3>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {company.industry}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Available Roles</div>
                    <div className="flex flex-wrap gap-2">
                      {company.roles.slice(0, 3).map((role) => (
                        <Badge key={role} variant="outline" className="text-gray-600">
                          {role.length > 20 ? `${role.substring(0, 20)}...` : role}
                        </Badge>
                      ))}
                      {company.roles.length > 3 && (
                        <Badge variant="outline" className="text-gray-600">
                          +{company.roles.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {company.interviewCount} interview{company.interviewCount === 1 ? '' : 's'}
                    </div>
                    <Button 
                      onClick={() => {
                        const companySlug = company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        navigate(`/interview/${companySlug}`);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              No companies found matching "{searchQuery}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedCompanies;