import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, BookOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StorySection, StorySectionData } from "@/components/admin/StorySection";
import { SEO } from "@/components/SEO";

interface Story {
  id?: string;
  title: string;
  content: string;
  person_name: string;
  person_image?: string | null;
  program_type: string;
  featured: boolean;
  sections?: StorySectionData[];
}

const ManageStories = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStory, setCurrentStory] = useState<Partial<Story>>({
    title: "",
    content: "",
    person_name: "",
    person_image: "",
    program_type: "",
    featured: false,
    sections: [],
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchStories();
    }
  }, [isAdmin, loading, navigate]);

  const fetchStories = async () => {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      const stories = data.map((story) => ({
        ...story,
        sections: (Array.isArray(story.sections)
          ? story.sections
          : []) as unknown as StorySectionData[],
      }));
      setStories(stories as any);
    }
  };

  const addSection = () => {
    const newSection: StorySectionData = {
      id: Math.random().toString(),
      type: "text",
      content: "",
    };
    setCurrentStory({
      ...currentStory,
      sections: [...(currentStory.sections || []), newSection],
    });
  };

  const updateSection = (index: number, section: StorySectionData) => {
    const sections = [...(currentStory.sections || [])];
    sections[index] = section;
    setCurrentStory({ ...currentStory, sections });
  };

  const removeSection = (index: number) => {
    const sections = [...(currentStory.sections || [])];
    sections.splice(index, 1);
    setCurrentStory({ ...currentStory, sections });
  };

  const handleSave = async () => {
    if (
      !currentStory.title ||
      !currentStory.person_name ||
      !currentStory.program_type ||
      !currentStory.content
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const storyData: any = {
        title: currentStory.title,
        content: currentStory.content,
        person_name: currentStory.person_name,
        person_image: currentStory.person_image,
        program_type: currentStory.program_type,
        featured: currentStory.featured,
        sections: currentStory.sections || [],
      };

      if (currentStory.id) {
        const { error } = await supabase
          .from("stories")
          .update(storyData)
          .eq("id", currentStory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("stories").insert([storyData]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Story saved successfully" });
      setCurrentStory({
        title: "",
        content: "",
        person_name: "",
        person_image: "",
        program_type: "",
        featured: false,
        sections: [],
      });
      setIsEditing(false);
      fetchStories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      <SEO
        title="Manage Stories"
        description="Admin panel for managing success stories"
      />
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <AdminHeader
          title="Manage Stories"
          subtitle="Add, edit, or delete success stories and testimonials"
        />

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentStory({
                title: "",
                content: "",
                person_name: "",
                person_image: "",
                program_type: "",
                featured: false,
                sections: [],
              });
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Story
          </Button>
        </div>

        {isEditing && (
          <Card className="p-6 mb-8 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">
              {currentStory.id ? "Edit Story" : "New Story"}
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={currentStory.title || ""}
                    onChange={(e) =>
                      setCurrentStory({
                        ...currentStory,
                        title: e.target.value,
                      })
                    }
                    placeholder="Story title"
                  />
                </div>
                <div>
                  <Label>Person Name *</Label>
                  <Input
                    value={currentStory.person_name || ""}
                    onChange={(e) =>
                      setCurrentStory({
                        ...currentStory,
                        person_name: e.target.value,
                      })
                    }
                    placeholder="Name of the person featured"
                  />
                </div>
                <div>
                  <Label>Program Type *</Label>
                  <Input
                    value={currentStory.program_type || ""}
                    onChange={(e) =>
                      setCurrentStory({
                        ...currentStory,
                        program_type: e.target.value,
                      })
                    }
                    placeholder="e.g., Women's Empowerment"
                  />
                </div>
                <div>
                  <Label>Story Content *</Label>
                  <Textarea
                    value={currentStory.content || ""}
                    onChange={(e) =>
                      setCurrentStory({
                        ...currentStory,
                        content: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="Main story content..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentStory.featured || false}
                    onCheckedChange={(checked) =>
                      setCurrentStory({
                        ...currentStory,
                        featured: checked as boolean,
                      })
                    }
                  />
                  <Label>Featured Story (appears prominently)</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Person Image</Label>
                  <ImageUpload
                    bucket="story-images"
                    value={currentStory.person_image || ""}
                    onChange={(url) =>
                      setCurrentStory({ ...currentStory, person_image: url })
                    }
                    onRemove={() =>
                      setCurrentStory({ ...currentStory, person_image: "" })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Story Sections */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">Story Sections</Label>
                <Button
                  onClick={addSection}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
              {currentStory.sections?.map((section, index) => (
                <StorySection
                  key={section.id}
                  section={section}
                  onChange={(updated) => updateSection(index, updated)}
                  onRemove={() => removeSection(index)}
                />
              ))}
              {(!currentStory.sections || currentStory.sections.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No additional sections. Click "Add Section" to add more
                  content blocks.
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-6 pt-6 border-t">
              <Button onClick={handleSave}>
                {currentStory.id ? "Update Story" : "Add Story"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentStory({
                    title: "",
                    content: "",
                    person_name: "",
                    person_image: "",
                    program_type: "",
                    featured: false,
                    sections: [],
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {stories.map((story) => (
            <Card key={story.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {story.person_image && (
                  <img
                    src={story.person_image}
                    alt={story.person_name}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{story.title}</h3>
                        {story.featured && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {story.person_name} • {story.program_type}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm">
                        {story.content}
                      </p>
                      {story.sections && story.sections.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {story.sections.length} additional section(s)
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentStory(story);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(story.id!)}
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

        {stories.length === 0 && !isEditing && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No stories yet</p>
            <p className="text-sm">Click "Add New Story" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStories;