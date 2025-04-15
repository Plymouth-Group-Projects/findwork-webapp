import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AppSidebar } from "@/components/workforcehub-sidebar";

export default function WorkForceHub() {
  const employees = [
    {
      id: 1,
      name: "Hair Dresser",
      rate: "Rs. 350/hr",
      description: "Experienced in haircuts, styling, and coloring. Trained in modern trends and customer care.",
      image: "/hairdresser.jpg",
    },
    {
      id: 2,
      name: "Executive Chef",
      rate: "Rs. 500/hr",
      description: "10+ years of experience in fine dining, cuisine, and kitchen management. Specializes in international cuisine.",
      image: "/chef.jpg",
    },
    {
      id: 3,
      name: "Landscape Gardener",
      rate: "Rs. 250/hr",
      description: "Expert in landscape design, tree care, and outdoor maintenance. Skilled with a variety of equipment.",
      image: "/gardener.jpg",
    },
  ];

  return (
    <div className="min-h-screen mt-[90px] grid grid-cols-5">
      {/* Sidebar */}
      <div className="col-span-1 h-screen sticky top-0">
        <AppSidebar/>
      </div>
      <div className="container mx-auto col-span-4">
        <main className="flex-1 p-10">
          {/* Search Bar */}
          <div className="flex space-x-4 mb-6">
            <Input placeholder="Job Title or Keyword" className="w-1/3" />
            <Select>
              <SelectTrigger><SelectValue placeholder="All Districts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Job Type</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 flex items-center">
              <FaSearch className="mr-2" /> Search
            </Button>
          </div>

          {/* Recommended Employees */}
          <h2 className="text-2xl font-semibold mb-4">Recommended Employees</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{employee.name}</CardTitle>
                  <p className="text-sm">{employee.rate}</p>
                  <p className="text-xs mt-2">{employee.description}</p>
                  <Button className="mt-3 bg-blue-600 w-full">Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
