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
import { Trash2, Edit, Plus, User, Mail, Briefcase } from "lucide-react";
import { SEO } from "@/components/SEO";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  email: string | null;
  order_position: number;
}

const ManageTeam = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchTeam();
    }
  }, [isAdmin, loading, navigate]);

  const fetchTeam = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("order_position");
    if (data) setTeam(data);
  };

  const handleSave = async () => {
    if (!currentMember.name || !currentMember.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in name and role fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentMember.id) {
        const { error } = await supabase
          .from("team_members")
          .update(currentMember)
          .eq("id", currentMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert([currentMember as any]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Team member saved successfully" });
      setCurrentMember({});
      setIsEditing(false);
      fetchTeam();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      if (!error) {
        toast({ title: "Success", description: "Team member deleted" });
        fetchTeam();
      }
    }
  };

  const handleImageChange = (url: string) => {
    setCurrentMember({ ...currentMember, image: url });
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Manage Team"
        description="Admin panel for managing team members"
      />
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <AdminHeader
          title="Manage Team"
          subtitle="Add, edit, or remove team members with profile photos"
        />

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentMember({ order_position: team.length });
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        {isEditing && (
          <Card className="p-6 mb-8 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">
              {currentMember.id ? "Edit Team Member" : "New Team Member"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Profile Photo
                </Label>
                <ImageUpload
                  bucket="team-images"
                  value={currentMember.image || undefined}
                  onChange={handleImageChange}
                  onRemove={() =>
                    setCurrentMember({ ...currentMember, image: null })
                  }
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Drag and drop an image or click to browse. Supports PNG, JPG,
                  GIF up to 10MB.
                </p>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name *
                  </Label>
                  <Input
                    value={currentMember.name || ""}
                    onChange={(e) =>
                      setCurrentMember({ ...currentMember, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role / Position *
                  </Label>
                  <Input
                    value={currentMember.role || ""}
                    onChange={(e) =>
                      setCurrentMember({ ...currentMember, role: e.target.value })
                    }
                    placeholder="e.g., Executive Director, Program Manager"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={currentMember.email || ""}
                    onChange={(e) =>
                      setCurrentMember({
                        ...currentMember,
                        email: e.target.value,
                      })
                    }
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label>Bio / Description</Label>
                  <Textarea
                    value={currentMember.bio || ""}
                    onChange={(e) =>
                      setCurrentMember({ ...currentMember, bio: e.target.value })
                    }
                    placeholder="Brief description about the team member..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={currentMember.order_position || 0}
                    onChange={(e) =>
                      setCurrentMember({
                        ...currentMember,
                        order_position: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers appear first
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-6 border-t">
              <Button onClick={handleSave}>
                {currentMember.id ? "Update Member" : "Add Member"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMember({});
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-muted relative">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-semibold text-sm">
                  {member.role}
                </p>
                {member.email && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.email}
                  </p>
                )}
                {member.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {member.bio}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMember(member);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {team.length === 0 && !isEditing && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No team members yet</p>
            <p className="text-sm">Click "Add Team Member" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;