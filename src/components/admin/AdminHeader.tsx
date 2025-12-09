import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader = ({ title, subtitle }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="gap-2 hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Admin Panel
        </Button>
        <span>/</span>
        <span className="text-foreground font-medium">{title}</span>
      </div>

      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};