'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

export function BusinessSidebar() {
  // Using null as initial state to detect client-side rendering
  const [isMounted, setIsMounted] = useState(false)
  
  // State for business filters
  const [businessCategory, setBusinessCategory] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [verifiedBusiness, setVerifiedBusiness] = useState<boolean>(false)
  const [activeJobsNow, setActiveJobsNow] = useState<boolean>(false)
  const [businessSize, setBusinessSize] = useState<string>('')

  // Sample locations data
  const locations = [
    { value: "colombo", label: "Colombo" },
    { value: "kandy", label: "Kandy" },
    { value: "galle", label: "Galle" },
    { value: "negombo", label: "Negombo" },
    { value: "jaffna", label: "Jaffna" },
    { value: "dehiwala", label: "Dehiwala" },
    { value: "moratuwa", label: "Moratuwa" },
    { value: "batticaloa", label: "Batticaloa" },
  ]

  // Business categories
  const businessCategories = [
    "Construction", 
    "Cleaning", 
    "Catering", 
    "Hospitality", 
    "Maintenance", 
    "Transportation", 
    "Security", 
    "Agriculture"
  ]

  // Only render on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const clearAll = () => {
    setBusinessCategory('')
    setLocation('')
    setVerifiedBusiness(false)
    setActiveJobsNow(false)
    setBusinessSize('')
  }

  // If not mounted (server render), return a simpler version or loading state
  if (!isMounted) {
    return (
      <Sidebar collapsible="icon" variant="sidebar" className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
        <SidebarContent className="pt-[95px] px-[15px] sm:px-[20px] md:px-[25px] lg:px-[30px]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-darker text-sm tracking-wider">Filter</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4">Loading filters...</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <>
    <Sidebar 
      className={`w-full transition-all duration-300 ${window.innerWidth > 1900 ? "w-[450px]" : window.innerWidth > 1024 ? "w-[400px]" : "w-[340px]"}`}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarContent className="pt-[90px] px-[15px] sm:px-[20px] text-darker">
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel className="text-darker text-base tracking-wider">Filters</SidebarGroupLabel>
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-darker/70 hover:text-darker">
              Clear All
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[state=collapsed]:hidden">
              
              {/* Business Category Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Business Category</h3>
                  <Select value={businessCategory} onValueChange={setBusinessCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business category" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>
              
              {/* Location Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Location</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full text-darker justify-between"
                      >
                        {location
                          ? locations.find((loc) => loc.value === location)?.label || location
                          : "Select location..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full text-darker bg-white p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {locations.map((loc) => (
                              <CommandItem
                                key={loc.value}
                                value={loc.value}
                                onSelect={(currentValue) => {
                                  setLocation(currentValue === location ? "" : currentValue)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 shadow-sm border-t h-4 w-4",
                                    location === loc.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {loc.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </SidebarMenuItem>
              
              {/* Verified Business Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Verified Business</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="verified-business" 
                      checked={verifiedBusiness}
                      onCheckedChange={setVerifiedBusiness}
                    />
                    <Label htmlFor="verified-business">
                      {verifiedBusiness ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Active Jobs Now Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Active Jobs Now</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active-jobs" 
                      checked={activeJobsNow}
                      onCheckedChange={setActiveJobsNow}
                    />
                    <Label htmlFor="active-jobs">
                      {activeJobsNow ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Business Size Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Business Size</h3>
                  <Select value={businessSize} onValueChange={setBusinessSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business size" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Button className="w-full my-6 bg-light text-white hover:bg-lightest hover:text-darker" variant="default">
                  Apply Filters
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    </>
  )
}
