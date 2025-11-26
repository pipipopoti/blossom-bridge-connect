import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BackupExport = () => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportTableToCSV = (data: any[], tableName: string) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null) return "";
          if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const tables = [
        "profiles",
        "donations",
        "hero_images",
        "program_details",
        "stories",
        "team_members",
        "user_roles"
      ] as const;

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("*");
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const csv = exportTableToCSV(data, table);
          const timestamp = new Date().toISOString().split("T")[0];
          downloadCSV(csv, `${table}_${timestamp}.csv`);
        }
      }

      toast({
        title: "Success",
        description: "All data exported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={exporting} size="lg">
      {exporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Backup All Data
        </>
      )}
    </Button>
  );
};