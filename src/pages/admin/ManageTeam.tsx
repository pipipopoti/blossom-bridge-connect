import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

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
    const { data } = await supabase.from("team_members").select("*").order("order_position");
    if (data) setTeam(data);
  };

  const handleSave = async () => {
    if (!currentMember.name || !currentMember.role) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
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
        const { error } = await supabase.from("team_members").insert([currentMember as any]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Team member saved successfully" });
      setCurrentMember({});
      setIsEditing(false);
      fetchTeam();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (!error) {
        toast({ title: "Success", description: "Team member deleted" });
        fetchTeam();
      }
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Team</h1>
          <Button onClick={() => { setIsEditing(true); setCurrentMember({}); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        {isEditing ? (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{currentMember.id ? "Edit Member" : "New Member"}</h2>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={currentMember.name || ""}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={currentMember.role || ""}
                  onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={currentMember.email || ""}
                  onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={currentMember.image || ""}
                  onChange={(e) => setCurrentMember({ ...currentMember, image: e.target.value })}
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={currentMember.bio || ""}
                  onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Order Position</Label>
                <Input
                  type="number"
                  value={currentMember.order_position || 0}
                  onChange={(e) => setCurrentMember({ ...currentMember, order_position: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setCurrentMember({}); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <Card key={member.id} className="p-6">
              {member.image && (
                <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-primary font-semibold">{member.role}</p>
              {member.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => { setCurrentMember(member); setIsEditing(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
