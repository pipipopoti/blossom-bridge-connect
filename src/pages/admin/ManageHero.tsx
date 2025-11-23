import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface HeroImage {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  order_position: number;
  is_active: boolean;
}

const ManageHero = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<HeroImage>>({});

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchImages();
    }
  }, [isAdmin, loading, navigate]);

  const fetchImages = async () => {
    const { data } = await supabase.from("hero_images").select("*").order("order_position");
    if (data) setImages(data);
  };

  const handleSave = async () => {
    if (!currentImage.image_url) {
      toast({ title: "Error", description: "Image URL is required", variant: "destructive" });
      return;
    }
    
    try {
      if (currentImage.id) {
        const { error } = await supabase
          .from("hero_images")
          .update(currentImage)
          .eq("id", currentImage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_images").insert([currentImage as any]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Hero image saved successfully" });
      setCurrentImage({});
      setIsEditing(false);
      fetchImages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hero image?")) {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (!error) {
        toast({ title: "Success", description: "Hero image deleted" });
        fetchImages();
      }
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Hero Images</h1>
          <Button onClick={() => { setIsEditing(true); setCurrentImage({ is_active: true, order_position: 0 }); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Hero Image
          </Button>
        </div>

        {isEditing ? (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{currentImage.id ? "Edit Image" : "New Image"}</h2>
            <div className="space-y-4">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={currentImage.image_url || ""}
                  onChange={(e) => setCurrentImage({ ...currentImage, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={currentImage.title || ""}
                  onChange={(e) => setCurrentImage({ ...currentImage, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={currentImage.subtitle || ""}
                  onChange={(e) => setCurrentImage({ ...currentImage, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Order Position</Label>
                <Input
                  type="number"
                  value={currentImage.order_position || 0}
                  onChange={(e) => setCurrentImage({ ...currentImage, order_position: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={currentImage.is_active || false}
                  onCheckedChange={(checked) => setCurrentImage({ ...currentImage, is_active: checked as boolean })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setCurrentImage({}); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="grid md:grid-cols-2 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="p-6">
              <img src={image.image_url} alt="Hero" className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="text-xl font-bold">{image.title || "No title"}</h3>
              <p className="text-sm text-muted-foreground">{image.subtitle || "No subtitle"}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Order: {image.order_position} • {image.is_active ? "Active" : "Inactive"}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => { setCurrentImage(image); setIsEditing(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
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

export default ManageHero;
