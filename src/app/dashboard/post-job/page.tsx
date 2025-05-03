"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  FileText, 
  MapPin, 
  Briefcase,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast, toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define job data interface
interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: string;
  employmentType: string;
  category: string;
  experienceLevel: string;
  salaryRange: {
    min: string;
    max: string;
  };
  salaryDisplayOption: string;
  deadline: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  applicationEmail: string;
  applicationUrl: string;
  contactPhone: string;
  remoteOption: string;
  applicationMethod: string;
}

export default function PostJobPage() {
  const { toasts, dismiss } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Job form state
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    employmentType: "permanent",
    category: "",
    experienceLevel: "intermediate",
    salaryRange: { min: "", max: "" },
    salaryDisplayOption: "show-range",
    deadline: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    applicationEmail: "",
    applicationUrl: "",
    contactPhone: "",
    remoteOption: "onsite",
    applicationMethod: "email",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle nested object changes (like salary range)
  const handleNestedChange = (parent: keyof JobFormData, field: string, value: string) => {
    if (parent === "salaryRange") {
      setJobData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [field]: value
        }
      }));
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name: keyof JobFormData, value: string) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select dropdown changes
  const handleSelectChange = (name: keyof JobFormData, value: string) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle job posting submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // This would be replaced with an actual API call in a real app
      // const response = await fetch('/api/jobs/create', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' }, 
      //   body: JSON.stringify(jobData) 
      // });
      
      // Simulate API call success for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      });
      
      // Navigate back to dashboard
      router.push("/dashboard/job-listing");
      
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-darker mb-2">Post a New Job</h1>
          <p className="text-darker/70">Create a job listing to find the perfect candidate</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${currentStep >= 1 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Job Details</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-light' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${currentStep >= 2 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Description</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-light' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${currentStep >= 3 ? 'text-light' : 'text-gray-400'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 ${currentStep >= 3 ? 'bg-light text-white' : 'bg-gray-400 text-gray-500'}`}>
                <Check className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Review & Post</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b bg-white rounded-t-lg">
              <CardTitle className="text-darker">
                {currentStep === 1 && "Basic Job Information"}
                {currentStep === 2 && "Job Description & Requirements"}
                {currentStep === 3 && "Review Your Job Listing"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 bg-white text-darker">
              {/* Step 1: Basic Job Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-darker">Job Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        placeholder="e.g., Senior Software Engineer"
                        className="border-gray-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-darker">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        value={jobData.company}
                        onChange={handleChange}
                        placeholder="e.g., TechCorp Inc."
                        className="border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-darker">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="location"
                          name="location"
                          value={jobData.location}
                          onChange={handleChange}
                          placeholder="e.g., Colombo, Sri Lanka"
                          className="pl-10 border-gray-300"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-darker">Job Category *</Label>
                      <Select 
                        value={jobData.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category" className="border-gray-300">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            <SelectItem value="information-technology">Information Technology</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="cleaning">Cleaning Services</SelectItem>
                            <SelectItem value="electrical">Electrical Services</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="driving">Driving & Transport</SelectItem>
                            <SelectItem value="gardening">Gardening & Landscaping</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-darker">Job Type *</Label>
                    <RadioGroup 
                      value={jobData.jobType}
                      onValueChange={(value) => handleRadioChange("jobType", value)}
                      className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-time" id="full-time" />
                        <Label htmlFor="full-time" className="font-normal">Full-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part-time" id="part-time" />
                        <Label htmlFor="part-time" className="font-normal">Part-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contract" id="contract" />
                        <Label htmlFor="contract" className="font-normal">Contract</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily" className="font-normal">Daily wage</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-darker">Work Location *</Label>
                    <RadioGroup 
                      value={jobData.remoteOption}
                      onValueChange={(value) => handleRadioChange("remoteOption", value)}
                      className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="onsite" id="onsite" />
                        <Label htmlFor="onsite" className="font-normal">On-site</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="remote" id="remote" />
                        <Label htmlFor="remote" className="font-normal">Remote</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hybrid" id="hybrid" />
                        <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel" className="text-darker">Experience Level *</Label>
                      <Select 
                        value={jobData.experienceLevel} 
                        onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                      >
                        <SelectTrigger id="experienceLevel" className="border-gray-300">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-darker">Application Deadline</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="deadline"
                          name="deadline"
                          type="date"
                          value={jobData.deadline}
                          onChange={handleChange}
                          className="pl-10 border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-darker flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-light" />
                      Salary Information
                    </h3>
                    <RadioGroup
                      value={jobData.salaryDisplayOption}
                      onValueChange={(value) => handleRadioChange("salaryDisplayOption", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="show-range" id="show-range" className="mt-0.5" />
                        <div className="grid w-full gap-2">
                          <Label htmlFor="show-range" className="font-normal">Show salary range</Label>
                          {jobData.salaryDisplayOption === "show-range" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="Minimum"
                                  value={jobData.salaryRange.min}
                                  onChange={(e) => handleNestedChange("salaryRange", "min", e.target.value)}
                                  className="pl-10"
                                  type="number"
                                />
                              </div>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="Maximum"
                                  value={jobData.salaryRange.max}
                                  onChange={(e) => handleNestedChange("salaryRange", "max", e.target.value)}
                                  className="pl-10"
                                  type="number"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hide" id="hide-salary" />
                        <Label htmlFor="hide-salary" className="font-normal">Hide salary (display as "Competitive" or "Negotiable")</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Job Description */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-darker">Job Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={jobData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of the job role"
                      className="min-h-[150px] border-gray-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities" className="text-darker">Key Responsibilities *</Label>
                    <Textarea
                      id="responsibilities"
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleChange}
                      placeholder="List the main responsibilities and duties of the role"
                      className="min-h-[150px] border-gray-300"
                      required
                    />
                    <p className="text-xs text-darker/70">Tip: Use bullet points for better readability (e.g., "- Maintain client relationships")</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-darker">Requirements & Qualifications *</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={jobData.requirements}
                      onChange={handleChange}
                      placeholder="List the skills, experience, and qualifications needed"
                      className="min-h-[150px] border-gray-300"
                      required
                    />
                    <p className="text-xs text-darker/70">Tip: Be specific about required skills and years of experience</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits" className="text-darker">Benefits & Perks</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      value={jobData.benefits}
                      onChange={handleChange}
                      placeholder="Describe benefits like healthcare, vacation, flexible hours, etc."
                      className="min-h-[100px] border-gray-300"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-darker flex items-center">
                      <Users className="h-5 w-5 mr-1 text-light" />
                      Application Details
                    </h3>
                    
                    <div className="space-y-2">
                      <Label className="text-darker">How should candidates apply? *</Label>
                      <RadioGroup 
                        value={jobData.applicationMethod}
                        onValueChange={(value) => handleRadioChange("applicationMethod", value)}
                        className="space-y-3 pt-2"
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="email" id="apply-email" className="mt-0.5" />
                          <div className="grid gap-2 w-full">
                            <Label htmlFor="apply-email" className="font-normal">Email application</Label>
                            {jobData.applicationMethod === "email" && (
                              <Input
                                name="applicationEmail"
                                value={jobData.applicationEmail}
                                onChange={handleChange}
                                placeholder="Enter application email address"
                                className="border-gray-300"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="website" id="apply-website" className="mt-0.5" />
                          <div className="grid gap-2 w-full">
                            <Label htmlFor="apply-website" className="font-normal">External website/form</Label>
                            {jobData.applicationMethod === "website" && (
                              <Input
                                name="applicationUrl"
                                value={jobData.applicationUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/careers/apply"
                                className="border-gray-300"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="phone" id="apply-phone" className="mt-0.5" />
                          <div className="grid gap-2 w-full">
                            <Label htmlFor="apply-phone" className="font-normal">By phone</Label>
                            {jobData.applicationMethod === "phone" && (
                              <Input
                                name="contactPhone"
                                value={jobData.contactPhone}
                                onChange={handleChange}
                                placeholder="Enter contact phone number"
                                className="border-gray-300"
                              />
                            )}
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-light/5 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-darker mb-6">{jobData.title}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Company</Label>
                        <p className="text-darker font-medium">{jobData.company}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Location</Label>
                        <p className="text-darker font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-light" />
                          {jobData.location} {jobData.remoteOption !== 'onsite' && `(${jobData.remoteOption})`}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Job Type</Label>
                        <p className="text-darker font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-light" />
                          {jobData.jobType.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Experience Level</Label>
                        <p className="text-darker font-medium flex items-center">
                          <Users className="h-4 w-4 mr-1 text-light" />
                          {jobData.experienceLevel.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Category</Label>
                        <p className="text-darker font-medium">{jobData.category.replace('-', ' ')}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-darker/70">Salary</Label>
                        <p className="text-darker font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-light" />
                          {jobData.salaryDisplayOption === 'show-range' ? 
                            `${jobData.salaryRange.min} - ${jobData.salaryRange.max}` : 
                            'Competitive'
                          }
                        </p>
                      </div>
                    </div>

                    <Separator className="mb-6" />

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-darker font-medium">Job Description</h3>
                        <p className="text-darker/80 whitespace-pre-line text-sm">{jobData.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-darker font-medium">Responsibilities</h3>
                        <p className="text-darker/80 whitespace-pre-line text-sm">{jobData.responsibilities}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-darker font-medium">Requirements</h3>
                        <p className="text-darker/80 whitespace-pre-line text-sm">{jobData.requirements}</p>
                      </div>
                      
                      {jobData.benefits && (
                        <div className="space-y-2">
                          <h3 className="text-darker font-medium">Benefits</h3>
                          <p className="text-darker/80 whitespace-pre-line text-sm">{jobData.benefits}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h3 className="text-darker font-medium">How to Apply</h3>
                        <p className="text-darker/80 flex items-center">
                          {jobData.applicationMethod === 'email' && (
                            <span className="text-sm">Send your application to: <span className="font-medium text-light">{jobData.applicationEmail}</span></span>
                          )}
                          {jobData.applicationMethod === 'website' && (
                            <span className="text-sm">Apply through our website: <span className="font-medium text-light">{jobData.applicationUrl}</span></span>
                          )}
                          {jobData.applicationMethod === 'phone' && (
                            <span className="text-sm">Call us at: <span className="font-medium text-light">{jobData.contactPhone}</span></span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        <span className="font-medium">Ready to publish:</span> Your job will be visible to potential applicants once posted.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-6 bg-gray-50 rounded-b-lg">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1 || isSubmitting}
                className="border-gray-300 text-darker hover:bg-gray-100"
              >
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-light hover:bg-light/90 text-white"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => handleSubmit(new Event('click') as any)}
                  disabled={isSubmitting}
                  className="bg-light hover:bg-light/90 text-white"
                >
                  {isSubmitting ? "Posting..." : "Post Job Now"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}