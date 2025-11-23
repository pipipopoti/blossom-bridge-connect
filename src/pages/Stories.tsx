import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  title: string;
  content: string;
  person_name: string;
  person_image: string | null;
  program_type: string;
  featured: boolean;
  created_at: string;
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStories(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people whose lives we've helped transform
            </p>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stories available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden hover-lift">
                  {story.person_image && (
                    <img
                      src={story.person_image}
                      alt={story.person_name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    {story.featured && (
                      <Badge className="mb-2">Featured Story</Badge>
                    )}
                    <Badge variant="outline" className="mb-4">
                      {story.program_type}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      - {story.person_name}
                    </p>
                    <p className="text-foreground line-clamp-4">{story.content}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Stories;
