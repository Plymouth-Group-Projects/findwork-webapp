"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "@/hooks/use-toast";
import { X, Upload, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  endpoint: "imageUploader" | "portfolioUploader" | "documentUploader" | "videoUploader";
  className?: string;
  onUploadComplete?: (urls: string[]) => void;
  multiple?: boolean;
  value?: string | string[];
  maxFiles?: number;
  maxSize?: number;
}

export default function ImageUploader({
  endpoint = "imageUploader",
  className,
  onUploadComplete,
  multiple = false,
  value,
  maxFiles = 1,
  maxSize = 4
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(
    value ? (Array.isArray(value) ? value : value ? [value] : []) : []
  );
  const [uploadView, setUploadView] = useState<"button" | "dropzone">("button");

  const handleClientUploadComplete = (res: any) => {
    const urls = res.map((file: any) => file.url);
    setUploadedFiles((prev) => [...prev, ...urls].slice(0, maxFiles));
    setIsUploading(false);
    
    if (onUploadComplete) {
      onUploadComplete(multiple ? [...uploadedFiles, ...urls].slice(0, maxFiles) : [urls[0]]);
    }
    
    toast({
      title: "Upload Complete",
      description: `${urls.length} file${urls.length > 1 ? 's' : ''} uploaded successfully`,
      variant: "default",
    });
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    toast({
      title: "Upload Failed",
      description: error.message || "Something went wrong while uploading your file",
      variant: "destructive",
    });
  };

  const handleDelete = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== indexToRemove);
    setUploadedFiles(newFiles);
    
    if (onUploadComplete) {
      onUploadComplete(multiple ? newFiles : []);
    }
  };

  const remainingSlots = maxFiles - uploadedFiles.length;

  return (
    <div className={cn("space-y-4", className)}>
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedFiles.map((file, i) => (
            <div 
              key={i}
              className="relative group aspect-square rounded-md overflow-hidden border border-border bg-background"
            >
              <img 
                src={file} 
                alt={`Uploaded file ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {remainingSlots > 0 && (
        <div>
          {uploadView === "button" ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all hover:border-primary/50 bg-background">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
              <p className="text-xs text-gray-500 mb-4">Upload up to {remainingSlots} {multiple ? "files" : "file"} (max {maxSize}MB each)</p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => setUploadView("dropzone")}
                >
                  Use Drag & Drop
                </Button>
                
                <UploadButton<OurFileRouter, typeof endpoint>
                  endpoint={endpoint}
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={handleClientUploadComplete}
                  onUploadError={handleUploadError}
                  className="ut-button:text-sm ut-button:font-medium ut-button:bg-light ut-button:text-white ut-button:hover:bg-light/90 ut-button:rounded-md ut-button:h-9 ut-button:px-4 ut-button:transition-colors ut-allowed-content:hidden"
                  appearance={{
                    button: "ut-upload-button:bg-primary ut-upload-button:text-primary-foreground",
                    container: "flex items-center justify-center",
                    allowedContent: "hidden",
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <UploadDropzone<OurFileRouter, typeof endpoint>
                endpoint={endpoint}
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={handleClientUploadComplete}
                onUploadError={handleUploadError}
                className="ut-upload-dropzone:border-2 ut-upload-dropzone:border-dashed ut-upload-dropzone:border-gray-300 ut-upload-dropzone:rounded-lg ut-upload-dropzone:p-6 ut-upload-dropzone:transition-all ut-upload-dropzone:hover:border-primary/50 ut-upload-dropzone:bg-background"
                content={{
                  label: `Drag & drop up to ${remainingSlots} file${remainingSlots > 1 ? 's' : ''} here`,
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs"
                onClick={() => setUploadView("button")}
              >
                Return to standard upload
              </Button>
            </div>
          )}
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center justify-center p-2 bg-primary/5 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
      
      {maxFiles > 1 && uploadedFiles.length > 0 && (
        <p className="text-xs text-gray-500">
          {uploadedFiles.length} of {maxFiles} files uploaded
          {remainingSlots > 0 && ` (${remainingSlots} remaining)`}
        </p>
      )}
    </div>
  );
}
