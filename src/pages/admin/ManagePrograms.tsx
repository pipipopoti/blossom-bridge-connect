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
import { Edit } from "lucide-react";

const ManagePrograms = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<any>({});

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
    else if (isAdmin) fetchPrograms();
  }, [isAdmin, loading, navigate]);

  const fetchPrograms = async () => {
    const { data } = await supabase.from("program_details").select("*");
    if (data) setPrograms(data);
  };

  const handleSave = async () => {
    try {
      const services = currentProgram.servicesText?.split("\n").filter((s: string) => s.trim());
      const { error } = await supabase
        .from("program_details")
        .upsert({ ...currentProgram, services: services || [] });
      if (error) throw error;
      toast({ title: "Success", description: "Program updated" });
      setIsEditing(false);
      fetchPrograms();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8">Manage Programs</h1>
        {isEditing ? (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Edit Program</h2>
            <div className="space-y-4">
              <div><Label>Program Type</Label><Input value={currentProgram.program_type || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, program_type: e.target.value })} /></div>
              <div><Label>Title</Label><Input value={currentProgram.title || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={currentProgram.description || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, description: e.target.value })} /></div>
              <div><Label>Long Description</Label><Textarea value={currentProgram.long_description || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, long_description: e.target.value })} rows={6} /></div>
              <div><Label>Services (one per line)</Label><Textarea value={currentProgram.servicesText || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, servicesText: e.target.value })} rows={4} /></div>
              <div><Label>Image URL</Label><Input value={currentProgram.image_url || ""} onChange={(e) => setCurrentProgram({ ...currentProgram, image_url: e.target.value })} /></div>
              <div className="flex gap-2"><Button onClick={handleSave}>Save</Button><Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button></div>
            </div>
          </Card>
        ) : null}
        <div className="grid gap-4">
          {programs.map((program) => (
            <Card key={program.id} className="p-6">
              <div className="flex justify-between"><div><h3 className="text-xl font-bold">{program.title}</h3><p className="text-sm text-muted-foreground">{program.program_type}</p></div>
              <Button onClick={() => { setCurrentProgram({ ...program, servicesText: Array.isArray(program.services) ? program.services.join("\n") : "" }); setIsEditing(true); }}><Edit className="h-4 w-4" /></Button></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePrograms;
