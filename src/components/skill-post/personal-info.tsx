import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataType } from "@/types/form-types";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/image-upload";

interface PersonalInfoProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const StepOnePersonalInfo: React.FC<PersonalInfoProps> = ({
  formData,
  handleChange,
  setFormData
}) => {
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Personal Information</h3>
          
          {/* Profile Title */}
          <div className="space-y-2">
            <Label htmlFor="profileTitle" className="text-darker font-medium">Profile Title</Label>
            <Input
              id="profileTitle"
              name="profileTitle"
              value={formData.profileTitle}
              onChange={handleChange}
              placeholder="Give this worker profile a title (e.g. 'Plumbing Services', 'Carpentry Work')"
              className="focus-visible:ring-light"
              required
            />
            <p className="text-xs text-gray-500">This title will help you identify this profile among others you may create</p>
          </div>
          
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-darker font-medium">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="focus-visible:ring-light"
              required
            />
          </div>
          
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-darker font-medium">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={handleGenderChange}
            >
              <SelectTrigger className="w-full focus:ring-light">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent className="bg-white text-darker">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-darker font-medium">Date of Birth</Label>
            <div className="relative">
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="focus-visible:ring-light"
                required
              />
              <CalendarIcon className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">This information will be used for identification purposes only</p>
          </div>
        </div>
      </Card>
      
      {/* Contact Information Section */}
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-darker">Contact Information</h3>
          
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="contact.phone" className="text-darker font-medium">Phone Number</Label>
            <Input
              id="contact.phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              placeholder="e.g., +94 77 123 4567"
              className="focus-visible:ring-light"
              required
            />
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="contact.email" className="text-darker font-medium">Email Address</Label>
            <Input
              id="contact.email"
              name="contact.email"
              type="email"
              value={formData.contact.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="focus-visible:ring-light"
              required
            />
          </div>
          
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="contact.address" className="text-darker font-medium">Full Address</Label>
            <Input
              id="contact.address"
              name="contact.address"
              value={formData.contact.address}
              onChange={handleChange}
              placeholder="e.g., No: 123, Colombo Road, Colombo 07"
              className="focus-visible:ring-light"
              required
            />
          </div>
          
          <p className="text-xs text-gray-500">Your contact information will be visible to clients who want to hire you</p>
        </div>
      </Card>
    </div>
  );
};

export default StepOnePersonalInfo;