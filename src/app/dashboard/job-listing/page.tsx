"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Search, Plus, Edit, Trash, Eye, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Job interface based on the schema
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: string;
  status: 'active' | 'closed' | 'draft';
  experienceLevel: string;
  applicationDeadline: string;
  createdAt: string;
  applicantCount: number;
}

export default function JobListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/job-listing");
    }
  }, [status, router]);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      // Only fetch if authenticated
      if (status !== "authenticated") return;
      
      try {
        setLoading(true);
        // Call the API endpoint with proper headers and credentials
        const response = await fetch('/api/job-listing', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        console.log('Job data received:', data);
        
        // Set jobs from API response
        if (data && data.jobs) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch job listings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [status]);

  // If loading authentication or not authenticated yet, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container px-4 mx-auto mt-20 py-10 text-center">
        <p className="text-white/70">
          {status === "loading" ? "Loading..." : "Please login to access this page"}
        </p>
      </div>
    );
  }

  // Filter jobs based on status and search query
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    setJobToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      // Call the correct delete endpoint
      const response = await fetch(`/api/job-listing?id=${jobToDelete}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      // Remove deleted job from state
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete));
      
      toast({
        title: "Success",
        description: "Job listing deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job listing.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Listings</h1>
          <p className="text-white/70">Manage your posted job opportunities</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/job-listing/post-job")} 
          className="bg-light hover:bg-light/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      <Card className="bg-white text-darker shadow-md rounded-lg overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Your Job Listings</CardTitle>
          <CardContent className="p-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white text-darker">
                  <SelectGroup>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </CardHeader>
        <Separator />
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading job listings...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "No jobs match your search criteria."
                : "You haven't posted any jobs yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden md:table-cell">Job Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Posted Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                    <TableHead className="text-center">Applicants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">
                        <div>{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
                        {job.jobType.replace('-', ' ')}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(job.createdAt)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(job.applicationDeadline)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{job.applicantCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            title="View Details"
                            onClick={() => router.push(`/dashboard/job-listing/${job._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            title="Edit Job"
                            onClick={() => router.push(`/dashboard/job-listing/post-job?id=${job._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Job"
                            onClick={() => handleDelete(job._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white text-darker">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job listing and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 text-darker mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
