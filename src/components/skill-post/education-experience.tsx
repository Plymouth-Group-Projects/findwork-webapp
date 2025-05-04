import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataType, EmployerDetails, EducationDetails, CertificationDetails } from "@/types/form-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EducationExperienceProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleEmployerChange: (index: number, field: keyof EmployerDetails, value: string) => void;
  handleEducationChange: (index: number, field: keyof EducationDetails, value: any) => void;
  handleCertificationChange: (index: number, field: keyof CertificationDetails, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const StepThreeEducationExperience: React.FC<EducationExperienceProps> = ({
  formData,
  handleChange,
  handleEmployerChange,
  handleEducationChange,
  handleCertificationChange,
  setFormData
}) => {
  const addEmployer = () => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        previousEmployers: [
          ...prev.experience.previousEmployers,
          { employer: "", duration: "", role: "" }
        ]
      }
    }));
  };

  const removeEmployer = (index: number) => {
    setFormData(prev => {
      const updatedEmployers = [...prev.experience.previousEmployers];
      updatedEmployers.splice(index, 1);
      
      return {
        ...prev,
        experience: {
          ...prev.experience,
          previousEmployers: updatedEmployers.length ? updatedEmployers : [{ employer: "", duration: "", role: "" }]
        }
      };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", qualification: "", yearCompleted: new Date().getFullYear() }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation.splice(index, 1);
      
      return {
        ...prev,
        education: updatedEducation.length ? updatedEducation : [{ institution: "", qualification: "", yearCompleted: new Date().getFullYear() }]
      };
    });
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { title: "", issuer: "", year: new Date().getFullYear() }
      ]
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications.splice(index, 1);
      
      return {
        ...prev,
        certifications: updatedCertifications.length ? updatedCertifications : [{ title: "", issuer: "", year: new Date().getFullYear() }]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Work Experience */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Work Experience</h3>
          
          {/* Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience.years" className="text-darker font-medium">Years of Experience</Label>
            <Input
              id="experience.years"
              name="experience.years"
              type="number"
              min="0"
              step="0.5"
              value={formData.experience.years}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  experience: {
                    ...prev.experience,
                    years: isNaN(value) ? 0 : value
                  }
                }));
              }}
              placeholder="Years of professional experience"
              className="focus-visible:ring-light"
            />
            <p className="text-xs text-gray-500">Enter your total years of professional experience</p>
          </div>
          
          {/* Previous Employers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="previousEmployers" className="text-darker font-medium">Previous Employers</Label>
              <Button 
                type="button" 
                onClick={addEmployer} 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Employer
              </Button>
            </div>
            
            {formData.experience.previousEmployers.map((emp, index) => (
              <div key={index} className="space-y-3 pt-3 border-t border-gray-100 first:border-t-0 first:pt-0">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm text-darker">Employer {index + 1}</div>
                  {formData.experience.previousEmployers.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEmployer(index)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor={`employer-name-${index}`} className="text-darker text-xs">Employer Name</Label>
                    <Input
                      id={`employer-name-${index}`}
                      value={emp.employer}
                      onChange={(e) => handleEmployerChange(index, "employer", e.target.value)}
                      placeholder="Company or employer name"
                      className="focus-visible:ring-light mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`employer-duration-${index}`} className="text-darker text-xs">Duration</Label>
                    <Input
                      id={`employer-duration-${index}`}
                      value={emp.duration}
                      onChange={(e) => handleEmployerChange(index, "duration", e.target.value)}
                      placeholder="e.g., 2020-2023"
                      className="focus-visible:ring-light mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`employer-role-${index}`} className="text-darker text-xs">Role</Label>
                    <Input
                      id={`employer-role-${index}`}
                      value={emp.role}
                      onChange={(e) => handleEmployerChange(index, "role", e.target.value)}
                      placeholder="Your job title or role"
                      className="focus-visible:ring-light mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-darker">Education</h3>
            <Button 
              type="button" 
              onClick={addEducation} 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Education
            </Button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={index} className="space-y-3 pt-3 border-t border-gray-100 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between">
                <div className="font-medium text-sm text-darker">Education {index + 1}</div>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeEducation(index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-3">
                <div>
                  <Label htmlFor={`institution-${index}`} className="text-darker text-xs">Institution</Label>
                  <Input
                    id={`institution-${index}`}
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                    placeholder="School, college or university name"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`qualification-${index}`} className="text-darker text-xs">Qualification</Label>
                  <Input
                    id={`qualification-${index}`}
                    value={edu.qualification}
                    onChange={(e) => handleEducationChange(index, "qualification", e.target.value)}
                    placeholder="Degree, diploma or certificate name"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`year-${index}`} className="text-darker text-xs">Year Completed</Label>
                  <Input
                    id={`year-${index}`}
                    type="number"
                    value={edu.yearCompleted}
                    onChange={(e) => handleEducationChange(index, "yearCompleted", e.target.value)}
                    placeholder="Year of completion"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certifications */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-darker">Certifications</h3>
            <Button 
              type="button" 
              onClick={addCertification} 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Certification
            </Button>
          </div>
          
          {formData.certifications.map((cert, index) => (
            <div key={index} className="space-y-3 pt-3 border-t border-gray-100 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between">
                <div className="font-medium text-sm text-darker">Certification {index + 1}</div>
                {formData.certifications.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeCertification(index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-3">
                <div>
                  <Label htmlFor={`cert-title-${index}`} className="text-darker text-xs">Certification Title</Label>
                  <Input
                    id={`cert-title-${index}`}
                    value={cert.title}
                    onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
                    placeholder="Certification name"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`cert-issuer-${index}`} className="text-darker text-xs">Issuing Organization</Label>
                  <Input
                    id={`cert-issuer-${index}`}
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                    placeholder="Organization that issued the certification"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`cert-year-${index}`} className="text-darker text-xs">Year</Label>
                  <Input
                    id={`cert-year-${index}`}
                    type="number"
                    value={cert.year}
                    onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                    placeholder="Year obtained"
                    className="focus-visible:ring-light mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <p className="text-xs text-gray-500">List relevant certifications or professional accreditations</p>
        </div>
      </Card>
    </div>
  );
};

export default StepThreeEducationExperience;