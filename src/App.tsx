
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import InterviewDetail from "./pages/InterviewDetail";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Bookmarks from "./pages/Bookmarks";
import Contributions from "./pages/Contributions";
import Interviews from "./pages/Interviews";
import CreateInterview from "./pages/CreateInterview";
// Firebase test
import FirebaseTest from "./pages/FirebaseTest";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
<<<<<<< HEAD
      <BrowserRouter>
        <Routes>
          <Route path="/create-interview" element={<CreateInterview />} />
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
=======
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/interview/:id" element={<InterviewDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            <Route path="/my-contributions" element={
              <ProtectedRoute>
                <Contributions />
              </ProtectedRoute>
            } />
            <Route path="/interviews" element={
              <ProtectedRoute>
                <Interviews />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
>>>>>>> 42215a582c93fd0758f4a7f6f44b362e409eea4c
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
