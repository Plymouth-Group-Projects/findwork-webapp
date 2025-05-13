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
import { Eye, Trash2, Edit, Calendar, FileText } from "lucide-react";

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
    isHiredCollaboration?: boolean;
    projectTitle?: string;
    projectDescription?: string;
    currentStatus?: string;
    hiredDate?: string;
    paymentAmount?: number;
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
  // Determine if this is a hired collaboration
  const isHired = collaboration.isHiredCollaboration;
  
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
          alt={isHired ? (collaboration.projectTitle || "Hired Collaboration") : collaboration.Name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill={true}
          className="object-cover object-center"
          priority={true}
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="font-lato">
          <span className="text-xl font-semibold uppercase">
            {isHired ? (collaboration.projectTitle || "Hired Collaboration") : collaboration.Name}
          </span>
          
          {isHired ? (
            // Hired collaboration status
            <span className={`text-sm absolute right-0 top-3 
              ${
                collaboration.currentStatus === 'active' ? 'bg-green-500' : 
                collaboration.currentStatus === 'on-hold' ? 'bg-amber-500' : 
                collaboration.currentStatus === 'terminated' ? 'bg-red-500' :
                'bg-blue-500'
              } text-white pe-5 ps-3 py-0.5 rounded-s-md`}>
              {collaboration.currentStatus 
                ? (collaboration.currentStatus.charAt(0).toUpperCase() + collaboration.currentStatus.slice(1))
                : "Active"}
            </span>
          ) : (
            // Regular collaboration availability
            <span className="text-sm absolute right-0 top-3 bg-lightest pe-5 ps-3 py-0.5 rounded-s-md">
              {collaboration.availability}
            </span>
          )}
          
          {!isHired && (
            // Only show level badge for regular collaborations
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
          )}
          
          <p className="text-xs font-normal">
            {isHired 
              ? (collaboration.hiredDate ? `Hired: ${new Date(collaboration.hiredDate).toLocaleDateString()}` : "Recently Hired")
              : collaboration.address
            }
          </p>
        </CardTitle>
        
        <CardDescription>
          {isHired ? (
            // Hired collaboration content
            <>
              <h2 className="text-base font-semibold mt-3">
                Project Details
              </h2>
              <p className="mt-1 text-sm line-clamp-3">
                {collaboration.projectDescription || "No project description provided"}
              </p>
              <p className="text-sm font-semibold mt-4">
                ${collaboration.paymentAmount || 0}
              </p>
            </>
          ) : (
            // Regular collaboration content
            <>
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
            </>
          )}
        </CardDescription>
          <div className="absolute bottom-5 left-5 right-5 flex space-x-2">
          {/* Show appropriate preview button based on collaboration type */}
          <Button
            onClick={onPreview}
            className={`
              ${isHired ? 'flex-1' : 'flex-1'} font-medium bg-light text-white hover:bg-lightest hover:text-darker
              py-2 shadow-sm transform group transition-all duration-300 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            {isHired ? (
              <>
                <FileText className="mr-1 h-4 w-4" />
                <span>Details</span>
              </>
            ) : (
              <>
                <Eye className="mr-1 h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
          
          {/* Only show edit and delete buttons for regular collaborations */}
          {!isHired && (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}