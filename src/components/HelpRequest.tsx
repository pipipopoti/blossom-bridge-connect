import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const HelpRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    helpType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your request has been received! We'll contact you within 24 hours.");
    setFormData({ name: "", email: "", phone: "", helpType: "", message: "" });
  };

  const contactInfo = [
    { icon: Phone, text: "Emergency: 1-800-HELP-NOW", href: "tel:1-800-435-7669" },
    { icon: Mail, text: "support@empower.org", href: "mailto:support@empower.org" },
    { icon: MapPin, text: "123 Community Street, City", href: "#" },
  ];

  return (
    <section id="help" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get Help Today</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You're not alone. Reach out and let us support you on your journey
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="p-8 hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="helpType">How Can We Help?</Label>
                <Select value={formData.helpType} onValueChange={(value) => setFormData({ ...formData, helpType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of support needed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Assistance</SelectItem>
                    <SelectItem value="counseling">Counseling Services</SelectItem>
                    <SelectItem value="education">Educational Support</SelectItem>
                    <SelectItem value="financial">Financial Assistance</SelectItem>
                    <SelectItem value="housing">Housing Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Tell Us More</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your story and how we can help..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full gradient-warm text-lg group">
                Send Request
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-8 bg-primary text-primary-foreground hover-lift">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="mb-6 text-primary-foreground/90">
                Our team is here 24/7 to provide support. Don't hesitate to reach out through any of these channels:
              </p>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{info.text}</span>
                    </a>
                  );
                })}
              </div>
            </Card>

            <Card className="p-8 hover-lift">
              <h3 className="text-2xl font-bold text-foreground mb-4">What Happens Next?</h3>
              <ol className="space-y-4">
                {[
                  "We'll review your request within 24 hours",
                  "A support specialist will contact you",
                  "Together, we'll create a personalized support plan",
                  "You'll get connected with resources and programs",
                ].map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All information is kept strictly confidential. We respect your privacy and are committed to your safety.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpRequest;
