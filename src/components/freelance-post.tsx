"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormDataType, PackageDetails } from "@/types/form-types";

// Import step components
import StepOneProfessionalInfo from "@/components/professional-info";
import StepTwoGigDetails from "@/components/collab-details";
import StepThreePricing from "@/components/pricing";
import StepFourMediaRequirements from "@/components/media-requirements";

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
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your freelance gig",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare data with user ID
      const dataToSubmit = {
        ...formData,
        userId: session.user.id,
      };
      
      // Submit to your API endpoint
      const response = await fetch('/api/freelance-gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save gig information');
      }
      
      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Your freelance gig has been posted successfully",
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
      console.log("Gig created:", result);
      
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {step === 1 && "Professional Information"}
          {step === 2 && "Gig Details"}
          {step === 3 && "Pricing"}
          {step === 4 && "Media & Requirements"}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <StepTwoGigDetails 
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
            <StepFourMediaRequirements 
              formData={formData} 
              handleChange={handleChange} 
              setFormData={setFormData} 
            />
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
            Previous
          </Button>
        )}
        {step === 1 && <div></div>}
        
        {step < 4 ? (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-blue-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FreelancePostForm;
