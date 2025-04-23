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
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

export function JobHubSidebar() {
  // Using null as initial state to detect client-side rendering
  const [isMounted, setIsMounted] = useState(false)
  const [jobCategory, setJobCategory] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [salaryRange, setSalaryRange] = useState<[number, number]>([20000, 150000])
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [genderPreference, setGenderPreference] = useState<string>('')
  const [preferredExperience, setPreferredExperience] = useState<string>('')
  const [languageRequirements, setLanguageRequirements] = useState<string[]>([])
  const [postedDate, setPostedDate] = useState<string>('')

  // Sample locations data
  const locations = [
    { value: "colombo", label: "Colombo" },
    { value: "gampaha", label: "Gampaha" },
    { value: "matara", label: "Matara" },
    { value: "kandy", label: "Kandy" },
    { value: "galle", label: "Galle" },
    { value: "kurunegala", label: "Kurunegala" },
    { value: "anuradhapura", label: "Anuradhapura" },
    { value: "jaffna", label: "Jaffna" },
  ]

  // Only render on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleValue = (value: string, list: string[], setList: Dispatch<SetStateAction<string[]>>) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value))
    } else {
      setList([...list, value])
    }
  }

  const clearAll = () => {
    setJobCategory('')
    setLocation('')
    setSalaryRange([20000, 150000])
    setJobTypes([])
    setGenderPreference('')
    setPreferredExperience('')
    setLanguageRequirements([])
    setPostedDate('')
  }

  // If not mounted (server render), return a simpler version or loading state
  if (!isMounted) {
    return (
      <Sidebar 
      collapsible="icon"
      variant="sidebar" 
      className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
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
      collapsible={`${window.innerWidth < 1024 ? "icon" : "none"}`}
      variant="sidebar"
    >
      <SidebarContent className="pt-[40px] px-[15px] sm:px-[20px] text-darker">
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel className="text-darker text-base tracking-wider">Filters</SidebarGroupLabel>
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-darker/70 hover:text-darker">
              Clear All
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[state=collapsed]:hidden">
              
              {/* Job Category Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Job Category</h3>
                  <Select value={jobCategory} onValueChange={setJobCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job category" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      {["Cleaner", "Plumber", "Electrician", "Carpenter", "Painter", "Driver", "Gardener", "Security Guard"].map((category) => (
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
              
              {/* Salary Range Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Salary Range</h3>
                  <div className="flex justify-between mb-2">
                    <span>Rs. {salaryRange[0]}</span>
                    <span>Rs. {salaryRange[1]}</span>
                  </div>
                  <Slider
                    min={20000}
                    max={150000}
                    step={500}
                    value={salaryRange}
                    onValueChange={(value) => setSalaryRange(value as [number, number])}
                  />
                </div>
              </SidebarMenuItem>
              
              {/* Job Type Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Job Type</h3>
                  <div className="space-y-4">
                    {["Full-time", "Part-time", "Daily", "Contract"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`job-type-${type}`}
                          checked={jobTypes.includes(type)} 
                          onCheckedChange={() => toggleValue(type, jobTypes, setJobTypes)}
                        />
                        <Label htmlFor={`job-type-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Gender Preference Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Gender Preference</h3>
                  <RadioGroup 
                    value={genderPreference} 
                    onValueChange={setGenderPreference}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any">Any</Label>
                    </div>
                  </RadioGroup>
                </div>
              </SidebarMenuItem>
              
              {/* Preferred Experience Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Preferred Experience</h3>
                  <Select value={preferredExperience} onValueChange={setPreferredExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      <SelectItem value="0-1">0–1 year</SelectItem>
                      <SelectItem value="2-3">2–3 years</SelectItem>
                      <SelectItem value="4+">4+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>
              
              {/* Language Requirements Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Language Requirements</h3>
                  <div className="space-y-4">
                    {["Sinhala", "Tamil", "English"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`language-${language}`}
                          checked={languageRequirements.includes(language)} 
                          onCheckedChange={() => toggleValue(language, languageRequirements, setLanguageRequirements)}
                        />
                        <Label htmlFor={`language-${language}`}>{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Posted Date Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Posted Date</h3>
                  <Select value={postedDate} onValueChange={setPostedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
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
