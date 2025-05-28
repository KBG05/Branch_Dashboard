
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
import { useAddAchievement } from "@/hooks/useAchievements";
import { useStudents } from "@/hooks/useStudents";

interface AddAchievementFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddAchievementForm = ({ onSuccess, onCancel }: AddAchievementFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    usn: "",
    title: "",
    description: "",
    achievement_type: "",
    achievement_date: "",
    certificated_url: ""
  });

  const addAchievement = useAddAchievement();
  const { data: studentsData } = useStudents();
  const students = studentsData?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const achievementData = {
      ...formData,
      achievement_date: formData.achievement_date || null,
      description: formData.description || null,
      achievement_type: formData.achievement_type || null,
      certificated_url: formData.certificated_url || null
    };

    addAchievement.mutate(achievementData, {
      onSuccess: () => {
        onSuccess?.();
        setFormData({
          usn: "",
          title: "",
          description: "",
          achievement_type: "",
          achievement_date: "",
          certificated_url: ""
        });
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          placeholder="Enter achievement title" 
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="enhanced-input"
          required 
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
          <Select onValueChange={(value) => handleChange('achievement_type', value)}>
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
        <Label htmlFor="usn">Student USN *</Label>
        <Select onValueChange={(value) => handleChange('usn', value)} required>
          <SelectTrigger id="usn" className="enhanced-input">
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent className="enhanced-dropdown">
            {students.map(student => (
              <SelectItem key={student.usn} value={student.usn}>
                {student.name} ({student.usn})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Button type="button" variant="outline" onClick={onCancel} className="enhanced-button">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={addAchievement.isPending}
          className="enhanced-button"
        >
          {addAchievement.isPending ? "Adding..." : "Add Achievement"}
        </Button>
      </div>
    </form>
  );
};

export default AddAchievementForm;
