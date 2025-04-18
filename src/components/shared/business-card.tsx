import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlArrowRight } from "react-icons/sl";

interface Company {
  coverImage: string;
  profileImage: string;
  companyName: string;
  location: string;
  description: string;
  availableServices: string[];
  verification: string;
}

interface BusinessCardProps {
  company: Company;
  isActive: boolean;
  index: number;
}

export default function BusinessCard({ company, isActive, index}: BusinessCardProps) {
  return (
    <Card
      className={`
      h-[680px] sm:h-[620px] bg-white border-none text-darker
      transition-all duration-300 ease-in-out
      ${
        isActive
          ? "scale-100 opacity-100"
          : "scale-90 opacity-50 blur-[2px]"
      }
      `}
    >
      <CardHeader className="p-0 relative h-[250px] overflow-hidden rounded-t-lg mb-3">
        <Image
          src={company.coverImage}
          alt={company.companyName}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill={true}
          className="object-cover object-center"
          priority={true}
        />
      </CardHeader>
      <div className="absolute top-48 left-8 z-10">
        <div className="h-28 w-28 rounded-full border-2 bg-white border-white shadow-md overflow-hidden">
          <Image
            src={company.profileImage}
            alt={company.companyName}
            width={1000}
            height={1000}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
      <CardContent className="pt-14 px-8">
        <CardTitle className="font-lato">
          <span className="text-xl font-semibold uppercase">
            {company.companyName}
          </span>
          {company.verification === "Verified" && (
            <span className="text-light text-xs font-semibold ml-5 bg-lightest/20 px-3 py-[3px] rounded-xl">
              {company.verification}
            </span>
          )}
          <p className="text-xs font-normal mt-2">
            {company.location}
          </p>
        </CardTitle>
        <CardDescription>
          <p className="text-sm font-normal mt-2">
            {company.description}
          </p>
          <h2 className="text-base font-semibold mt-4">
            Our Services
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 mt-2 gap-3">
            {company.availableServices.map((services, index) => (
              <li key={index} className="border-light border-[1px] rounded-2xl px-2 py-1 text-center text-sm bg-lightest/25">{services}</li>
            ))}
          </ul>
        </CardDescription>
        <a href="#">
          <Button
            className={`
              absolute bottom-5 left-8 right-8 font-medium 
              bg-light text-white hover:bg-lightest hover:text-darker
              py-2.5 shadow-sm transform group
              transition-all duration-300 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">Learn More</span>
            <SlArrowRight 
              className="ml-2 my-auto transition-transform duration-300 group-hover:translate-x-1" 
              size={14} 
            />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
