'use client';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BusinessSidebar } from '@/components/businesshub-sidebar';
import BusinessCard from '@/components/shared/business-card';
import Footer from '@/components/footer';

export default function BusinessHub() {
  const [activeIndex, setActiveIndex] = useState(0);

  const companies = [
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
    {
      id: 0,
      coverImage: "./cover-caregiver.svg",
      profileImage: "./profile-caregiver.svg",
      companyName: "iCAREGIVER",
      location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
      category: "Personal Care",
      description:
        "iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
      availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
      verification: "Verified",
    },
  ];

  return (
    <div className="min-h-screen mt-[60px] md:mt-[90px] grid grid-cols-1 md:grid-cols-9 xl:grid-cols-4">
      {/* Desktop Sidebar - hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-1 h-screen sticky top-0">
        <BusinessSidebar />
      </div>
      
      {/* Main Content - adjusts based on screen size */}
      <div className="container mx-auto col-span-1 md:col-span-10 lg:col-span-6 xl:col-span-3">
        <main className="py-24 mx-4 sm:mx-0 md:py-16 lg:py-10 md:px-6 xl:px-0 xl:pe-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted" />
              </div>
              <Input 
                placeholder="Company Name or Service" 
                className="w-full pl-10 pr-24 py-2 border-0 focus:ring-2 focus:ring-lightest bg-lightest/40 shadow-sm" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button className="bg-light hover:bg-lightest hover:text-darker flex items-center justify-center px-4 rounded-s-none">
                  <FaSearch className="mr-1" /> Search
                </Button>
              </div>
            </div>
          </div>

          {/* Recommended Businesses */}
          <h2 className="text-2xl font-semibold mb-4">RECOMMENDED BUSINESSES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((company, index) => (
                <div key={index} className="">
                <BusinessCard
                  company={company}
                  isActive
                  index={index}
                />
                </div>
            ))}
          </div>
        </main>
        <div className="ms-[-30px]">
          <Footer />
        </div>
      </div>
    </div>
  );
}
