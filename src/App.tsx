import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Stories from "./pages/Stories";
import Team from "./pages/Team";
import Community from "./pages/Community";
import Donate from "./pages/Donate";
import ProgramDetail from "./pages/ProgramDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageStories from "./pages/admin/ManageStories";
import ManageTeam from "./pages/admin/ManageTeam";
import ManageHero from "./pages/admin/ManageHero";
import ViewDonations from "./pages/admin/ViewDonations";
import ManagePrograms from "./pages/admin/ManagePrograms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/team" element={<Team />} />
            <Route path="/community" element={<Community />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/programs/:type" element={<ProgramDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/stories" element={<ManageStories />} />
            <Route path="/admin/team" element={<ManageTeam />} />
            <Route path="/admin/hero" element={<ManageHero />} />
            <Route path="/admin/donations" element={<ViewDonations />} />
            <Route path="/admin/programs" element={<ManagePrograms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
