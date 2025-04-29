import { Layout } from "@/components/layout";
import  InterviewSubmissionForm  from "@/components/InterviewSubmissionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateInterview = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Share Your Interview Experience</h1>
          <p className="text-gray-600 mt-2">
            Help others by sharing your interview process and insights.
          </p>
        </div>

        <InterviewSubmissionForm />
      </div>
    </Layout>
  );
};

export default CreateInterview;