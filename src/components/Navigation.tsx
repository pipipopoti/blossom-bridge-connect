import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Programs", href: "/#programs" },
    { name: "Stories", href: "/stories" },
    { name: "Team", href: "/team" },
    { name: "Community", href: "/community" },
    { name: "Get Help", href: "/#help" },
  ];

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("/#")) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(href.substring(1));
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Extended hands initiative</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </button>
            ))}
            <Button className="gradient-warm" onClick={() => navigate("/donate")}>
              Donate Now
            </Button>
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left"
                >
                  {item.name}
                </button>
              ))}
              <Button className="gradient-warm w-full" onClick={() => navigate("/donate")}>
                Donate Now
              </Button>
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" className="w-full" onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full" onClick={signOut}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="ghost" className="w-full" onClick={() => navigate("/auth")}>
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
