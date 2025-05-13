"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Building, 
  Users, 
  DollarSign, 
  Briefcase,
  ArrowLeft,
  AlertCircle,
  Globe,
  Award,
  Tag
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  industry: string;
  employerId: string;
  status: 'active' | 'closed' | 'draft';
  experienceLevel: 'entry' | 'intermediate' | 'expert' | 'senior';
  skills: string[];
  applicantCount: number;
  applicationDeadline: string;
  remoteOption?: 'onsite' | 'remote' | 'hybrid';
  applicationMethod?: 'email' | 'website' | 'phone';
  applicationEmail?: string;
  applicationUrl?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/job-listing");
    }
  }, [status, router]);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (status !== "authenticated") return;
      
      try {
        const response = await fetch(`/api/job-listing/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch job details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, status]);

  // If loading authentication or not authenticated yet, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container px-4 mx-auto mt-20 py-10 text-center">
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }

  // If loading job details, show loading state
  if (loading) {
    return (
      <div className="container px-4 mx-auto mt-20 py-10">
        <div className="bg-white text-darker shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  // If job not found, show error
  if (!job) {
    return (
      <div className="container px-4 mx-auto mt-20 py-10">
        <div className="bg-white text-darker shadow-md rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push("/dashboard/job-listing")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Listings
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Closed
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Clock className="h-3 w-3 mr-1" /> Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <div className="container px-4 mx-auto mt-20 py-10">
      <Button
        variant="ghost"
        className="mb-6 text-white hover:text-white/80"
        onClick={() => router.push("/dashboard/job-listing")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Listings
      </Button>

      <Card className="bg-white text-darker shadow-md rounded-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <div className="flex items-center mt-2 text-gray-600">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </div>
            </div>
            <div>
              {getStatusBadge(job.status)}
            </div>
          </div>
        </CardHeader>
        <Separator />

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium capitalize">{job.jobType.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Posted on</p>
                <p className="font-medium">{formatDate(job.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Application Deadline</p>
                <p className="font-medium">{formatDate(job.applicationDeadline)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Job Description</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </div>
              </div>              {job.responsibilities && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Responsibilities</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {job.responsibilities}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Requirements</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>

              {job.benefits && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Benefits</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {job.benefits}
                  </div>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        <Tag className="h-3 w-3 mr-1" /> {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Job Overview</CardTitle>
                </CardHeader>
                <CardContent>                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="text-gray-700">Salary</span>
                      </div>
                      <span className="font-medium">
                        {job.salary.min && job.salary.max ? 
                          `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}` : 
                          'Not specified'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="text-gray-700">Applicants</span>
                      </div>
                      <Badge variant="secondary">{job.applicantCount}</Badge>
                    </li>
                    {job.industry && (
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">Industry</span>
                        </div>
                        <span className="font-medium">{job.industry}</span>
                      </li>
                    )}
                    {job.experienceLevel && (
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">Experience</span>
                        </div>
                        <span className="font-medium capitalize">{job.experienceLevel}</span>
                      </li>
                    )}
                    {job.remoteOption && (
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="text-gray-700">Work Type</span>
                        </div>
                        <span className="font-medium capitalize">{job.remoteOption}</span>
                      </li>
                    )}
                  </ul>

                  <div className="mt-6">
                    <Button 
                      className="w-full bg-light hover:bg-light/90 text-white"
                      onClick={() => router.push(`/dashboard/job-listing/post-job?id=${job._id}`)}
                    >
                      Edit Job
                    </Button>
                  </div>

                  {job.applicationMethod && (
                    <div className="mt-6 border-t pt-6">
                      <h4 className="font-bold mb-3">Application Details</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-gray-700">Method: </span>
                          <span className="font-medium capitalize">{job.applicationMethod}</span>
                        </div>
                        {job.applicationEmail && (
                          <div>
                            <span className="text-gray-700">Email: </span>
                            <span className="font-medium">{job.applicationEmail}</span>
                          </div>
                        )}
                        {job.applicationUrl && (
                          <div>
                            <span className="text-gray-700">Website: </span>
                            <span className="font-medium">{job.applicationUrl}</span>
                          </div>
                        )}
                        {job.contactPhone && (
                          <div>
                            <span className="text-gray-700">Phone: </span>
                            <span className="font-medium">{job.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}