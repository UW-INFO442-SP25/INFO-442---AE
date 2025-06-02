import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const InterviewSubmissionForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an interview experience.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Starting submission process...");
      console.log("Current user:", currentUser.uid);
      
      const interviewsRef = collection(db, "interviews");
      const interviewData = {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        status: 'pending',
        rounds: parseInt(formData.rounds, 10)
      };

      console.log("Attempting to add document with data:", interviewData);
      
      const docRef = await addDoc(interviewsRef, interviewData);
      console.log("Document written with ID:", docRef.id);
      
      toast({
        title: "Success!",
        description: "Your interview experience has been submitted successfully. It will appear on the site after review.",
      });
      
      // Reset form
      setFormData({
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
      
      // Navigate to contributions page after a brief delay
      setTimeout(() => {
        navigate('/my-contributions');
      }, 2000);
      
    } catch (error: any) {
      console.error("Detailed error submitting interview experience:", {
        error,
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      toast({
        title: "Error",
        description: `Failed to submit interview experience: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="company">Company Name *</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Software Engineer Intern"
            required
          />
        </div>

        <div>
          <Label htmlFor="interviewType">Interview Type *</Label>
          <Input
            id="interviewType"
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
            placeholder="e.g., Technical, Behavioral, System Design"
            required
          />
        </div>

        <div>
          <Label htmlFor="rounds">Number of Rounds *</Label>
          <Input
            id="rounds"
            name="rounds"
            type="number"
            value={formData.rounds}
            onChange={handleChange}
            placeholder="Enter number of interview rounds"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="process">Interview Process *</Label>
          <Textarea
            id="process"
            name="process"
            value={formData.process}
            onChange={handleChange}
            placeholder="Describe the interview process and rounds..."
            required
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="questions">Sample Questions *</Label>
          <Textarea
            id="questions"
            name="questions"
            value={formData.questions}
            onChange={handleChange}
            placeholder="Share some questions you were asked (one per line)..."
            required
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="preparation">Preparation Tips</Label>
          <Textarea
            id="preparation"
            name="preparation"
            value={formData.preparation}
            onChange={handleChange}
            placeholder="Share your preparation tips and resources..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g., 2 weeks from application to offer"
          />
        </div>

        <div>
          <Label htmlFor="difficulty">Overall Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Share Experience"}
        </Button>
      </div>
      
      {isSubmitting && (
        <div className="text-center text-sm text-gray-600">
          <p>Submitting your experience... This may take a moment.</p>
        </div>
      )}
    </form>
  );
};

export default InterviewSubmissionForm;