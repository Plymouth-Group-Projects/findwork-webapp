'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchJobById } from '@/lib/api/jobs';
import { IJob } from '@/models/job';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SlArrowLeft, SlArrowRight, SlCalender, SlLocationPin, SlBriefcase, SlGraduation, SlClock, SlUser } from 'react-icons/sl';
import { FaBuilding, FaDollarSign, FaRegMoneyBillAlt } from 'react-icons/fa';
import Footer from '@/components/footer';

export default function JobDetailsPage(props: { params: Promise<{ jobId: string }> }) {
  const params = use(props.params);
  const { jobId } = params;
  const router = useRouter();

  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const response = await fetchJobById(jobId);
        if (response.success) {
          setJob(response.job);
        } else {
          setError(response.error || 'Failed to fetch job details');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format salary for display
  const formatSalary = (salary: { min?: number; max?: number; currency?: string }) => {
    if (!salary) return 'Salary not disclosed';
    const { min, max, currency = 'USD' } = salary;
    
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Salary not disclosed';
  };

  // Calculate days left until application deadline
  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  // Handle apply button click
  const handleApply = async () => {
    setApplyStatus('loading');
    
    try {
      // Here you would implement the actual application process
      // This could involve an API call to create an application record
      
      // For now we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplyStatus('success');
    } catch (err) {
      console.error('Error applying for job:', err);
      setApplyStatus('error');
    }
  };

  // Generate appropriate application method based on job data
  const getApplicationMethod = () => {
    if (!job) return null;
    
    if (job.applicationMethod === 'email' && job.applicationEmail) {
      return (
        <Button
          onClick={() => window.location.href = `mailto:${job.applicationEmail}?subject=Application for ${job.title}`}
          className="w-full bg-light hover:bg-lightest text-white hover:text-darker"
        >
          Apply via Email
        </Button>
      );
    } else if (job.applicationMethod === 'website' && job.applicationUrl) {
      return (
        <Button
          onClick={() => window.open(job.applicationUrl, '_blank')}
          className="w-full bg-light hover:bg-lightest hover:text-darker"
        >
          Apply on Website
        </Button>
      );
    } else if (job.applicationMethod === 'phone' && job.contactPhone) {
      return (
        <Button
          onClick={() => window.location.href = `tel:${job.contactPhone}`}
          className="w-full bg-light hover:bg-lightest hover:text-darker"
        >
          Call to Apply
        </Button>
      );
    } else {
      return (
        <Button
          onClick={handleApply}
          disabled={applyStatus === 'loading' || applyStatus === 'success'}
          className="w-full bg-light hover:bg-lightest hover:text-darker"
        >
          {applyStatus === 'loading' ? 'Applying...' : 
           applyStatus === 'success' ? 'Application Sent' : 'Apply Now'}
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen mt-[90px] pb-10">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/job-hub')}
            className="flex items-center bg-white/80 text-darker gap-2"
          >
            <SlArrowLeft size={14} />
            Back to Job Search
          </Button>
        </div>

        {loading ? (
          // Loading skeleton
          (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/4" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>)
        ) : error ? (
          // Error state
          (<Card className="bg-red-50 text-center p-8">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold text-red-600">Error Loading Job</h2>
                <p className="text-red-600">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4 border-red-200 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>)
        ) : job ? (
          // Job details content
          (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Job Details */}
            <div className="col-span-1 md:col-span-2">
              <Card className="shadow-sm bg-white text-darker">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <FaBuilding className="text-muted" />
                        <span>{job.company}</span>
                        <span className="text-muted">•</span>
                        <SlLocationPin className="text-muted" />
                        <span>{job.location}</span>
                      </CardDescription>
                    </div>
                    <Badge className="bg-light text-white hover:bg-light">
                      {job.jobType.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{job.description}</p>
                    </div>
                  </div>
                  
                  {/* Requirements */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{job.requirements}</p>
                    </div>
                  </div>
                  
                  {/* Responsibilities (if available) */}
                  {job.responsibilities && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Responsibilities</h3>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{job.responsibilities}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Benefits (if available) */}
                  {job.benefits && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{job.benefits}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Sidebar with Job Details and Apply Button */}
            <div className="col-span-1">
              <Card className="shadow-sm sticky bg-white text-darker top-24">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Job Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Salary */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <FaRegMoneyBillAlt className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Salary Range</p>
                        <p className="font-medium">
                          {formatSalary(job.salary)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <SlLocationPin className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Location</p>
                        <p className="font-medium">{job.location}</p>
                        {job.remoteOption && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {job.remoteOption}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Job Type */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <SlBriefcase className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Job Type</p>
                        <p className="font-medium">
                          {job.jobType.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Experience Level */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <SlGraduation className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Experience</p>
                        <p className="font-medium">
                          {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
                        </p>
                      </div>
                    </div>
                      {/* Application Deadline */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <SlCalender className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Application Deadline</p>
                        <p className="font-medium">
                          {formatDate(job.applicationDeadline.toString())}
                        </p>
                        {getDaysLeft(job.applicationDeadline.toString()) > 0 ? (
                          <p className="text-xs text-green-600">
                            {getDaysLeft(job.applicationDeadline.toString())} days left
                          </p>
                        ) : (
                          <p className="text-xs text-red-600">Deadline passed</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Current Applicant Count */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-light/10 p-2">
                        <SlUser className="text-light" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Applicants</p>
                        <p className="font-medium">{job.applicantCount} applicants</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Apply Button */}
                  <div className="mt-6">
                    {job.status === 'active' ? (
                      <>
                        {getApplicationMethod()}
                        
                        {applyStatus === 'success' && (
                          <p className="text-center text-sm text-green-600 mt-2">
                            Your application has been submitted successfully!
                          </p>
                        )}
                        
                        {applyStatus === 'error' && (
                          <p className="text-center text-sm text-red-600 mt-2">
                            There was an error submitting your application. Please try again.
                          </p>
                        )}
                      </>
                    ) : (
                      <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
                        This job is no longer accepting applications
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full text-center text-sm text-muted-foreground">
                    <p>Posted on {formatDate(job.createdAt.toString())}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>)
        ) : (
          // No job found
          (<Card className="text-center p-8">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold">Job Not Found</h2>
                <p>The job you're looking for doesn't exist or has been removed.</p>
                <Button
                  onClick={() => router.push('/job-hub')}
                  className="mt-4 bg-light hover:bg-lightest hover:text-darker"
                >
                  Browse Other Jobs
                </Button>
              </div>
            </CardContent>
          </Card>)
        )}
        
        {/* Related Jobs Section - This could be implemented later */}
        {job && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Similar Jobs</h2>
            <p className="text-muted-foreground">
              Similar jobs will be displayed here. Check back soon as we implement this feature!
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}