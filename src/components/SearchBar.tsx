import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <div className="search-container p-6 rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          className="pl-10 h-12 w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search by company, role, or interview type..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;