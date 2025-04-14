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

interface FreelancerCardProps {
  freelancer: {
    id: number;
    imageUrl: string;
    Name: string;
    availability: string;
    topSkills: string[];
    address: string;
    salary: string;
    jobsCompleted: string;
    level: string;
  };
  isActive: boolean;
  index: number;
}

export default function FreelancerCard({ freelancer, isActive, index }: FreelancerCardProps) {
  return (
    <Card
      className={`
      h-[500px] bg-white border-none text-darker
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
          src={freelancer.imageUrl}
          alt={freelancer.Name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill={true}
          className="object-cover object-center"
          priority={true}
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="font-lato">
          <span className="text-xl font-semibold uppercase">
            {freelancer.Name}
          </span>
          <span className="text-sm absolute right-0 top-3 bg-lightest pe-5 ps-3 py-0.5 rounded-s-md">
            {freelancer.availability}
          </span>
          <span
            className={`text-xs rounded-lg font-base px-3 py-[3px] absolute right-3 mt-1 tracking-wide  
              ${
                freelancer.level === "Intermediate"
                  ? "bg-lightest text-white"
                  : freelancer.level === "Beginner"
                    ? "bg-slate-300"
                    : freelancer.level === "Expert"
                      ? "bg-darker text-white"
                      : freelancer.level === "Verified"
                        ? "bg-darkest px-5 py-1 text-yellow-400 outline outline-1"
                        : ""
              }`}
          >
            {freelancer.level}
          </span>
          <p className="text-xs font-normal">
            {freelancer.address}
          </p>
        </CardTitle>
        <CardDescription>
          <h2 className="text-base font-semibold mt-3">
            Top Skills
          </h2>
          <ul className="grid grid-cols-3 mt-1 ms-1">
            {freelancer.topSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <p className="text-sm font-semibold mt-4">
            {freelancer.salary}
          </p>
          <p className="text-xs">
            {freelancer.jobsCompleted} Jobs Completed.
          </p>
        </CardDescription>
        <a href="#">
          <Button
            className={`absolute bottom-5 font-medium bg-lightest hover:bg-light hover:text-white
            ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            Hire Now
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
