import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  Heart, 
  BookOpen, 
  Phone, 
  DollarSign,
  Shield,
  Settings,
  FileText,
  Image,
  UserCog
} from "lucide-react";

const Sitemap = () => {
  const publicPages = [
    {
      title: "Home",
      url: "/",
      description: "Welcome to Extended Hands Initiative - Empowering communities through support and resources",
      icon: Home,
    },
    {
      title: "Our Team",
      url: "/team",
      description: "Meet the dedicated team behind our mission",
      icon: Users,
    },
    {
      title: "Success Stories",
      url: "/stories",
      description: "Read inspiring stories from people we've helped",
      icon: BookOpen,
    },
    {
      title: "Community",
      url: "/community",
      description: "Join our community and connect with others",
      icon: Heart,
    },
    {
      title: "Donate",
      url: "/donate",
      description: "Support our mission with a donation",
      icon: DollarSign,
    },
  ];

  const programPages = [
    {
      title: "Women Empowerment",
      url: "/programs/women",
      description: "Programs supporting women's independence and growth",
    },
    {
      title: "Children Support",
      url: "/programs/children",
      description: "Resources and care for children in need",
    },
    {
      title: "Youth Development",
      url: "/programs/youth",
      description: "Guidance and opportunities for at-risk youth",
    },
    {
      title: "Single Parents",
      url: "/programs/parents",
      description: "Support systems for single parent families",
    },
  ];

  const adminPages = [
    {
      title: "Admin Dashboard",
      url: "/admin",
      description: "Central hub for all administrative tasks",
      icon: Settings,
    },
    {
      title: "Manage Stories",
      url: "/admin/stories",
      description: "Add, edit, or delete success stories",
      icon: FileText,
    },
    {
      title: "Manage Team",
      url: "/admin/team",
      description: "Update team member information and photos",
      icon: Users,
    },
    {
      title: "Manage Hero Images",
      url: "/admin/hero",
      description: "Update homepage carousel images",
      icon: Image,
    },
    {
      title: "Manage Programs",
      url: "/admin/programs",
      description: "Edit program details and services",
      icon: UserCog,
    },
    {
      title: "View Donations",
      url: "/admin/donations",
      description: "See all donations and statistics",
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sitemap"
        description="Complete sitemap of Extended Hands Initiative website - find all pages and resources"
        keywords="sitemap, navigation, extended hands, community support"
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Complete overview of all pages on the Extended Hands Initiative website
          </p>
        </header>

        {/* Public Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Main Pages
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.url}
                  to={page.url}
                  className="p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {page.description}
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-2 block">
                        {page.url}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Program Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Programs
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {programPages.map((page) => (
              <Link
                key={page.url}
                to={page.url}
                className="p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {page.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {page.description}
                </p>
                <span className="text-xs text-muted-foreground/60 mt-2 block">
                  {page.url}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Admin Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Panel (Requires Authentication)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.url}
                  to={page.url}
                  className="p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {page.description}
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-2 block">
                        {page.url}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEO Information */}
        <section className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">SEO & Site Structure</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Content Hierarchy</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• H1: One per page, main topic</li>
                <li>• H2: Major sections</li>
                <li>• H3: Subsections</li>
                <li>• Semantic HTML throughout</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Meta Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Unique title tags per page</li>
                <li>• Meta descriptions under 160 chars</li>
                <li>• Open Graph tags for social sharing</li>
                <li>• Canonical URLs configured</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;