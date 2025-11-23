import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, Heart, Handshake, TrendingUp } from "lucide-react";

const Community = () => {
  const stats = [
    { icon: Users, value: "5,000+", label: "Lives Impacted" },
    { icon: Heart, value: "1,200+", label: "Families Supported" },
    { icon: Handshake, value: "350+", label: "Volunteers" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Together, we're building a stronger, more supportive community for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our community is made up of individuals who believe in the power of coming together
              to support those in need. Whether you're looking for help or want to give back,
              there's a place for you here.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What We Offer</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Supportive environment for personal growth</li>
                  <li>• Access to resources and services</li>
                  <li>• Networking opportunities</li>
                  <li>• Volunteer and leadership programs</li>
                  <li>• Community events and workshops</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">How to Get Involved</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Volunteer your time and skills</li>
                  <li>• Donate to support our programs</li>
                  <li>• Attend community events</li>
                  <li>• Spread the word about our mission</li>
                  <li>• Partner with us for community initiatives</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Community;
