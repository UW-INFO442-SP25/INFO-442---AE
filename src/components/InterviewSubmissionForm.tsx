
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const InterviewSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // This would typically connect to a backend
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for sharing your experience!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input id="company" placeholder="Enter company name" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" placeholder="e.g., Software Engineer Intern" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="process">Interview Process</Label>
        <Textarea
          id="process"
          placeholder="Describe the interview process and rounds..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="questions">Sample Questions</Label>
        <Textarea
          id="questions"
          placeholder="Share some questions you were asked..."
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Share Your Experience"}
      </Button>
    </form>
  );
};

export default InterviewSubmissionForm;
