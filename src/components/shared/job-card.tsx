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

interface JobOpportunity {
  id: string | number;
  imageUrl: string;
  title: string;
  employementType: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  deadline: string;
  receivedApplications: string;
}

interface JobCardProps {
  opportunity: JobOpportunity;
  isActive: boolean;
  onClick?: () => void;
}

const getDaysLeft = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysLeft;
};

export default function JobCard({ opportunity, isActive, onClick }: JobCardProps) {
  return (
    <Card
      className={`
        h-[400px] bg-white border-none text-darker
        transition-all duration-300 ease-in-out grid grid-cols-6
        cursor-pointer
        ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-50 blur-[2px]"}
      `}
      onClick={onClick}
    >
      <div className="col-span-2 rounded-s-xl relative h-full">
        <Image
          src={opportunity.imageUrl}
          alt={opportunity.title}
          sizes="100vw, 33vw"
          fill={true}
          className="object-cover object-center rounded-s-xl"
          priority={true}
        />
      </div>
      <div className="col-span-4">
        <CardHeader>
          <CardTitle className="font-lato">
            <span className="text-xl font-semibold uppercase">
              {opportunity.title}
            </span>
            <p className="text-xs font-normal">
              {opportunity.employementType} |{" "}
              {opportunity.receivedApplications}
              <sup>+</sup> Applicants
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <p className="text-base">{opportunity.company}</p>
            <p className="text-xs ">{opportunity.location}</p>
            <p className="text-sm mt-5">
              {opportunity.description}
            </p>
            <p className="text-sm font-semibold mt-5">
              {opportunity.salary}
            </p>
            <p className="text-xs">
              {getDaysLeft(opportunity.deadline) > 0
                ? `${getDaysLeft(opportunity.deadline)} days left`
                : "Deadline passed"}
            </p>
          </CardDescription>          <Button
            className={`absolute bottom-5 font-medium bg-light text-white hover:bg-lightest hover:text-darker
              transition-all duration-300 group px-6
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card click event from firing
              if (onClick) onClick();
            }}
          >
            <span className="my-auto transition-transform group-hover:translate-x-1 duration-300">Apply Now</span>
            <SlArrowRight 
              className="ml-2 mt-[2px] transition-transform duration-300 group-hover:translate-x-1" 
              size={8} 
            />
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
