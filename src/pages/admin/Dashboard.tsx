import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Image,
  DollarSign,
  UserCog,
  Map,
  ExternalLink,
} from "lucide-react";
import { BackupExport } from "@/components/admin/BackupExport";
import { SEO } from "@/components/SEO";

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
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Manage Team",
      description: "Update team member information and photos",
      icon: Users,
      href: "/admin/team",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Manage Hero Images",
      description: "Update carousel images and text",
      icon: Image,
      href: "/admin/hero",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "View Donations",
      description: "See all donations and statistics",
      icon: DollarSign,
      href: "/admin/donations",
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Manage Programs",
      description: "Update program details and services",
      icon: UserCog,
      href: "/admin/programs",
      color: "bg-rose-500/10 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Admin Dashboard"
        description="Administrative dashboard for Extended Hands Initiative"
      />
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage all aspects of your website
            </p>
          </div>
          <div className="flex gap-2">
            <BackupExport />
            <Link to="/sitemap">
              <Button variant="outline" className="gap-2">
                <Map className="h-4 w-4" />
                View Sitemap
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="p-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group"
                onClick={() => navigate(section.href)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {section.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(section.href);
                      }}
                    >
                      Manage
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                View Homepage
              </Button>
            </Link>
            <Link to="/team">
              <Button variant="ghost" size="sm">
                View Team Page
              </Button>
            </Link>
            <Link to="/stories">
              <Button variant="ghost" size="sm">
                View Stories
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="ghost" size="sm">
                View Donate Page
              </Button>
            </Link>
            <Link to="/sitemap">
              <Button variant="ghost" size="sm">
                View Sitemap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;