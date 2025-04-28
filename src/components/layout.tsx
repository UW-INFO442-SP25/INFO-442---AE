
import { Info, Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center gap-2 ${location.pathname === '/' ? 'text-blue-600 font-bold' : 'text-gray-900 hover:text-blue-600'}`}
              >
                <Home className="h-5 w-5" />
                <span className="font-semibold">Home</span>
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-blue-600 font-bold' : 'text-gray-900 hover:text-blue-600'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-semibold">Dashboard</span>
              </Link>
              <Link 
                to="/interviews" 
                className={`flex items-center gap-2 ${location.pathname === '/interviews' ? 'text-blue-600 font-bold' : 'text-gray-900 hover:text-blue-600'}`}
              >
                <span className="font-semibold">Interviews</span>
              </Link>
            </div>
            <Link 
              to="/about" 
              className={`flex items-center gap-2 ${location.pathname === '/about' ? 'text-blue-600 font-bold' : 'text-gray-900 hover:text-blue-600'}`}
            >
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
