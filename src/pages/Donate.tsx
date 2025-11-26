import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Users, DollarSign } from "lucide-react";

const Donate = () => {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [programType, setProgramType] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalAmount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const fetchDonationStats = async () => {
    const { data, error } = await supabase
      .from("donations")
      .select("amount");

    if (!error && data) {
      const total = data.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0);
      setStats({
        totalDonations: data.length,
        totalDonors: data.length,
        totalAmount: total,
      });
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName || !amount || !programType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          amount: parseFloat(amount),
          donorName: isAnonymous ? "Anonymous" : donorName,
          programType,
          message,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Make a Difference Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your donation helps us continue our mission to empower and support those in need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats.totalDonations}</h3>
              <p className="text-muted-foreground">Total Donations</p>
            </Card>
            <Card className="p-6 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats.totalDonors}</h3>
              <p className="text-muted-foreground">Generous Donors</p>
            </Card>
            <Card className="p-6 text-center hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">${stats.totalAmount.toLocaleString()}</h3>
              <p className="text-muted-foreground">Amount Raised</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Your Impact</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">$50</h3>
                  <p className="text-muted-foreground">Provides educational supplies for a child</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">$100</h3>
                  <p className="text-muted-foreground">Supports a week of after-school programs</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">$250</h3>
                  <p className="text-muted-foreground">Funds skills training for a woman</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">$500+</h3>
                  <p className="text-muted-foreground">Provides comprehensive family support</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Make Your Donation</h2>
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <Label htmlFor="donorName">Name</Label>
                  <Input
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required={!isAnonymous}
                    disabled={isAnonymous}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="programType">Support a Program (Optional)</Label>
                  <Select value={programType} onValueChange={setProgramType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Women's Empowerment">Women's Empowerment</SelectItem>
                      <SelectItem value="Children's Programs">Children's Programs</SelectItem>
                      <SelectItem value="Youth Development">Youth Development</SelectItem>
                      <SelectItem value="Family Support">Family Support</SelectItem>
                      <SelectItem value="General">General Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a message of support..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  />
                  <Label htmlFor="anonymous" className="cursor-pointer">
                    Make this donation anonymous
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Donate Now"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Donate;
