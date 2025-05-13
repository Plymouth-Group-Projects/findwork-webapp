'use client';

import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobHubSidebar } from "@/components/jobhub-sidebar";
import JobCard from "@/components/shared/job-card";
import Footer from "@/components/footer";
import { fetchJobs } from "@/lib/api/jobs";
import { IJob } from "@/models/job";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format job data for JobCard component
const formatJobForCard = (job: IJob) => {
  const getJobType = (type: string) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified';
    if (!salary.min && !salary.max) return 'Salary not specified';
    
    if (salary.min && salary.max) {
      return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    } else if (salary.min) {
      return `${salary.currency} ${salary.min.toLocaleString()}+`;
    } else {
      return `Up to ${salary.currency} ${salary.max.toLocaleString()}`;
    }
  };
  return {
    id: job._id ? job._id.toString() : '',
    imageUrl: `/electrician.svg`, // Default image - can be improved by having job category images
    title: job.title,
    employementType: getJobType(job.jobType),
    company: job.company,
    location: job.location,
    description: job.description.substring(0, 150) + (job.description.length > 150 ? '...' : ''),
    salary: formatSalary(job.salary),
    deadline: job.applicationDeadline.toString(),
    receivedApplications: job.applicantCount.toString(),
  };
};

export default function JobHub() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  // Load jobs
  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobs({ page: currentPage.toString() });
        if (response.success) {
          setJobs(response.jobs as IJob[]);
          setTotalPages(response.pagination.pages);
          if (response.jobs.length > 0 && response.jobs[0]._id) {
            setActiveJobId(response.jobs[0]._id.toString());
          }
        } else {
          setError(response.error || 'Failed to fetch jobs');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [currentPage]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredJobs);
  }, [searchTerm, jobs]);
  // Determine which jobs to display
  const displayJobs: IJob[] = searchTerm.trim() !== '' ? searchResults : jobs;
  return (
    <div className="min-h-screen mt-[60px] md:mt-[90px] grid grid-cols-1 md:grid-cols-9 xl:grid-cols-4">
      {/* Desktop Sidebar - hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-1 h-screen sticky top-0">
        <JobHubSidebar />
      </div>
        {/* Main Content - adjusts based on screen size */}
      <div className="container mx-auto col-span-1 md:col-span-9 lg:col-span-6 xl:col-span-3">
        <main className="py-24 mx-4 sm:mx-0 md:py-16 lg:py-10 md:px-6 xl:px-0 xl:pe-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted" />
              </div>
              <Input 
                placeholder="Job Title or Keyword" 
                className="w-full pl-10 pr-24 py-2 border-0 focus:ring-2 focus:ring-lightest bg-lightest/40 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  className="bg-light hover:bg-lightest hover:text-darker flex items-center justify-center px-4 rounded-s-none"
                  onClick={() => setSearchTerm(searchTerm)} // Trigger search again
                >
                  <FaSearch className="mr-1" /> Search
                </Button>
              </div>
            </div>
          </div>          {/* Available Job Opportunities */}
          <h2 className="text-2xl font-semibold mb-4">
            {searchTerm ? 'SEARCH RESULTS' : 'RECOMMENDED JOBS'}
            {searchTerm && ` (${displayJobs.length})`}
          </h2>
            {loading ? (
            // Loading skeletons
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] bg-white rounded-xl">
                  <div className="h-full grid grid-cols-6">
                    <div className="col-span-2 rounded-s-xl relative h-full">
                      <Skeleton className="h-full w-full rounded-s-xl" />
                    </div>
                    <div className="col-span-4 p-6">
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-20 w-full mb-6" />
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
              <p className="text-red-600 mb-4">Failed to load jobs: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="border-red-200 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : displayJobs.length === 0 ? (
            // Empty state
            <div className="bg-lightest/10 p-12 rounded-lg text-center">
              <p className="text-darker/70 text-lg mb-4">
                {searchTerm ? 'No jobs match your search criteria' : 'No jobs available at this time'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            // Jobs list
            <>              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {displayJobs.map((job: IJob) => {
                  const jobId = job._id ? job._id.toString() : '';
                  return (
                    <div key={jobId} className="">
                      <JobCard
                        opportunity={formatJobForCard(job)}
                        isActive={jobId === activeJobId}
                        onClick={() => window.location.href = `/job-hub/${jobId}`}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination - only show if not searching and have multiple pages */}
              {!searchTerm && totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis if needed */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Previous page if not on first page */}
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        >
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Next page if not on last page */}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        >
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis if needed */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </main>
        <div className="mt-20 ms-[-50px]">
            <Footer />
        </div>
      </div>
    </div>
  );
}
