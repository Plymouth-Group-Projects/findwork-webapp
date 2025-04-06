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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  // Using null as initial state to detect client-side rendering
  const [isMounted, setIsMounted] = useState(false)
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([])
  const [seniorityLevels, setSeniorityLevels] = useState<string[]>([])
  const [rateType, setRateType] = useState<string[]>([])
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')

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
    setEmploymentTypes([])
    setSeniorityLevels([])
    setRateType([])
    setMinSalary('')
    setMaxSalary('')
  }

  // If not mounted (server render), return a simpler version or loading state
  if (!isMounted) {
    return (
      <Sidebar>
        <SidebarContent className="pt-[80px]">
          <SidebarGroup>
            <SidebarGroupLabel>Filter</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4">Loading filters...</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar className="fixed top-0 left-0 h-screen w-[300px]">
      <SidebarContent className="pt-[80px] px-[30px]">
        <SidebarGroup>
          <SidebarGroupLabel>Filter</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Type of Employment</h3>
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {["Full Time Jobs", "Part Time Jobs", "Freelancing Jobs", "On-Time Jobs", "Contract"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`employment-${type}`}
                          checked={employmentTypes.includes(type)} 
                          onCheckedChange={() => toggleValue(type, employmentTypes, setEmploymentTypes)}
                        />
                        <Label htmlFor={`employment-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm mb-2">Seniority Level</h3>
                  <div className="space-y-2">
                    {["Entry Level", "Mid Level", "Senior Level", "Expert Level"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`level-${level}`}
                          checked={seniorityLevels.includes(level)} 
                          onCheckedChange={() => toggleValue(level, seniorityLevels, setSeniorityLevels)}
                        />
                        <Label htmlFor={`level-${level}`}>{level}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm mb-2">Salary Range</h3>
                  <div className="flex space-x-4 mb-2">
                    {["Daily Rate", "Hourly Rate"].map((rate) => (
                      <div key={rate} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`rate-${rate}`}
                          checked={rateType.includes(rate)} 
                          onCheckedChange={() => toggleValue(rate, rateType, setRateType)}
                        />
                        <Label htmlFor={`rate-${rate}`}>{rate}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                    />
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
