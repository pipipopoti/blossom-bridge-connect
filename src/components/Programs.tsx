import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Baby, Heart, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import womenImage from "@/assets/women-empowerment.jpg";
import childrenImage from "@/assets/children-support.jpg";

const Programs = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      icon: Users,
      title: "Women's Empowerment",
      description: "Skills training, mentorship, and resources for women to achieve economic independence and personal growth.",
      image: womenImage,
      benefits: ["Leadership Training", "Financial Literacy", "Career Support", "Mental Health Services"],
    },
    {
      icon: Baby,
      title: "Children's Programs",
      description: "Safe spaces, educational support, and developmental programs for children to learn, grow, and thrive.",
      image: childrenImage,
      benefits: ["After-School Programs", "Tutoring", "Recreation Activities", "Nutrition Support"],
    },
    {
      icon: GraduationCap,
      title: "Youth Development",
      description: "Mentorship, life skills, and educational opportunities for teenagers navigating critical life stages.",
      image: womenImage,
      benefits: ["Mentorship Programs", "Scholarship Assistance", "Career Guidance", "Life Skills Workshops"],
    },
    {
      icon: Heart,
      title: "Family Support",
      description: "Comprehensive support for families facing challenges, providing resources and guidance.",
      image: childrenImage,
      benefits: ["Counseling Services", "Emergency Assistance", "Housing Support", "Legal Guidance"],
    },
  ];

  return (
    <section id="programs" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Programs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive support designed for every member of our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{program.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {program.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full group"
                    onClick={() => navigate(`/programs/${program.title.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')}`)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Programs;
