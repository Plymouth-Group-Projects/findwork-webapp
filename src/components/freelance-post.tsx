
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormDataType, PackageDetails } from "@/types/form-types";
import { 
  FileText, 
  Briefcase, 
  Image,
  DollarSign,
  Check
} from "lucide-react";

// Import step components
import StepOneProfessionalInfo from "@/components/skill-post/professional-info";
import StepTwoCollabDetails from "@/components/skill-post/collab-details";
import StepThreePricing from "@/components/skill-post/pricing";
import StepFourMediaRequirements from "@/components/skill-post/media-requirements";

const FreelancePostForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormDataType>({
    // Professional Information
    professionalTitle: "",
    shortBio: "",
    skills: "",
    languages: "",
    experienceLevel: "",
    
    // Gig Details
    gigTitle: "",
    category: "",
    subcategory: "",
    gigDescription: "",
    searchTags: "",
    deliveryTime: "",
    revisions: "",
    
    // Pricing
    pricingModel: "single", // single or tiered
    singlePrice: "",
    basicPackage: { name: "Basic", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
    standardPackage: { name: "Standard", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
    premiumPackage: { name: "Premium", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
    
    // Media & Requirements
    portfolioImages: [],
    thumbnail: "",
    video: "",
    documents: [],
    buyerRequirements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  type PackageType = "basicPackage" | "standardPackage" | "premiumPackage";
  type PackageFieldKey = keyof PackageDetails;

  const handlePackageChange = (packageType: PackageType, field: string, value: string): void => {
      setFormData(prevState => ({
          ...prevState,
          [packageType]: {
              ...prevState[packageType],
              [field]: value
          }
      }));
  };

  const handleNext = () => {
    setStep(prevStep => Math.min(prevStep + 1, 4));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your freelance collab",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit data without explicitly including userId - the API will look it up by email
      const response = await fetch('/api/freelance-gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to save freelance collab information';
        console.error("API Error:", errorData);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Your freelance collab has been posted successfully",
      });
      
      // Reset form and redirect
      setFormData({
        professionalTitle: "",
        shortBio: "",
        skills: "",
        languages: "",
        experienceLevel: "",
        gigTitle: "",
        category: "",
        subcategory: "",
        gigDescription: "",
        searchTags: "",
        deliveryTime: "",
        revisions: "",
        pricingModel: "single",
        singlePrice: "",
        basicPackage: { name: "Basic", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
        standardPackage: { name: "Standard", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
        premiumPackage: { name: "Premium", description: "", price: "", deliveryTime: "", revisions: "", includes: "" },
        portfolioImages: [],
        thumbnail: "",
        video: "",
        documents: [],
        buyerRequirements: ""
      });
      
      // Navigate to dashboard using the router
      router.push("/dashboard");
      console.log("Freelance collab created:", result);
      
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

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-darker mb-2">Post a New Freelance Service</h1>
          <p className="text-darker/70">Create a freelance service listing to showcase your skills to potential clients</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-light text-white' : 'bg-gray-200 text-gray-500'}`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Professional Info</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 2 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Collab Details</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 3 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Pricing</p>
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
              {step === 1 && "Professional Information"}
              {step === 2 && "Collab Details"}
              {step === 3 && "Pricing Options"}
              {step === 4 && "Media & Requirements"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 bg-white text-darker">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
              {/* Render appropriate step component */}
              {step === 1 && (
                <StepOneProfessionalInfo 
                  formData={formData} 
                  handleChange={handleChange} 
                  setFormData={setFormData} 
                />
              )}

              {step === 2 && (
                <StepTwoCollabDetails 
                  formData={formData} 
                  handleChange={handleChange} 
                  setFormData={setFormData} 
                />
              )}

              {step === 3 && (
                <StepThreePricing 
                  formData={formData} 
                  handleChange={handleChange} 
                  setFormData={setFormData} 
                  handlePackageChange={handlePackageChange}
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
                          <span className="font-medium">Ready to publish:</span> Your freelance service will be visible to potential clients once posted.
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
              <div></div>
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
                {isSubmitting ? "Submitting..." : "Publish Freelance Service"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FreelancePostForm;
