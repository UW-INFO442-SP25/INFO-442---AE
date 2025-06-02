import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Edit, Trash2, Plus, Calendar, Eye } from "lucide-react";

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

interface ContributionData {
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
  date: string;
  views: number;
}

// Helper function to convert Firebase interview to contribution format
const convertFirebaseToContributionData = (firebaseInterview: FirebaseInterview): ContributionData => {
  const createdDate = firebaseInterview.createdAt?.toDate ? 
    firebaseInterview.createdAt.toDate() : 
    new Date();
  
  return {
    id: firebaseInterview.id,
    company: firebaseInterview.company,
    role: firebaseInterview.role,
    interviewType: firebaseInterview.interviewType,
    rounds: firebaseInterview.rounds,
    process: firebaseInterview.process,
    questions: firebaseInterview.questions,
    preparation: firebaseInterview.preparation,
    timeline: firebaseInterview.timeline,
    difficulty: firebaseInterview.difficulty,
    date: createdDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    views: Math.floor(Math.random() * 500) + 50, // Random views for now
  };
};

const Contributions = () => {
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContribution, setEditingContribution] = useState<ContributionData | null>(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    role: "",
    interviewType: "",
    rounds: "",
    process: "",
    questions: "",
    preparation: "",
    timeline: "",
    difficulty: "Medium",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Fetch user's contributions from Firebase
  useEffect(() => {
    const fetchUserContributions = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user contributions...");
        const interviewsRef = collection(db, "interviews");
        const q = query(
          interviewsRef, 
          where("createdBy", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        
        console.log("Found user contributions:", querySnapshot.size);
        
        const firebaseInterviews: FirebaseInterview[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirebaseInterview, 'id'>;
          firebaseInterviews.push({
            id: doc.id,
            ...data
          });
        });

        // Sort by createdAt on the client side
        firebaseInterviews.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });

        // Convert Firebase interviews to contribution format
        const convertedContributions = firebaseInterviews.map(convertFirebaseToContributionData);
          
        setContributions(convertedContributions);
        
        console.log("Successfully loaded user contributions:", convertedContributions.length);
      } catch (error) {
        console.error("Error fetching user contributions:", error);
        toast({
          title: "Error",
          description: "Failed to load your contributions.",
          variant: "destructive",
        });
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContributions();
  }, [currentUser]);

  // Handle edit button click
  const handleEdit = (contribution: ContributionData) => {
    setEditingContribution(contribution);
    setEditFormData({
      company: contribution.company,
      role: contribution.role,
      interviewType: contribution.interviewType,
      rounds: contribution.rounds.toString(),
      process: contribution.process,
      questions: contribution.questions,
      preparation: contribution.preparation || "",
      timeline: contribution.timeline || "",
      difficulty: contribution.difficulty,
    });
    setIsEditDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!editingContribution) return;

    setIsUpdating(true);
    try {
      const interviewRef = doc(db, "interviews", editingContribution.id);
      await updateDoc(interviewRef, {
        company: editFormData.company,
        role: editFormData.role,
        interviewType: editFormData.interviewType,
        rounds: parseInt(editFormData.rounds, 10),
        process: editFormData.process,
        questions: editFormData.questions,
        preparation: editFormData.preparation,
        timeline: editFormData.timeline,
        difficulty: editFormData.difficulty,
      });

      // Update local state
      setContributions(prev => prev.map(contrib => 
        contrib.id === editingContribution.id 
          ? {
              ...contrib,
              company: editFormData.company,
              role: editFormData.role,
              interviewType: editFormData.interviewType,
              rounds: parseInt(editFormData.rounds, 10),
              process: editFormData.process,
              questions: editFormData.questions,
              preparation: editFormData.preparation,
              timeline: editFormData.timeline,
              difficulty: editFormData.difficulty,
            }
          : contrib
      ));

      toast({
        title: "Success!",
        description: "Your interview experience has been updated.",
      });

      setIsEditDialogOpen(false);
      setEditingContribution(null);
    } catch (error) {
      console.error("Error updating contribution:", error);
      toast({
        title: "Error",
        description: "Failed to update your contribution.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading your contributions...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Contributions</h1>
            <p className="text-gray-600 mt-1">
              {contributions.length === 0 
                ? "You haven't shared any experiences yet" 
                : `${contributions.length} interview experience${contributions.length === 1 ? '' : 's'} shared`
              }
            </p>
          </div>
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate('/create-interview')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Share New Experience
          </Button>
        </div>

        {contributions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium mb-4">No contributions yet</h3>
              <p className="text-gray-500 mb-6">
                Start helping other students by sharing your interview experiences. 
                Your insights could make the difference in someone's career journey.
              </p>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate('/create-interview')}
              >
                Share Your First Experience
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {contributions.map((contribution) => (
              <Card key={contribution.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{contribution.company}</CardTitle>
                      <p className="text-gray-600 mt-1">{contribution.role}</p>
                      <div className="flex gap-2 mt-3">
                        {contribution.interviewType.split(',').map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type.trim()}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {contribution.rounds} Rounds
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {contribution.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contribution)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const companySlug = contribution.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                          navigate(`/interview/${companySlug}`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Interview Process</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{contribution.process}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Sample Questions</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{contribution.questions}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {contribution.date}
                        </span>
                        <span>{contribution.views} views</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Interview Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-company">Company Name</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    value={editFormData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Input
                    id="edit-role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-interviewType">Interview Type</Label>
                  <Input
                    id="edit-interviewType"
                    name="interviewType"
                    value={editFormData.interviewType}
                    onChange={handleInputChange}
                    placeholder="e.g., Technical, Behavioral"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rounds">Number of Rounds</Label>
                  <Input
                    id="edit-rounds"
                    name="rounds"
                    type="number"
                    value={editFormData.rounds}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-process">Interview Process</Label>
                <Textarea
                  id="edit-process"
                  name="process"
                  value={editFormData.process}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="edit-questions">Sample Questions</Label>
                <Textarea
                  id="edit-questions"
                  name="questions"
                  value={editFormData.questions}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="edit-preparation">Preparation Tips</Label>
                <Textarea
                  id="edit-preparation"
                  name="preparation"
                  value={editFormData.preparation}
                  onChange={handleInputChange}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-timeline">Timeline</Label>
                  <Input
                    id="edit-timeline"
                    name="timeline"
                    value={editFormData.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 weeks from application to offer"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <select
                    id="edit-difficulty"
                    name="difficulty"
                    value={editFormData.difficulty}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Contributions;