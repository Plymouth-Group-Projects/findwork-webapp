import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AppSidebar } from "@/components/workforcehub-sidebar";
import FreelancerCard from "@/components/shared/freelancer-card";

export default function WorkForceHub() {
  const freelancers = [
		{
			id: 0,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
		{
			id: 1,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Beginner",
		},
		{
			id: 2,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
		{
			id: 3,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Expert",
		},
		{
			id: 4,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Verified",
		},
		{
			id: 5,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
	];

  return (
    <div className="min-h-screen mt-[60px] md:mt-[90px] grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4">
      {/* Desktop Sidebar - hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block lg:col-span-1 h-screen sticky top-0">
        <AppSidebar/>
      </div>
      
      {/* Main Content - adjusts based on screen size */}
      <div className="container mx-auto col-span-1 md:col-span-12 lg:col-span-3 px-4 md:px-6">
        <main className="pt-16 md:pt-10 md:pe-6 lg:pe-10">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted-foreground" />
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

          {/* Recommended Employees */}
          <h2 className="text-2xl font-semibold mb-4">Recommended Employees</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="lg:w-full">
                <FreelancerCard
                  freelancer={freelancer}
                  isActive
                  index={freelancer.id}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
