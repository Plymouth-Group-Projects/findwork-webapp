import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobHubSidebar } from "@/components/jobhub-sidebar";
import JobCard from "@/components/shared/job-card";

export default function JobHub() {
  const jobOppurtunities = [
    {
      id: 0,
      imageUrl: "./electrician.svg",
      title: "Electrician",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
    {
      id: 1,
      imageUrl: "./electrician.svg",
      title: "Job Title",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
    {
      id: 2,
      imageUrl: "./electrician.svg",
      title: "Job Title",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
    {
      id: 3,
      imageUrl: "./electrician.svg",
      title: "Job Title",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
    {
      id: 4,
      imageUrl: "./electrician.svg",
      title: "Job Title",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
    {
      id: 5,
      imageUrl: "./electrician.svg",
      title: "Job Title",
      employementType: "Full Time",
      company: "DSN Constructions (Pvt) Ltd",
      location: "No: 123, Colombo Road, Colombo 07",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
      salary: "Rs.35,000/Month",
      deadline: "2025-03-10",
      receivedApplications: "100",
    },
  ];

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
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button className="bg-light hover:bg-lightest hover:text-darker flex items-center justify-center px-4 rounded-s-none">
                  <FaSearch className="mr-1" /> Search
                </Button>
              </div>
            </div>
          </div>

          {/* Available Job Opportunities */}
          <h2 className="text-2xl font-semibold mb-4">RECOMMEDNED JOBS</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {jobOppurtunities.map((opportunity) => (
              <div key={opportunity.id} className="">
                <JobCard
                  opportunity={opportunity}
                  isActive={true}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
