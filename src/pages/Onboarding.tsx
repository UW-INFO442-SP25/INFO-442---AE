
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { setNeedsOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    year: "",
    major: "",
    experience: "",
    interests: [] as string[]
  });

  const steps = [
    {
      title: "Tell us about yourself",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              placeholder="Enter your university"
              value={formData.university}
              onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      title: "Academic Information",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Graduation Year</Label>
            <Input
              id="year"
              placeholder="e.g., 2025"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Major/Field of Study</Label>
            <Input
              id="major"
              placeholder="e.g., Computer Science"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      title: "Experience Level",
      content: (
        <div className="space-y-4">
          <Label>How would you describe your internship experience?</Label>
          <RadioGroup
            value={formData.experience}
            onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">No previous internships</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some" id="some" />
              <Label htmlFor="some">1-2 internships</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="experienced" id="experienced" />
              <Label htmlFor="experienced">3+ internships</Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data and complete setup
      localStorage.setItem("userProfile", JSON.stringify(formData));
      setNeedsOnboarding(false);
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.university;
      case 1:
        return formData.year && formData.major;
      case 2:
        return formData.experience;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600 mb-2">
            Welcome to Prep Well
          </CardTitle>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h3>
            {steps[currentStep].content}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              {currentStep !== steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
