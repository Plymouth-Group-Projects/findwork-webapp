import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface GigDetailsProps {
  formData: {
    gigTitle: string;
    category: string;
    subcategory: string;
    gigDescription: string;
    searchTags: string;
    deliveryTime: string;
    revisions: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const StepTwoGigDetails: React.FC<GigDetailsProps> = ({
  formData,
  handleChange,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="gigTitle">Gig Title</Label>
        <Input 
          id="gigTitle"
          name="gigTitle"
          value={formData.gigTitle}
          onChange={handleChange}
          placeholder="e.g., I will design a modern logo for your business"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            onValueChange={(value) => setFormData({...formData, category: value})} 
            value={formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design & Creative</SelectItem>
              <SelectItem value="development">Development & IT</SelectItem>
              <SelectItem value="writing">Writing & Translation</SelectItem>
              <SelectItem value="marketing">Digital Marketing</SelectItem>
              <SelectItem value="video">Video & Animation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select 
            onValueChange={(value) => setFormData({...formData, subcategory: value})} 
            value={formData.subcategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logo">Logo Design</SelectItem>
              <SelectItem value="webdesign">Website Design</SelectItem>
              <SelectItem value="webapp">Web Applications</SelectItem>
              <SelectItem value="mobileapp">Mobile Applications</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="gigDescription">Gig Description</Label>
        <Textarea 
          id="gigDescription"
          name="gigDescription"
          value={formData.gigDescription}
          onChange={handleChange}
          placeholder="Detailed explanation of what you offer"
          rows={5}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="searchTags">Search Tags</Label>
        <Input 
          id="searchTags"
          name="searchTags"
          value={formData.searchTags}
          onChange={handleChange}
          placeholder="e.g., logo, branding, creative (comma separated)"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
          <Input 
            id="deliveryTime"
            name="deliveryTime"
            type="number"
            min="1"
            value={formData.deliveryTime}
            onChange={handleChange}
            placeholder="e.g., 3"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="revisions">Number of Revisions</Label>
          <Input 
            id="revisions"
            name="revisions"
            type="number"
            min="0"
            value={formData.revisions}
            onChange={handleChange}
            placeholder="e.g., 2"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default StepTwoGigDetails;
