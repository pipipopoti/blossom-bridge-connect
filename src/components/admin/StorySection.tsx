import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Trash2 } from "lucide-react";

export interface StorySectionData {
  id: string;
  type: "text" | "image" | "title" | "quote";
  content: string;
}

interface StorySectionProps {
  section: StorySectionData;
  onChange: (section: StorySectionData) => void;
  onRemove: () => void;
}

export const StorySection = ({ section, onChange, onRemove }: StorySectionProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Label>Section Type</Label>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Select 
        value={section.type} 
        onValueChange={(type: any) => onChange({ ...section, type, content: "" })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Section Title</SelectItem>
          <SelectItem value="text">Text Content</SelectItem>
          <SelectItem value="quote">Quote/Highlight</SelectItem>
          <SelectItem value="image">Image</SelectItem>
        </SelectContent>
      </Select>

      {section.type === "title" && (
        <div>
          <Label>Title</Label>
          <Input
            value={section.content}
            onChange={(e) => onChange({ ...section, content: e.target.value })}
            placeholder="Enter section title"
          />
        </div>
      )}

      {section.type === "text" && (
        <div>
          <Label>Text Content</Label>
          <Textarea
            value={section.content}
            onChange={(e) => onChange({ ...section, content: e.target.value })}
            placeholder="Enter text content"
            rows={4}
          />
        </div>
      )}

      {section.type === "quote" && (
        <div>
          <Label>Quote</Label>
          <Textarea
            value={section.content}
            onChange={(e) => onChange({ ...section, content: e.target.value })}
            placeholder="Enter quote or highlight text"
            rows={3}
          />
        </div>
      )}

      {section.type === "image" && (
        <div>
          <Label>Image</Label>
          <ImageUpload
            bucket="story-images"
            value={section.content}
            onChange={(url) => onChange({ ...section, content: url })}
            onRemove={() => onChange({ ...section, content: "" })}
          />
        </div>
      )}
    </div>
  );
};