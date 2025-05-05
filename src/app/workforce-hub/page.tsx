"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WorkforceSidebar } from "@/components/workforcehub-sidebar";
import FreelancerCard from "@/components/shared/freelancer-card";
import Footer from "@/components/footer";
import { IWorkerProfile } from "@/models/freelance-collab";

export default function WorkForceHub() {
  const [profiles, setProfiles] = useState<IWorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);
  const [minRate, setMinRate] = useState<number | null>(null);
  const [maxRate, setMaxRate] = useState<number | null>(null);
  const [rateType, setRateType] = useState<string | null>(null);
  const [workTypes, setWorkTypes] = useState<string[] | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    pages: 1
  });

  // Available categories and skills for filtering
  const categories = ["Construction", "Home Services", "Personal Care", "Transportation", "Electrical"];
  const skills = ["Plumbing", "Electrical", "Painting", "Carpentry", "Masonry", "Cleaning", "Driving"];
  const levels = ["Beginner", "Intermediate", "Expert", "Verified"];

  // Fetch worker profiles
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (searchQuery) queryParams.append("search", searchQuery);
      if (category) queryParams.append("category", category);
      if (skill) queryParams.append("skill", skill);
      if (level) queryParams.append("level", level);
      if (location) queryParams.append("location", location);
      if (availability) queryParams.append("availability", availability);
      if (minRate) queryParams.append("minRate", minRate.toString());
      if (maxRate) queryParams.append("maxRate", maxRate.toString());
      if (rateType) queryParams.append("rateType", rateType);
      if (workTypes && workTypes.length > 0) {
        workTypes.forEach(type => queryParams.append("workType", type));
      }
      
      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/workforce-hub?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProfiles(data.profiles);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch profiles:", data.error);
        // Fallback to empty array
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
    fetchProfiles();
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle sidebar filter changes
  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);
    
    // Update all filter states
    setCategory(filters.category);
    setLocation(filters.location);
    setAvailability(filters.availability);
    setMinRate(filters.minRate);
    setMaxRate(filters.maxRate);
    setRateType(filters.rateType);
    setWorkTypes(filters.workTypes);
    setLevel(filters.level);
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Fetch profiles with new filters
    fetchProfiles();
  };

  // Handle quick filter changes in the top section
  const handleQuickFilterChange = (filterType: string, value: string | null) => {
    switch (filterType) {
      case 'category':
        setCategory(value);
        break;
      case 'skill':
        setSkill(value);
        break;
      case 'level':
        setLevel(value);
        break;
      default:
        break;
    }

    // Reset page to 1 on filter change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Clear all filters from the quick filter section
  const clearQuickFilters = () => {
    setSearchQuery("");
    setCategory(null);
    setSkill(null);
    setLevel(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Load profiles on initial render and when filters or pagination change
  useEffect(() => {
    fetchProfiles();
  }, [pagination.page]); // Only auto-refresh when page changes (not on filter changes)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow mt-[60px] md:mt-[90px] grid grid-cols-1 md:grid-cols-9 xl:grid-cols-4">
        {/* Desktop Sidebar - hidden on mobile, visible on larger screens */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-1 sticky top-0 h-fit max-h-screen overflow-y-auto">
          <WorkforceSidebar 
            onFilterChange={handleFilterChange} 
            initialFilters={{
              category,
              location,
              availability,
              minRate,
              maxRate,
              rateType,
              workTypes,
              level
            }}
          />
        </div>
        
        {/* Main Content and Footer Container - takes remaining width */}
        <div className="flex flex-col col-span-1 md:col-span-10 lg:col-span-6 xl:col-span-3">
          {/* Main Content */}
          <div className="container mx-auto">
            <main className="py-24 mx-4 sm:mx-0 md:py-16 lg:py-10 md:px-6 xl:px-0 xl:pe-6">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <FaSearch className="text-muted" />
                  </div>
                  <Input 
                    placeholder="Job Title or Keyword" 
                    className="w-full pl-10 pr-24 py-2 border-0 focus:ring-2 focus:ring-lightest bg-lightest/40 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button type="submit" className="bg-light hover:bg-lightest hover:text-darker flex items-center justify-center px-4 rounded-s-none">
                      <FaSearch className="mr-1" /> Search
                    </Button>
                  </div>
                </div>
              </form>

              {/* Quick Filter Options (only shown on mobile and tablets, hidden on desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 lg:hidden">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select 
                    value={category || "all_categories"} 
                    onValueChange={(value) => handleQuickFilterChange('category', value === "all_categories" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_categories">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skill</label>
                  <Select 
                    value={skill || "all_skills"} 
                    onValueChange={(value) => handleQuickFilterChange('skill', value === "all_skills" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_skills">All Skills</SelectItem>
                      {skills.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Experience Level</label>
                  <Select 
                    value={level || "all_levels"} 
                    onValueChange={(value) => handleQuickFilterChange('level', value === "all_levels" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_levels">All Levels</SelectItem>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mb-6 lg:hidden">
                <Button
                  onClick={clearQuickFilters}
                  variant="outline"
                  className="mr-2"
                >
                  Clear Filters
                </Button>
                
                <Button 
                  onClick={() => fetchProfiles()}
                  className="bg-light hover:bg-lightest hover:text-darker"
                >
                  Apply Filters
                </Button>
              </div>

              {/* Current Filter Tags - only show if filters are active */}
              {(category || skill || level || location || availability || workTypes) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="text-sm font-medium mr-2 my-auto">Active filters:</div>
                  {category && (
                    <div className="bg-light/20 text-darker text-xs py-1 px-3 rounded-full flex items-center">
                      Category: {category}
                      <Button 
                        variant="ghost" 
                        className="h-4 w-4 p-0 ml-1 text-xs hover:bg-transparent hover:text-red-500"
                        onClick={() => handleQuickFilterChange('category', null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {skill && (
                    <div className="bg-light/20 text-darker text-xs py-1 px-3 rounded-full flex items-center">
                      Skill: {skill}
                      <Button 
                        variant="ghost" 
                        className="h-4 w-4 p-0 ml-1 text-xs hover:bg-transparent hover:text-red-500"
                        onClick={() => handleQuickFilterChange('skill', null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {level && (
                    <div className="bg-light/20 text-darker text-xs py-1 px-3 rounded-full flex items-center">
                      Level: {level}
                      <Button 
                        variant="ghost" 
                        className="h-4 w-4 p-0 ml-1 text-xs hover:bg-transparent hover:text-red-500"
                        onClick={() => handleQuickFilterChange('level', null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {/* More filter tags would go here */}
                </div>
              )}

              {/* Recommended Employees */}
              <h2 className="text-2xl font-semibold mb-4">
                {searchQuery || category || skill || level || location || availability || workTypes ? 
                 "SEARCH RESULTS" : "RECOMMENDED FREELANCERS"}
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light"></div>
                </div>
              ) : profiles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {profiles.map((profile, index) => {
                      const freelancer = {
                        id: index,
                        imageUrl: profile.thumbnail || "./plumber.svg",
                        Name: profile.name,
                        availability: profile.availability,
                        topSkills: profile.topSkills,
                        address: profile.contact.address,
                        salary: profile.salary,
                        jobsCompleted: profile.jobsCompleted.toString(),
                        level: profile.level,
                        _id: profile._id?.toString(), // Pass the MongoDB _id for navigation
                      };

                      return (
                        <div key={profile._id?.toString() || index} className="">
                          <FreelancerCard
                            freelancer={freelancer}
                            isActive
                            index={index}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          disabled={pagination.page === 1}
                        >
                          Previous
                        </Button>
                        
                        {Array.from({ length: pagination.pages }).map((_, i) => (
                          <Button
                            key={i}
                            variant={pagination.page === i + 1 ? "default" : "outline"}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                          disabled={pagination.page === pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium mb-2">No freelancers found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria to find more results.
                  </p>
                </div>
              )}
            </main>
          </div>
          <div className="ms-[-30px]">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
