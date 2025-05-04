import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormDataType, EmployerDetails, EducationDetails, CertificationDetails } from "@/types/form-types";
import { 
  Briefcase, 
  Image,
  Check,
  User,
  GraduationCap,
  AlertCircle
} from "lucide-react";

// Import step components
import StepOnePersonalInfo from "@/components/skill-post/personal-info";
import StepTwoProfessionalInfo from "@/components/skill-post/professional-info";
import StepThreeEducationExperience from "@/components/skill-post/education-experience";
import StepFourMediaRequirements from "@/components/skill-post/media-requirements";

// Maximum number of worker profiles per user
const MAX_PROFILES_PER_USER = 5;

interface FreelancePostFormProps {
  initialData?: FormDataType;
  isEditing?: boolean;
  collaborationId?: string;
}

const FreelancePostForm = ({ initialData, isEditing = false, collaborationId }: FreelancePostFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilesCount, setProfilesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<FormDataType>(initialData || {
    // Personal Information
    name: "",
    gender: "",
    dob: "",
    profileTitle: "", // New field to identify different profiles
    
    // Contact Information
    contact: {
      phone: "",
      email: "",
      address: ""
    },
    
    // Professional Information
    languagesSpoken: [],
    bio: "",
    category: "",
    topSkills: [],
    level: "",
    availability: "",
    salary: "",
    jobsCompleted: 0,
    
    // Experience Details
    experience: {
      years: 0,
      previousEmployers: [
        { employer: "", duration: "", role: "" }
      ]
    },
    
    // Education & Certifications
    education: [
      { institution: "", qualification: "", yearCompleted: new Date().getFullYear() }
    ],
    certifications: [
      { title: "", issuer: "", year: new Date().getFullYear() }
    ],
    
    // Media & Requirements
    portfolioImages: [],
    thumbnail: "",
    video: "",
    documents: [],
    buyerRequirements: "",
  });

  // Fetch user's existing profiles count
  useEffect(() => {
    const fetchProfilesCount = async () => {
      try {
        if (session?.user) {
          const response = await fetch('/api/collaboration?userId=current&countOnly=true');
          if (response.ok) {
            const data = await response.json();
            setProfilesCount(data.count || 0);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profiles count:", error);
        setIsLoading(false);
      }
    };

    // Skip counting profiles if we're editing an existing one
    if (isEditing) {
      setIsLoading(false);
    } else {
      fetchProfilesCount();
    }
  }, [session, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => {
        // Ensure that prevState[parent] is an object before spreading
        const parentValue = prevState[parent as keyof typeof prevState];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prevState,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        return prevState;
      });
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleEmployerChange = (index: number, field: keyof EmployerDetails, value: string) => {
    setFormData(prevState => {
      const updatedEmployers = [...prevState.experience.previousEmployers];
      updatedEmployers[index] = {
        ...updatedEmployers[index],
        [field]: value
      };
      
      return {
        ...prevState,
        experience: {
          ...prevState.experience,
          previousEmployers: updatedEmployers
        }
      };
    });
  };

  const handleEducationChange = (index: number, field: keyof EducationDetails, value: string | number) => {
    setFormData(prevState => {
      const updatedEducation = [...prevState.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: field === 'yearCompleted' ? Number(value) : value
      };
      
      return {
        ...prevState,
        education: updatedEducation
      };
    });
  };

  const handleCertificationChange = (index: number, field: keyof CertificationDetails, value: string | number) => {
    setFormData(prevState => {
      const updatedCertifications = [...prevState.certifications];
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: field === 'year' ? Number(value) : value
      };
      
      return {
        ...prevState,
        certifications: updatedCertifications
      };
    });
  };

  const handleArrayChange = (name: string, values: string[]) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: values
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(current => current + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(current => current - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Add profileTitle if not set
      if (!formData.profileTitle.trim()) {
        formData.profileTitle = formData.name;
      }
      
      // Prepare data for API
      const apiData = {
        ...formData,
        projectTitle: formData.profileTitle || formData.name,
        projectDescription: formData.bio,
        skills: formData.topSkills.join(', '), // Add this line to map topSkills to skills
      };
      
      let response;
      
      if (isEditing && collaborationId) {
        // Update existing collaboration
        response = await fetch(`/api/collaboration/${collaborationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });
      } else {
        // Create new collaboration
        response = await fetch('/api/collaboration/post-collab', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to save worker profile information';
        console.error("API Error:", errorData);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      toast({
        title: "Success!",
        description: isEditing 
          ? "Your worker profile has been updated successfully" 
          : "Your worker profile has been created successfully",
      });
      
      // Redirect to the collaboration dashboard page
      router.push("/dashboard/collaboration");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading profiles count
  if (isLoading) {
    return (
      <div className="container px-4 mx-auto py-10">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  // If user has reached the maximum number of profiles and not editing
  if (profilesCount >= MAX_PROFILES_PER_USER && !isEditing) {
    return (
      <div className="container px-4 mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b bg-white rounded-t-lg">
              <CardTitle className="text-darker">Maximum Profiles Reached</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 bg-white text-darker">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p>You've reached the maximum limit of {MAX_PROFILES_PER_USER} worker profiles. Please edit or delete an existing profile to create a new one.</p>
              </div>
              <Button 
                onClick={() => router.push("/dashboard/collaboration")}
                className="bg-light hover:bg-lightest text-white hover:text-darker"
              >
                Go to My Profiles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-darker mb-2">
            {isEditing ? "Edit Your Worker Profile" : "Create Your Worker Profile"}
          </h1>
          <p className="text-darker/70">
            {isEditing 
              ? "Update your profile information to keep it current and attractive to potential clients."
              : `Complete your profile to showcase your skills and experience to potential clients. 
                 You've created ${profilesCount} of ${MAX_PROFILES_PER_USER} allowed profiles.`
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-light text-white' : 'bg-gray-200 text-gray-500'}`}>
                <User className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Personal Info</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 2 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Professional Info</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 3 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Education & Experience</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 4 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 4 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 4 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <Image className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Media</p>
            </div>
          </div>
        </div>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b bg-white rounded-t-lg">
            <CardTitle className="text-darker">
              {step === 1 && "Personal Information"}
              {step === 2 && "Professional Details"}
              {step === 3 && "Education & Experience"}
              {step === 4 && "Media & Portfolio"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 bg-white text-darker">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
              {/* Render appropriate step component */}
              {step === 1 && (
                <StepOnePersonalInfo 
                  formData={formData} 
                  handleChange={handleChange} 
                  setFormData={setFormData} 
                />
              )}

              {step === 2 && (
                <StepTwoProfessionalInfo 
                  formData={formData} 
                  handleChange={handleChange}
                  handleArrayChange={handleArrayChange}
                  setFormData={setFormData} 
                />
              )}

              {step === 3 && (
                <StepThreeEducationExperience 
                  formData={formData}
                  handleChange={handleChange}
                  handleEmployerChange={handleEmployerChange}
                  handleEducationChange={handleEducationChange}
                  handleCertificationChange={handleCertificationChange}
                  setFormData={setFormData}
                />
              )}

              {step === 4 && (
                <div>
                  <StepFourMediaRequirements 
                    formData={formData} 
                    handleChange={handleChange} 
                    setFormData={setFormData} 
                  />
                  
                  {formData.portfolioImages.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-6">
                      <p className="text-amber-800 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        <span>
                          <span className="font-medium">Ready to publish:</span> Your worker profile will be visible to potential clients once posted.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-6 bg-gray-50 rounded-b-lg">
            {step > 1 ? (
              <Button 
                type="button" 
                onClick={handleBack} 
                variant="outline" 
                disabled={isSubmitting}
                className="border-gray-300 text-darker"
              >
                Previous
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => router.push("/dashboard/collaboration")}
                variant="outline"
                className="border-gray-300 text-darker"
              >
                Cancel
              </Button>
            )}
            
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-light hover:bg-lightest text-white hover:text-darker"
              >
                Continue
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="bg-light hover:bg-lightest text-white hover:text-darker" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : isEditing ? "Update Profile" : "Create Profile"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FreelancePostForm;
