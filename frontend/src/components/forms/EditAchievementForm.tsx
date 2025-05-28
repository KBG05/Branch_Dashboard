
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUpdateAchievement } from "@/hooks/useAchievements";
import { AchievementRead } from "@/config/api";

interface EditAchievementFormProps {
  achievement: AchievementRead;
  onSuccess?: () => void;
}

export const EditAchievementForm = ({ achievement, onSuccess }: EditAchievementFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    usn: achievement.usn,
    title: achievement.title,
    description: achievement.description || "",
    achievement_type: achievement.achievement_type || "",
    achievement_date: achievement.achievement_date ? achievement.achievement_date.split('T')[0] : "",
    certificated_url: achievement.certificated_url || ""
  });

  const updateAchievement = useUpdateAchievement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      usn: formData.usn,
      title: formData.title || null,
      description: formData.description || null,
      achievement_type: formData.achievement_type || null,
      achievement_date: formData.achievement_date || null,
      certificated_url: formData.certificated_url || null
    };

    updateAchievement.mutate(updateData, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          placeholder="Enter achievement title" 
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="enhanced-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Enter achievement details" 
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="min-h-[100px] enhanced-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="achievement_type">Type</Label>
          <Select 
            value={formData.achievement_type}
            onValueChange={(value) => handleChange('achievement_type', value)}
          >
            <SelectTrigger id="achievement_type" className="enhanced-input">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="enhanced-dropdown">
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="extracurricular">Extracurricular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="achievement_date">Achievement Date</Label>
          <Input 
            id="achievement_date" 
            type="date" 
            value={formData.achievement_date}
            onChange={(e) => handleChange('achievement_date', e.target.value)}
            className="enhanced-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usn">Student USN</Label>
        <Input 
          id="usn" 
          value={formData.usn}
          onChange={(e) => handleChange('usn', e.target.value)}
          className="enhanced-input"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificated_url">Certificate URL</Label>
        <Input 
          id="certificated_url" 
          type="url"
          placeholder="https://example.com/certificate.pdf" 
          value={formData.certificated_url}
          onChange={(e) => handleChange('certificated_url', e.target.value)}
          className="enhanced-input"
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" className="enhanced-button">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={updateAchievement.isPending}
          className="enhanced-button"
        >
          {updateAchievement.isPending ? "Updating..." : "Update Achievement"}
        </Button>
      </div>
    </form>
  );
};

export default EditAchievementForm;
