
import { Info, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-primary">
                <Home className="h-5 w-5" />
                <span className="font-semibold">Home</span>
              </Link>
            </div>
            <Link to="/about" className="flex items-center gap-2 text-gray-900 hover:text-primary">
              <Info className="h-5 w-5" />
              <span className="font-semibold">About</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};
