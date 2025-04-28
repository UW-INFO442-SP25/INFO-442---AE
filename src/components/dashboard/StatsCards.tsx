
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  value: string | number;
  label: string;
  change?: string;
  route?: string;
  className?: string;
}

const StatCard = ({ value, label, change, route, className = "" }: StatCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`p-6 bg-blue-50 ${route ? "cursor-pointer hover:bg-blue-100 transition-colors" : ""} ${className}`}
      onClick={route ? () => navigate(route) : undefined}
    >
      <div className="text-4xl font-bold text-blue-500 mb-1">{value}</div>
      <div className="text-gray-700 mb-2">{label}</div>
      {change && <div className="text-sm text-gray-500">{change}</div>}
    </Card>
  );
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        value="47" 
        label="Interviews Explored" 
        change="+12 from last week" 
        route="/interviews"
      />
      <StatCard 
        value="18" 
        label="Companies Researched" 
        change="+3 from last week" 
      />
      <StatCard 
        value="2" 
        label="Your Contributions" 
        change="Help others by sharing more" 
        route="/my-contributions"
      />
    </div>
  );
};

export default StatsCards;
