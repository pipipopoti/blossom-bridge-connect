import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { SEO } from "@/components/SEO";

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
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDonations(data);
  };

  if (loading || !isAdmin) return null;

  const total = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="View Donations"
        description="Admin panel for viewing donation statistics"
      />
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <AdminHeader
          title="Donations"
          subtitle="View all donations and statistics"
        />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-3xl font-bold text-primary">
                  ${total.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl font-bold">#</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold">{donations.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl font-bold">Ø</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Donation</p>
                <p className="text-3xl font-bold">
                  ${donations.length > 0 ? (total / donations.length).toFixed(0) : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">
                    {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {donation.program_type || "General Donation"}
                  </p>
                  {donation.message && (
                    <p className="text-sm mt-2 italic">"{donation.message}"</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${parseFloat(donation.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(donation.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {donations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No donations yet</p>
            <p className="text-sm">
              Donations will appear here once supporters contribute
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDonations;