import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FormDataType } from "@/types/form-types";
import ImageUploader from "@/components/image-upload";
import { Card } from "@/components/ui/card";

interface MediaRequirementsProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const StepFourMediaRequirements: React.FC<MediaRequirementsProps> = ({
  formData,
  handleChange,
  setFormData
}) => {
  return (
    <div className="space-y-8">
      {/* Portfolio Images Section */}
      <div className="space-y-3">
        <Label htmlFor="portfolioImages" className="text-darker font-medium">
          Portfolio Images
        </Label>
        <p className="text-sm text-gray-500">
          Upload high-quality images showcasing your work samples and projects
        </p>
        
        <ImageUploader
          endpoint="portfolioUploader"
          multiple={true}
          maxFiles={10}
          value={formData.portfolioImages}
          onUploadComplete={(urls) => {
            setFormData((prev) => ({
              ...prev,
              portfolioImages: urls
            }));
          }}
        />
      </div>
      
      {/* Thumbnail Image Section */}
      <div className="space-y-3">
        <Label htmlFor="thumbnail" className="text-darker font-medium">
          Collab Thumbnail Image
        </Label>
        <p className="text-sm text-gray-500">
          This will be the main preview image for your freelance service
        </p>
        
        <ImageUploader
          endpoint="imageUploader"
          multiple={false}
          maxFiles={1}
          value={formData.thumbnail}
          onUploadComplete={(urls) => {
            setFormData((prev) => ({
              ...prev,
              thumbnail: urls[0]
            }));
          }}
        />
      </div>

      {/* Video Section */}
      <div className="space-y-3">
        <Label htmlFor="video" className="text-darker font-medium">
          Video Introduction (optional)
        </Label>
        <p className="text-sm text-gray-500">
          Add a short video explaining your skills and services (max 50MB)
        </p>
        
        <ImageUploader
          endpoint="videoUploader"
          multiple={false}
          maxFiles={1}
          maxSize={50}
          value={formData.video}
          onUploadComplete={(urls) => {
            setFormData((prev) => ({
              ...prev,
              video: urls[0]
            }));
          }}
        />
        
        {formData.video && (
          <div className="flex items-center bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <span className="flex-1">Video uploaded successfully</span>
            <a 
              href={formData.video} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Preview
            </a>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="space-y-3">
        <Label htmlFor="documents" className="text-darker font-medium">
          PDF Documents (optional)
        </Label>
        <p className="text-sm text-gray-500">
          Upload additional documents like certifications or detailed portfolios
        </p>
        
        <ImageUploader
          endpoint="documentUploader"
          multiple={true}
          maxFiles={5}
          value={formData.documents}
          onUploadComplete={(urls) => {
            setFormData((prev) => ({
              ...prev,
              documents: urls
            }));
          }}
        />
      </div>

      {/* Buyer Requirements Section */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-3">
          <Label htmlFor="buyerRequirements" className="text-darker font-medium">
            Requirements from Buyers
          </Label>
          <p className="text-sm text-gray-500">
            Specify information you need from buyers before starting the project
          </p>
          <Textarea
            id="buyerRequirements"
            name="buyerRequirements"
            value={formData.buyerRequirements}
            onChange={handleChange}
            placeholder="Examples: 'Please describe your project goals', 'What's your brand style?', 'Please provide reference materials'"
            rows={4}
            className="resize-none"
          />
        </div>
      </Card>
    </div>
  );
};

export default StepFourMediaRequirements;
