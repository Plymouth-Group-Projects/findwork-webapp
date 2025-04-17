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

export function WorkforceSidebar() {
  // Using null as initial state to detect client-side rendering
  const [isMounted, setIsMounted] = useState(false)
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([])
  const [seniorityLevels, setSeniorityLevels] = useState<string[]>([])
  const [rateType, setRateType] = useState<string>("hourly") // Default to hourly rate
  const [hourlyRateValues, setHourlyRateValues] = useState<[number, number]>([500, 5000])
  const [dailyRateValues, setDailyRateValues] = useState<[number, number]>([2000, 20000])
  const [hourlyRate, setHourlyRate] = useState<[number, number]>([500, 5000])
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  
  // New state variables for additional filters
  const [jobCategory, setJobCategory] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [availability, setAvailability] = useState<string[]>([])
  const [workTypes, setWorkTypes] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>('')

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

  // Only render on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Effect to handle rate type changes
  useEffect(() => {
    // Reset hourly rate values when rate type changes
    if (rateType === "hourly") {
      setHourlyRate(hourlyRateValues);
    } else {
      setHourlyRate(dailyRateValues);
    }
  }, [rateType, hourlyRateValues, dailyRateValues]);

  const toggleValue = (value: string, list: string[], setList: Dispatch<SetStateAction<string[]>>) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value))
    } else {
      setList([...list, value])
    }
  }

  const handleRateChange = (value: [number, number]) => {
    setHourlyRate(value);
    if (rateType === "hourly") {
      setHourlyRateValues(value);
    } else {
      setDailyRateValues(value);
    }
  };

  const clearAll = () => {
    setJobCategory('')
    setLocation('')
    setAvailability([])
    setHourlyRateValues([500, 5000])
    setDailyRateValues([2000, 20000])
    setHourlyRate([500, 5000])
    setWorkTypes([])
    setExperienceLevel('')
    setRateType("hourly")
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
                        <SelectItem key={category} value={category}>{category}</SelectItem>
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
              
              {/* Availability Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Availability</h3>
                  <div className="space-y-4">
                    {["Available Now", "Weekdays", "Weekends"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`availability-${option}`}
                          checked={availability.includes(option)} 
                          onCheckedChange={() => toggleValue(option, availability, setAvailability)}
                        />
                        <Label htmlFor={`availability-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Hourly/Daily Rate Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Rate Type</h3>
                  <RadioGroup 
                    value={rateType} 
                    onValueChange={setRateType}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily Rate</Label>
                    </div>
                  </RadioGroup>
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">
                    {rateType === "hourly" ? "Hourly Rate" : "Daily Rate"}
                  </h3>
                  <div className="flex justify-between mb-2">
                    <span>Rs. {hourlyRate[0]}</span>
                    <span>Rs. {hourlyRate[1]}</span>
                  </div>
                  <Slider
                    min={rateType === "hourly" ? 500 : 2000}
                    max={rateType === "hourly" ? 5000 : 20000}
                    step={rateType === "hourly" ? 100 : 500}
                    value={hourlyRate}
                    onValueChange={handleRateChange}
                  />
                </div>
              </SidebarMenuItem>
              
              {/* Work Type Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Work Type</h3>
                  <div className="space-y-4">
                    {["Full-time", "Part-time", "On-call"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`work-type-${type}`}
                          checked={workTypes.includes(type)} 
                          onCheckedChange={() => toggleValue(type, workTypes, setWorkTypes)}
                        />
                        <Label htmlFor={`work-type-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Experience Level Filter */}
              <SidebarMenuItem>
                <div className="flex-1 mt-6">
                  <h3 className="font-semibold text-sm mb-2">Experience Level</h3>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="text-darker bg-white">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
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
