import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProgramDetail {
  id: string;
  program_type: string;
  title: string;
  description: string;
  long_description: string | null;
  services: string[];
  image_url: string | null;
}

const ProgramDetail = () => {
  const { type } = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
  }, [type]);

  const fetchProgram = async () => {
    const { data, error } = await supabase
      .from("program_details")
      .select("*")
      .eq("program_type", type)
      .maybeSingle();

    if (!error && data) {
      const services = Array.isArray(data.services) 
        ? (data.services as string[]) 
        : [];
      
      setProgram({
        ...data,
        services
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading program details...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
          <p className="text-muted-foreground">This program is not available yet.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {program.image_url && (
            <div className="mb-12 rounded-lg overflow-hidden max-h-96">
              <img
                src={program.image_url}
                alt={program.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {program.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">{program.description}</p>

          {program.long_description && (
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Program</h2>
              <p className="text-foreground whitespace-pre-line">{program.long_description}</p>
            </Card>
          )}

          {program.services && program.services.length > 0 && (
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Services We Provide</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {program.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => document.getElementById("help")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request Help
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "/donate"}
            >
              Support This Program
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProgramDetail;
