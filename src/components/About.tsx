import { Heart, Users, Target } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Our Mission",
      description:
        "To empower and support vulnerable communities through accessible resources, compassionate care, and sustainable programs that transform lives.",
    },
    {
      icon: Users,
      title: "Who We Serve",
      description:
        "Women, single mothers, children, teenagers, and all vulnerable individuals seeking support, guidance, and opportunities for growth.",
    },
    {
      icon: Target,
      title: "Our Vision",
      description:
        "A world where every person has access to the resources, support, and opportunities they need to thrive and reach their full potential.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Building Stronger Communities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Together, we create lasting change through compassion, support, and empowerment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl shadow-sm hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Lives Impacted" },
              { number: "50+", label: "Programs Running" },
              { number: "200+", label: "Volunteers" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
