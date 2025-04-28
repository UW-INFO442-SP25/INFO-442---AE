
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample recommended interview content
const recommendedContent = [
  {
    id: 1,
    company: "Google",
    role: "Product Designer",
    title: "Design Exercise Process",
    description: "Learn about Google's product design case study format and evaluation criteria.",
    isNew: false,
    isRecommended: true,
  },
  {
    id: 2,
    company: "Ramp",
    role: "UX Designer",
    title: "Portfolio Review Tips",
    description: "Get insights on Ramp's portfolio review process from recent interviews.",
    isNew: true,
    isRecommended: false,
  },
];

const RecommendedContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedContent.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {item.company}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {item.role}
                  </Badge>
                </div>
                {item.isNew && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    NEW
                  </Badge>
                )}
                {item.isRecommended && (
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    RECOMMENDED
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/interview/${item.company.toLowerCase()}`);
                }}
              >
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedContent;
