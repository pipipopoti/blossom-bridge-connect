import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SEO } from "@/components/SEO";

interface Program {
  id: string;
  program_type: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  image_shape: string;
  services: string[];
}

const ManagePrograms = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<any>({});
  const [previewProgram, setPreviewProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
    else if (isAdmin) fetchPrograms();
  }, [isAdmin, loading, navigate]);

  const fetchPrograms = async () => {
    const { data } = await supabase.from("program_details").select("*");
    if (data) {
      const formattedData = data.map((p) => ({
        ...p,
        services: Array.isArray(p.services) ? p.services as string[] : [],
      }));
      setPrograms(formattedData);
    }
  };

  const handleSave = async () => {
    if (!currentProgram.title || !currentProgram.program_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and program type",
        variant: "destructive",
      });
      return;
    }

    try {
      const services = currentProgram.servicesText
        ?.split("\n")
        .filter((s: string) => s.trim()) || [];

      const programData = {
        ...currentProgram,
        services,
      };
      delete programData.servicesText;

      if (currentProgram.id) {
        const { error } = await supabase
          .from("program_details")
          .update(programData)
          .eq("id", currentProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("program_details")
          .insert([programData]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Program saved successfully" });
      setIsEditing(false);
      setCurrentProgram({});
      fetchPrograms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      const { error } = await supabase
        .from("program_details")
        .delete()
        .eq("id", id);
      if (!error) {
        toast({ title: "Success", description: "Program deleted" });
        fetchPrograms();
      }
    }
  };

  const getImageShapeClass = (shape: string) => {
    switch (shape) {
      case "circle":
        return "rounded-full aspect-square object-cover";
      case "square":
        return "rounded-lg aspect-square object-cover";
      case "portrait":
        return "rounded-lg aspect-[3/4] object-cover";
      default:
        return "rounded-lg aspect-video object-cover";
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Manage Programs"
        description="Admin panel for managing program details"
      />
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <AdminHeader
          title="Manage Programs"
          subtitle="Add, edit, and organize your programs and services"
        />

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentProgram({ image_shape: "rectangle" });
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Program
          </Button>
        </div>

        {isEditing && (
          <Card className="p-6 mb-8 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">
              {currentProgram.id ? "Edit Program" : "New Program"}
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label>Program Type (slug) *</Label>
                  <Input
                    value={currentProgram.program_type || ""}
                    onChange={(e) =>
                      setCurrentProgram({
                        ...currentProgram,
                        program_type: e.target.value,
                      })
                    }
                    placeholder="e.g., women, children, youth"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used in URL: /programs/{currentProgram.program_type || "slug"}
                  </p>
                </div>

                <div>
                  <Label>Title *</Label>
                  <Input
                    value={currentProgram.title || ""}
                    onChange={(e) =>
                      setCurrentProgram({
                        ...currentProgram,
                        title: e.target.value,
                      })
                    }
                    placeholder="Program title"
                  />
                </div>

                <div>
                  <Label>Short Description</Label>
                  <Textarea
                    value={currentProgram.description || ""}
                    onChange={(e) =>
                      setCurrentProgram({
                        ...currentProgram,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description for cards and previews"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Long Description</Label>
                  <Textarea
                    value={currentProgram.long_description || ""}
                    onChange={(e) =>
                      setCurrentProgram({
                        ...currentProgram,
                        long_description: e.target.value,
                      })
                    }
                    placeholder="Detailed description for the program page"
                    rows={6}
                  />
                </div>

                <div>
                  <Label>Services (one per line)</Label>
                  <Textarea
                    value={currentProgram.servicesText || ""}
                    onChange={(e) =>
                      setCurrentProgram({
                        ...currentProgram,
                        servicesText: e.target.value,
                      })
                    }
                    placeholder="Counseling&#10;Job Training&#10;Support Groups"
                    rows={5}
                  />
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-4">
                <div>
                  <Label>Program Image</Label>
                  <ImageUpload
                    bucket="program-images"
                    value={currentProgram.image_url}
                    onChange={(url) =>
                      setCurrentProgram({ ...currentProgram, image_url: url })
                    }
                    onRemove={() =>
                      setCurrentProgram({ ...currentProgram, image_url: "" })
                    }
                  />
                </div>

                <div>
                  <Label>Image Shape</Label>
                  <Select
                    value={currentProgram.image_shape || "rectangle"}
                    onValueChange={(value) =>
                      setCurrentProgram({
                        ...currentProgram,
                        image_shape: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rectangle">
                        Rectangle (Landscape)
                      </SelectItem>
                      <SelectItem value="circle">Circle/Rounded</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Preview */}
                {currentProgram.image_url && (
                  <div>
                    <Label>Shape Preview</Label>
                    <div className="mt-2 max-w-xs">
                      <img
                        src={currentProgram.image_url}
                        alt="Preview"
                        className={getImageShapeClass(
                          currentProgram.image_shape || "rectangle"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-6 border-t">
              <Button onClick={handleSave}>
                {currentProgram.id ? "Update Program" : "Add Program"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentProgram({});
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Programs Table/Grid */}
        <div className="space-y-4">
          {programs.map((program) => (
            <Card key={program.id} className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Thumbnail */}
                {program.image_url && (
                  <div className="w-full md:w-32 shrink-0">
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className={`w-full ${getImageShapeClass(
                        program.image_shape
                      )}`}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {program.program_type} | Shape:{" "}
                        {program.image_shape}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">
                        {program.description}
                      </p>
                      {program.services && program.services.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {program.services.length} services listed
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {/* Preview Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewProgram(program)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Program Preview</DialogTitle>
                          </DialogHeader>
                          {previewProgram && (
                            <div className="space-y-4">
                              {previewProgram.image_url && (
                                <img
                                  src={previewProgram.image_url}
                                  alt={previewProgram.title}
                                  className={`w-full ${getImageShapeClass(
                                    previewProgram.image_shape
                                  )}`}
                                />
                              )}
                              <h2 className="text-2xl font-bold">
                                {previewProgram.title}
                              </h2>
                              <p>{previewProgram.description}</p>
                              {previewProgram.long_description && (
                                <p className="text-muted-foreground">
                                  {previewProgram.long_description}
                                </p>
                              )}
                              {previewProgram.services?.length > 0 && (
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Services
                                  </h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {previewProgram.services.map(
                                      (service, i) => (
                                        <li key={i}>{service}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* View Live */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/programs/${program.program_type}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentProgram({
                            ...program,
                            servicesText: Array.isArray(program.services)
                              ? program.services.join("\n")
                              : "",
                          });
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {programs.length === 0 && !isEditing && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No programs yet</p>
            <p className="text-sm">Click "Add Program" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePrograms;