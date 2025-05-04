import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "@/types/form-types";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Driver",
  "Cleaner",
  "Caregiver",
  "Cook",
  "Gardener",
  "Security Guard"
];

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "Expert"
];

const AVAILABILITY_OPTIONS = [
  "Full Time",
  "Part Time",
  "Weekends Only",
  "Evenings Only",
  "Flexible"
];

interface ProfessionalInfoProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleArrayChange: (name: string, values: string[]) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const StepTwoProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  formData,
  handleChange,
  handleArrayChange,
  setFormData
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  // Handle skill additions
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.topSkills.includes(skillInput.trim())) {
      handleArrayChange("topSkills", [...formData.topSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleArrayChange(
      "topSkills",
      formData.topSkills.filter(skill => skill !== skillToRemove)
    );
  };

  // Handle language additions
  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languagesSpoken.includes(languageInput.trim())) {
      handleArrayChange("languagesSpoken", [...formData.languagesSpoken, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    handleArrayChange(
      "languagesSpoken",
      formData.languagesSpoken.filter(lang => lang !== langToRemove)
    );
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Professional Category */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Professional Category</h3>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-darker font-medium">Service Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="w-full focus:ring-light">
                <SelectValue placeholder="Select your service category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-darker">
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Choose the category that best describes your services</p>
          </div>
          
          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-darker font-medium">Experience Level</Label>
            <Select 
              value={formData.level} 
              onValueChange={(value) => handleSelectChange("level", value)}
            >
              <SelectTrigger className="w-full focus:ring-light">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent className="bg-white text-darker">
                {EXPERIENCE_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Skills & Bio */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Skills & Expertise</h3>
          
          {/* Top Skills */}
          <div className="space-y-2">
            <Label htmlFor="topSkills" className="text-darker font-medium">Top Skills</Label>
            <div className="flex gap-2">
              <Input
                id="topSkills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill (e.g. Pipe Installation, Leak Detection, Circuit Design)"
                className="focus-visible:ring-light"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddSkill} 
                className="bg-light hover:bg-lightest text-white hover:text-darker"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Skills Tags */}
            {formData.topSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.topSkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-muted text-darker px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-darker/70 hover:text-darker"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">Add your top skills to help clients find you</p>
          </div>
          
          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="languagesSpoken" className="text-darker font-medium">Languages Spoken</Label>
            <div className="flex gap-2">
              <Input
                id="languagesSpoken"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="Add a language (e.g. English, Sinhala)"
                className="focus-visible:ring-light"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddLanguage} 
                className="bg-light hover:bg-lightest text-white hover:text-darker"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Language Tags */}
            {formData.languagesSpoken.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.languagesSpoken.map((language, index) => (
                  <div 
                    key={index} 
                    className="bg-muted text-darker px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {language}
                    <button 
                      onClick={() => handleRemoveLanguage(language)}
                      className="text-darker/70 hover:text-darker"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-darker font-medium">Professional Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a detailed description of your experience, skills, and services..."
              rows={5}
              className="resize-none focus-visible:ring-light"
              required
            />
            <p className="text-xs text-gray-500">Describe your background, expertise, and the services you provide</p>
          </div>
        </div>
      </Card>

      {/* Availability & Compensation */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Availability & Rate</h3>
          
          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability" className="text-darker font-medium">Availability</Label>
            <Select 
              value={formData.availability} 
              onValueChange={(value) => handleSelectChange("availability", value)}
            >
              <SelectTrigger className="w-full focus:ring-light">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent className="bg-white text-darker">
                {AVAILABILITY_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Salary Rate */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-darker font-medium">Rate/Salary</Label>
            <Input
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., Rs.4000/Day, Rs.30000/Month"
              className="focus-visible:ring-light"
              required
            />
            <p className="text-xs text-gray-500">Specify your daily, hourly, or monthly rate</p>
          </div>
          
          {/* Jobs Completed */}
          <div className="space-y-2">
            <Label htmlFor="jobsCompleted" className="text-darker font-medium">Jobs Completed</Label>
            <Input
              id="jobsCompleted"
              name="jobsCompleted"
              type="number"
              value={formData.jobsCompleted.toString()}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                setFormData(prev => ({
                  ...prev,
                  jobsCompleted: isNaN(value) ? 0 : value
                }));
              }}
              placeholder="Number of jobs completed"
              className="focus-visible:ring-light"
            />
            <p className="text-xs text-gray-500">Enter the number of jobs you've completed previously (can be approximate)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepTwoProfessionalInfo;
