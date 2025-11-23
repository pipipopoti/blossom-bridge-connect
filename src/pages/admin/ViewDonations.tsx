import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const ViewDonations = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchDonations();
    }
  }, [isAdmin, loading, navigate]);

  const fetchDonations = async () => {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    if (data) setDonations(data);
  };

  if (loading || !isAdmin) return null;

  const total = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8">Donations</h1>
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold">Total Raised: ${total.toLocaleString()}</h2>
          <p className="text-muted-foreground">From {donations.length} donations</p>
        </Card>
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id} className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{donation.donor_name}</h3>
                  <p className="text-sm text-muted-foreground">{donation.program_type || "General"}</p>
                  {donation.message && <p className="text-sm mt-2">{donation.message}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${donation.amount}</p>
                  <p className="text-xs text-muted-foreground">{new Date(donation.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewDonations;
