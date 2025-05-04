'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import Footer from '@/components/footer';

// Contract interface based on the schema
interface Milestone {
  title: string;
  description: string;
  dueDate: string; // or Date when working with the object
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

interface Contract {
  _id: string;
  title: string;
  description: string;
  clientId: string;
  clientName?: string; // For display
  freelancerId: string;
  freelancerName?: string; // For display
  jobId?: string;
  jobTitle?: string; // For display
  startDate: string; // or Date
  endDate?: string; // or Date
  paymentTerms: string;
  paymentAmount: number;
  currency: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  milestones?: Milestone[];
  attachments?: string[];
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

export default function ContractsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/contracts");
    }
  }, [status, router]);

  // Fetch contracts on component mount
  useEffect(() => {
    const fetchContracts = async () => {
      // Only fetch if authenticated
      if (status !== "authenticated") return;
      
      try {
        setLoading(true);
        // Call the API endpoint with proper headers and credentials
        const response = await fetch('/api/contracts', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch contracts');
        }
        
        const data = await response.json();
        console.log('Contract data received:', data);
        
        // Set contracts from API response
        if (data && data.contracts) {
          setContracts(data.contracts);
        } else {
          setContracts([]);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch contracts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [status]);

  // Format currency (number to string with currency symbol)
  const formatCurrency = (amount: number, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  };

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'disputed':
        return <Badge className="bg-purple-500">Disputed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Filter contracts based on status and search query
  const filteredContracts = contracts.filter(contract => {
    // Filter by status
    if (statusFilter !== "all" && contract.status !== statusFilter) return false;
    
    // Filter by search query (title, client name, or freelancer name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contract.title.toLowerCase().includes(query) ||
        (contract.clientName && contract.clientName.toLowerCase().includes(query)) ||
        (contract.freelancerName && contract.freelancerName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Calculate contract statistics
  const contractStats = {
    total: contracts.length,
    active: contracts.filter(contract => contract.status === 'active').length,
    completed: contracts.filter(contract => contract.status === 'completed').length,
    pending: contracts.filter(contract => contract.status === 'pending').length,
    cancelled: contracts.filter(contract => contract.status === 'cancelled').length,
    disputed: contracts.filter(contract => contract.status === 'disputed').length,
    totalValue: contracts.reduce((sum, contract) => sum + contract.paymentAmount, 0),
  };

  // Handle opening contract details dialog
  const handleOpenDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsDialogOpen(true);
  };

  // If loading authentication or not authenticated yet, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex-1 mt-24 overflow-auto p-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 mt-24 overflow-auto">
      <div className="container px-4 mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Contracts</h1>
            <p className="text-light/80 mt-1">Manage and track your contracts</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link href="/dashboard/contracts/create">
            <Button className="bg-light text-white hover:bg-opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-darker">Total Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-darker">{contractStats.total}</div>
              <p className="text-xs text-darker/70">
                {formatCurrency(contractStats.totalValue)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-darker">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{contractStats.active}</div>
              <p className="text-xs text-darker/70">
                {Math.round((contractStats.active / contractStats.total) * 100) || 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-darker">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{contractStats.pending}</div>
              <p className="text-xs text-darker/70">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-darker">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{contractStats.completed}</div>
              <p className="text-xs text-darker/70">
                Successfully finished
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and search */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-darker/60" />
                  <Input
                    placeholder="Search contracts..."
                    className="pl-10 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-[180px]">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts Table */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-white rounded-t-lg px-6 py-6">
            <div className="flex items-center justify-between">
              <CardTitle>Your Contracts</CardTitle>
              <Button variant="outline" size="sm" className="text-darker border-darker">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 px-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="py-8 px-6 text-center">
                <FileText className="h-10 w-10 mx-auto mb-2 text-darker/50" />
                <h3 className="font-medium text-darker mb-1">No contracts found</h3>
                <p className="text-darker/70">
                  {contracts.length === 0
                    ? "You don't have any contracts yet."
                    : "No contracts match your search criteria."}
                </p>
                {contracts.length === 0 && (
                  <Button className="mt-4 bg-light text-white hover:bg-light hover:bg-opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Contract
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white bg-white/50 border-b border-light">
                      <TableHead className="text-darker/70 w-[40%]">Contract</TableHead>
                      <TableHead className="text-darker/70">Status</TableHead>
                      <TableHead className="text-darker/70">Date</TableHead>
                      <TableHead className="text-darker/70 text-right">Amount</TableHead>
                      <TableHead className="text-darker/70 w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow
                        key={contract._id}
                        className="hover:bg-lightest/50 border-b border-light cursor-pointer"
                        onClick={() => handleOpenDetails(contract)}
                      >
                        <TableCell className="font-medium text-darker">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-md p-2 ${
                              contract.status === 'active' ? 'bg-green-100' :
                              contract.status === 'completed' ? 'bg-blue-100' :
                              contract.status === 'pending' ? 'bg-amber-100' :
                              contract.status === 'cancelled' ? 'bg-red-100' :
                              'bg-purple-100'
                            }`}>
                              {getStatusIcon(contract.status)}
                            </div>
                            <div>
                              <p className="font-medium text-darker">{contract.title}</p>
                              <p className="text-sm text-darker/70 mt-1">
                                {session && session.user && contract.clientName === session.user.name
                                  ? `Freelancer: ${contract.freelancerName || 'Unknown'}`
                                  : `Client: ${contract.clientName || 'Unknown'}`}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-darker">
                              {formatDate(contract.startDate)}
                            </span>
                            {contract.endDate && (
                              <span className="text-xs text-darker/70">
                                to {formatDate(contract.endDate)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(contract.paymentAmount, contract.currency)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-darker"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetails(contract);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedContract && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedContract.status)}
                  <DialogTitle>{selectedContract.title}</DialogTitle>
                </div>
                <DialogDescription>
                  {getStatusBadge(selectedContract.status)}
                  <span className="ml-2">
                    Created on {formatDate(selectedContract.createdAt)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-darker mb-2">Contract Information</h3>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-darker/70">Contract Title</span>
                          <span className="font-medium text-darker">{selectedContract.title}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-darker/70">Description</span>
                          <span className="text-darker">
                            {selectedContract.description}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-darker/70">Payment Terms</span>
                          <span className="text-darker">{selectedContract.paymentTerms}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-darker/70">Contract Amount</span>
                          <span className="text-xl font-bold text-darker">
                            {formatCurrency(selectedContract.paymentAmount, selectedContract.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-darker mb-2">Parties</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-light">
                          <div className="flex items-center gap-2">
                            <UserAvatar name={selectedContract.clientName || 'Client'} />
                            <div>
                              <div className="font-medium text-darker">
                                {selectedContract.clientName || 'Unknown Client'}
                              </div>
                              <div className="text-sm text-darker/70">Client</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-light">
                          <div className="flex items-center gap-2">
                            <UserAvatar name={selectedContract.freelancerName || 'Freelancer'} />
                            <div>
                              <div className="font-medium text-darker">
                                {selectedContract.freelancerName || 'Unknown Freelancer'}
                              </div>
                              <div className="text-sm text-darker/70">Freelancer</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-darker mb-2 mt-6">Timeline</h3>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-darker/70">Start Date</span>
                          <span className="text-darker">{formatDate(selectedContract.startDate)}</span>
                        </div>
                        {selectedContract.endDate && (
                          <div className="flex flex-col">
                            <span className="text-sm text-darker/70">End Date</span>
                            <span className="text-darker">{formatDate(selectedContract.endDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="milestones">
                  {selectedContract.milestones && selectedContract.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {selectedContract.milestones.map((milestone, index) => (
                        <Card key={index} className="border border-light">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-darker">{milestone.title}</CardTitle>
                                <CardDescription>
                                  Due: {formatDate(milestone.dueDate)}
                                </CardDescription>
                              </div>
                              {getStatusBadge(milestone.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-darker/80 mb-2">{milestone.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-darker">
                                {formatCurrency(milestone.amount, selectedContract.currency)}
                              </span>
                              {milestone.status === 'pending' ? (
                                <Button size="sm" className="bg-light text-white hover:bg-light hover:bg-opacity-90">
                                  Mark as Complete
                                </Button>
                              ) : null}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 px-6 text-center">
                      <Clock className="h-10 w-10 mx-auto mb-2 text-darker/50" />
                      <h3 className="font-medium text-darker mb-1">No milestones</h3>
                      <p className="text-darker/70">
                        This contract doesn't have any milestone payments set up.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="attachments">
                  {selectedContract.attachments && selectedContract.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedContract.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-light">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-darker/70" />
                            <span className="text-darker">{
                              attachment.split('/').pop() || `Attachment ${index + 1}`
                            }</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 px-6 text-center">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-darker/50" />
                      <h3 className="font-medium text-darker mb-1">No attachments</h3>
                      <p className="text-darker/70">
                        This contract doesn't have any attachments.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                {selectedContract.status === 'pending' && (
                  <>
                    <Button variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  </>
                )}
                {selectedContract.status === 'active' && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Footer/>
    </main>
  );
}

// Helper component to generate avatar for users
function UserAvatar({ name }: { name: string }) {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  const colorIndex = name.split('').reduce(
    (sum, char) => sum + char.charCodeAt(0), 0
  ) % colors.length;

  return (
    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${colors[colorIndex]}`}>
      {initials || '?'}
    </div>
  );
}