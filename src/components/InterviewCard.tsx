
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InterviewCardProps {
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

const InterviewCard = ({
  company,
  role,
  interviewType,
  rounds,
  questions,
  user,
}: InterviewCardProps) => {
  return (
    <Card className="interview-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{company}</CardTitle>
        <div className="text-sm text-gray-600">{role}</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {interviewType.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-medium mb-1">Interview Process</div>
            <div className="text-sm text-gray-600">{rounds} Rounds</div>
          </div>
          <div>
            <div className="font-medium mb-1">Sample Questions</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600">
              Shared by {user.name} • {user.university} • Class of {user.year}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;
