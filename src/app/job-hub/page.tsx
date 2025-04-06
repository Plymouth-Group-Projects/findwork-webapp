
import { FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function JobHub() {
  const employees = [
    {
      id: 1,
      name: "Babysitter",
      rate: "Rs. 250/hr",
      description:
        "A skilled babysitter with 3+ years of experience, CPR certification, and expertise with children.",
      image: "/babysitter.jpg",
    },
    {
      id: 2,
      name: "Babysitter",
      rate: "Rs. 250/hr",
      description:
        "A skilled babysitter with 3+ years of experience, CPR certification, and expertise with children.",
      image: "/babysitter.jpg",
    },
    {
      id: 3,
      name: "Babysitter",
      rate: "Rs. 250/hr",
      description:
        "A skilled babysitter with 3+ years of experience, CPR certification, and expertise with children.",
      image: "/babysitter.jpg",
    },
  ];

  return (
    <div className="flex pt-[60px] min-h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white text-black p-6 rounded-md">
        <h2 className="text-2xl font-bold mb-4">FINDWORK</h2>
        <div>
          <h3 className="font-semibold">Type of Employment</h3>
          <ul className="text-sm mt-2 space-y-2">
            <li><Checkbox /> Full Time Jobs</li>
            <li><Checkbox /> Part Time Jobs</li>
            <li><Checkbox /> Freelancing Jobs</li>
            <li><Checkbox /> On-Time Jobs</li>
            <li><Checkbox /> Contract</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
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
  );
}
