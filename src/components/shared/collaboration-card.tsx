"use client"

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
import { Eye, Trash2, Edit } from "lucide-react";

interface CollaborationCardProps {
  collaboration: {
    id: string | number;
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
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CollaborationCard({ 
  collaboration, 
  isActive, 
  index,
  onPreview,
  onEdit,
  onDelete
}: CollaborationCardProps) {
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
          src={collaboration.imageUrl}
          alt={collaboration.Name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill={true}
          className="object-cover object-center"
          priority={true}
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="font-lato">
          <span className="text-xl font-semibold uppercase">
            {collaboration.Name}
          </span>
          <span className="text-sm absolute right-0 top-3 bg-lightest pe-5 ps-3 py-0.5 rounded-s-md">
            {collaboration.availability}
          </span>
          <span
            className={`text-xs rounded-lg font-base px-3 py-[3px] absolute right-3 mt-1 tracking-wide  
              ${
                collaboration.level === "Intermediate"
                  ? "bg-lightest text-white"
                  : collaboration.level === "Beginner"
                    ? "bg-slate-300"
                    : collaboration.level === "Expert"
                      ? "bg-darker text-white"
                      : collaboration.level === "Verified"
                        ? "bg-darkest px-5 py-1 text-yellow-400 outline outline-1"
                        : ""
              }`}
          >
            {collaboration.level}
          </span>
          <p className="text-xs font-normal">
            {collaboration.address}
          </p>
        </CardTitle>
        <CardDescription>
          <h2 className="text-base font-semibold mt-3">
            Top Skills
          </h2>
          <ul className="grid grid-cols-3 mt-1 gap-4 ms-1">
            {collaboration.topSkills.map((skill, index) => (
              <li key={index} className="border-light border-[1px] rounded-2xl px-1 py-1 text-center text-sm bg-lightest/25">{skill}</li>
            ))}
          </ul>
          <p className="text-sm font-semibold mt-4">
            LKR {collaboration.salary}
          </p>
          <p className="text-xs">
            {collaboration.jobsCompleted} Jobs Completed.
          </p>
        </CardDescription>
        <div className="absolute bottom-5 left-5 right-5 flex space-x-2">
          <Button
            onClick={onPreview}
            className={`
              flex-1 font-medium bg-light text-white hover:bg-lightest hover:text-darker
              py-2 shadow-sm transform group transition-all duration-300 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            <Eye className="mr-1 h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Button
            onClick={onEdit}
            className={`
              flex-1 font-medium bg-light text-white hover:bg-lightest hover:text-darker
              py-2 shadow-sm transform group transition-all duration-300 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            <Edit className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            onClick={onDelete}
            variant="destructive"
            className={`
              flex-1 font-medium py-2 shadow-sm transform group
              transition-all duration-300 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}