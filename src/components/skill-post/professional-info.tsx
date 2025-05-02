import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormDataType } from "@/types/form-types";

interface ProfessionalInfoProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const StepOneProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  formData,
  handleChange,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="professionalTitle">Professional Title</Label>
        <Input 
          id="professionalTitle"
          name="professionalTitle"
          value={formData.professionalTitle}
          onChange={handleChange}
          placeholder="e.g., Graphic Designer, Web Developer"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="shortBio">Short Bio or About Me</Label>
        <Textarea 
          id="shortBio"
          name="shortBio"
          value={formData.shortBio}
          onChange={handleChange}
          placeholder="Brief introduction about yourself"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="skills">Skills / Expertise Tags</Label>
        <Input 
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., HTML, SEO, Adobe Premiere Pro (comma separated)"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="languages">Languages Spoken</Label>
        <Input 
          id="languages"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          placeholder="e.g., English, Spanish, French"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <Select 
          onValueChange={(value) => setFormData({...formData, experienceLevel: value})} 
          value={formData.experienceLevel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent className="text-darker bg-white">
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StepOneProfessionalInfo;
