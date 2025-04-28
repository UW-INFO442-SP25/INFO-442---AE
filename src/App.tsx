
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InterviewDetail from "./pages/InterviewDetail";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Bookmarks from "./pages/Bookmarks";
import Contributions from "./pages/Contributions";
import Interviews from "./pages/Interviews";
// Firebase test
import FirebaseTest from "./pages/FirebaseTest";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/firebase-test" element={<FirebaseTest />} />
          <Route path="/" element={<Index />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/my-contributions" element={<Contributions />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
