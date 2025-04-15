import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@uploadthing/react";
import { toast } from "@/hooks/use-toast";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { FormDataType } from "@/types/form-types";

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
    <div className="space-y-6">
      <div>
        <Label htmlFor="portfolioImages">Portfolio Images</Label>
        <div className="mt-2">
          <UploadButton<OurFileRouter, "portfolioUploader">
            endpoint="portfolioUploader"
            onClientUploadComplete={(res) => {
              if (!res?.length) return;

              // Add uploaded image URLs to form data
              const imageUrls = res.map(file => file.url);
              setFormData((prev: FormDataType) => ({
                ...prev,
                portfolioImages: [...prev.portfolioImages, ...imageUrls]
              }));

              toast({
                title: "Images uploaded",
                description: `Successfully uploaded ${res.length} images`
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive"
              });
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Upload up to 10 images showcasing your work</p>

        {/* Preview uploaded portfolio images */}
        {formData.portfolioImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {formData.portfolioImages.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`Portfolio image ${idx + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  onClick={() => {
                    setFormData((prev: FormDataType) => ({
                      ...prev,
                      portfolioImages: prev.portfolioImages.filter((_, i) => i !== idx)
                    }));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="thumbnail">Gig Thumbnail Image</Label>
        <div className="mt-2">
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (!res?.[0]) return;

              setFormData((prev: FormDataType) => ({
                ...prev,
                thumbnail: res[0].url
              }));

              toast({
                title: "Thumbnail uploaded",
                description: "Your gig thumbnail has been uploaded"
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive"
              });
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">This will be the main display image for your gig</p>

        {/* Preview thumbnail */}
        {formData.thumbnail && (
          <div className="mt-4 relative inline-block">
            <img
              src={formData.thumbnail}
              alt="Gig thumbnail"
              className="h-32 w-32 object-cover rounded-md"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              onClick={() => setFormData((prev: FormDataType) => ({ ...prev, thumbnail: "" }))}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="video">Video Introduction (optional)</Label>
        <div className="mt-2">
          <UploadButton<OurFileRouter, "videoUploader">
            endpoint="videoUploader"
            onClientUploadComplete={(res) => {
              if (!res?.[0]) return;

              setFormData((prev: FormDataType) => ({
                ...prev,
                video: res[0].url
              }));

              toast({
                title: "Video uploaded",
                description: "Your introduction video has been uploaded"
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive"
              });
            }}
          />
        </div>

        {/* Show video link if uploaded */}
        {formData.video && (
          <div className="mt-4 flex items-center space-x-2">
            <span>Video uploaded</span>
            <a
              href={formData.video}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View video
            </a>
            <button
              type="button"
              className="text-red-500"
              onClick={() => setFormData((prev: FormDataType) => ({ ...prev, video: "" }))}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="documents">PDF Documents (optional)</Label>
        <div className="mt-2">
          <UploadButton<OurFileRouter, "documentUploader">
            endpoint="documentUploader"
            onClientUploadComplete={(res) => {
              if (!res?.length) return;

              // Add uploaded document URLs to form data
              const docUrls = res.map(file => file.url);
              setFormData((prev: FormDataType) => ({
                ...prev,
                documents: [...prev.documents, ...docUrls]
              }));

              toast({
                title: "Documents uploaded",
                description: `Successfully uploaded ${res.length} documents`
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive"
              });
            }}
          />
        </div>

        {/* List uploaded documents */}
        {formData.documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.documents.map((url, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Document {idx + 1}
                </a>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    setFormData((prev: FormDataType) => ({
                      ...prev,
                      documents: prev.documents.filter((_, i) => i !== idx)
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="buyerRequirements">Requirements from Buyers</Label>
        <Textarea
          id="buyerRequirements"
          name="buyerRequirements"
          value={formData.buyerRequirements}
          onChange={handleChange}
          placeholder="Questions the buyer needs to answer before you start (e.g., 'Please describe your brand', 'Upload your logo')"
          rows={4}
        />
      </div>
    </div>
  );
};

export default StepFourMediaRequirements;
