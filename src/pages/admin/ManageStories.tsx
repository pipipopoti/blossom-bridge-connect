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
import { Checkbox } from "@/components/ui/checkbox";

interface Story {
  id: string;
  title: string;
  content: string;
  person_name: string;
  person_image: string | null;
  program_type: string;
  featured: boolean;
}

const ManageStories = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStory, setCurrentStory] = useState<Partial<Story>>({});

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchStories();
    }
  }, [isAdmin, loading, navigate]);

  const fetchStories = async () => {
    const { data } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
    if (data) setStories(data);
  };

  const handleSave = async () => {
    if (!currentStory.title || !currentStory.person_name || !currentStory.program_type || !currentStory.content) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    try {
      if (currentStory.id) {
        const { error } = await supabase
          .from("stories")
          .update(currentStory)
          .eq("id", currentStory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("stories").insert([currentStory as any]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Story saved successfully" });
      setCurrentStory({});
      setIsEditing(false);
      fetchStories();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      const { error } = await supabase.from("stories").delete().eq("id", id);
      if (!error) {
        toast({ title: "Success", description: "Story deleted" });
        fetchStories();
      }
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Stories</h1>
          <Button onClick={() => { setIsEditing(true); setCurrentStory({}); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Story
          </Button>
        </div>

        {isEditing ? (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{currentStory.id ? "Edit Story" : "New Story"}</h2>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={currentStory.title || ""}
                  onChange={(e) => setCurrentStory({ ...currentStory, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Person Name</Label>
                <Input
                  value={currentStory.person_name || ""}
                  onChange={(e) => setCurrentStory({ ...currentStory, person_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Person Image URL</Label>
                <Input
                  value={currentStory.person_image || ""}
                  onChange={(e) => setCurrentStory({ ...currentStory, person_image: e.target.value })}
                />
              </div>
              <div>
                <Label>Program Type</Label>
                <Input
                  value={currentStory.program_type || ""}
                  onChange={(e) => setCurrentStory({ ...currentStory, program_type: e.target.value })}
                  placeholder="e.g., Women's Empowerment"
                />
              </div>
              <div>
                <Label>Story Content</Label>
                <Textarea
                  value={currentStory.content || ""}
                  onChange={(e) => setCurrentStory({ ...currentStory, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={currentStory.featured || false}
                  onCheckedChange={(checked) => setCurrentStory({ ...currentStory, featured: checked as boolean })}
                />
                <Label>Featured Story</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setCurrentStory({}); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">By {story.person_name} • {story.program_type}</p>
                  <p className="mt-2 line-clamp-2">{story.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setCurrentStory(story); setIsEditing(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(story.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageStories;
