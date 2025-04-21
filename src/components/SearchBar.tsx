
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <div className="search-container p-4 rounded-lg">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          className="pl-10 h-12 w-full bg-white"
          placeholder="Search by company, role, or interview type..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
