import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Image, DollarSign, UserCog } from "lucide-react";
import { BackupExport } from "@/components/admin/BackupExport";

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminSections = [
    {
      title: "Manage Stories",
      description: "Add, edit, or delete success stories",
      icon: FileText,
      href: "/admin/stories",
    },
    {
      title: "Manage Team",
      description: "Update team member information",
      icon: Users,
      href: "/admin/team",
    },
    {
      title: "Manage Hero Images",
      description: "Update carousel images and text",
      icon: Image,
      href: "/admin/hero",
    },
    {
      title: "View Donations",
      description: "See all donations and statistics",
      icon: DollarSign,
      href: "/admin/donations",
    },
    {
      title: "Manage Programs",
      description: "Update program details and services",
      icon: UserCog,
      href: "/admin/programs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <BackupExport />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="p-6 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                    <p className="text-muted-foreground mb-4">{section.description}</p>
                    <Button onClick={() => navigate(section.href)}>
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
