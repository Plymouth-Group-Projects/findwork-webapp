'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  DollarSign,
  Plus,
  Minus,
  ArrowRight,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Footer from '@/components/footer';

// Schema for contract creation
const contractSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  freelancerId: z.string().min(1, { message: 'Freelancer is required' }),
  freelancerName: z.string().optional(),
  jobId: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional(),
  paymentAmount: z.coerce.number().min(1, { message: 'Amount must be greater than 0' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  paymentTerms: z.string().min(5, { message: 'Payment terms must be at least 5 characters' }),
  milestones: z.array(
    z.object({
      title: z.string().min(3, { message: 'Title is required' }),
      description: z.string().optional(),
      dueDate: z.date({ required_error: 'Due date is required' }),
      amount: z.coerce.number().min(1, { message: 'Amount must be greater than 0' }),
    })
  ).optional(),
  attachments: z.array(z.string()).optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export default function CreateContractPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Default values for the form
  const defaultValues: ContractFormValues = {
    title: '',
    description: '',
    freelancerId: '',
    freelancerName: '',
    startDate: new Date(),
    paymentAmount: 0,
    currency: 'USD',
    paymentTerms: 'Payment will be processed upon completion of all deliverables.',
    milestones: [
      {
        title: 'Initial Milestone',
        description: 'First phase of the project',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        amount: 0,
      },
    ],
  };

  // Initialize the form with react-hook-form
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for milestones
  const { fields, append, remove } = useFieldArray({
    name: 'milestones',
    control: form.control,
  });

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/auth/login?callbackUrl=/dashboard/contracts/create');
    return null;
  }

  // Handle form submission
  const onSubmit = async (data: ContractFormValues) => {
    if (!session?.user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a contract',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Calculate total from milestones if they exist
      if (data.milestones && data.milestones.length > 0) {
        const totalFromMilestones = data.milestones.reduce(
          (sum, milestone) => sum + Number(milestone.amount || 0),
          0
        );
        
        // Update payment amount if it's different
        if (totalFromMilestones !== data.paymentAmount) {
          setConfirmDialogOpen(true);
          setSubmitting(false);
          return;
        }
      }

      // Submit the contract
      await submitContract(data);
      
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to create contract. Please try again.',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };

  // Submit the contract to the API
  const submitContract = async (data: ContractFormValues) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create contract');
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: 'Contract created successfully',
      });

      // Redirect to the contracts page
      router.push('/dashboard/contracts');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle searching for freelancers
  const searchFreelancers = async (query: string) => {
    if (!query || query.length < 2) return;
    
    setSearchLoading(true);
    setSearchQuery(query);
    
    try {
      const response = await fetch(`/api/user/search?query=${encodeURIComponent(query)}&role=freelancer`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to search freelancers');
      }
      
      const data = await response.json();
      setSearchResults(data.users || []);
      
    } catch (error) {
      console.error('Error searching freelancers:', error);
      toast({
        title: 'Error',
        description: 'Failed to search freelancers',
        variant: 'destructive',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Select a freelancer
  const selectFreelancer = (freelancer: any) => {
    form.setValue('freelancerId', freelancer._id);
    form.setValue('freelancerName', freelancer.name);
    setSelectedFreelancer(freelancer.name);
    setSearchResults([]);
  };

  // Add a milestone
  const addMilestone = () => {
    const lastMilestone = form.getValues('milestones')?.[fields.length - 1];
    const lastDate = lastMilestone?.dueDate ? new Date(lastMilestone.dueDate) : new Date();
    
    // Set date 2 weeks after the last milestone
    const newDate = new Date(lastDate);
    newDate.setDate(newDate.getDate() + 14);
    
    append({
      title: `Milestone ${fields.length + 1}`,
      description: '',
      dueDate: newDate,
      amount: 0,
    });
  };

  // Calculate total from milestones
  const calculateTotal = () => {
    const milestones = form.getValues('milestones') || [];
    return milestones.reduce((sum, milestone) => sum + Number(milestone.amount || 0), 0);
  };

  // Update the payment amount based on milestone totals
  const updateTotalAmount = () => {
    const total = calculateTotal();
    form.setValue('paymentAmount', total);
    setConfirmDialogOpen(false);
  };

  return (
    <main className="flex-1 mt-24 overflow-auto">
      <div className="container px-4 mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Create Contract</h1>
            <p className="text-light/80 mt-1">Set up a new contract with a freelancer</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg text-darker bg-white">
          <CardHeader className="bg-white rounded-t-lg border-b border-light/10">
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Create a binding agreement between you and a freelancer</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contract Basics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-darker">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Development Project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the scope of work, deliverables, and expectations." 
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <label className="block text-sm font-medium text-darker mb-1">
                        Freelancer
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Search for freelancer by name or email"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchFreelancers(e.target.value);
                          }}
                          className="mb-1"
                        />
                        {selectedFreelancer && (
                          <div className="p-3 border border-light rounded-md mt-2 text-sm bg-lightest/30">
                            Selected: <span className="font-medium">{selectedFreelancer}</span>
                            <input type="hidden" {...form.register('freelancerId')} />
                          </div>
                        )}
                        {searchResults.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-light rounded-md shadow-lg max-h-60 overflow-auto">
                            {searchResults.map((freelancer: any) => (
                              <div
                                key={freelancer._id}
                                className="p-3 hover:bg-lightest/30 cursor-pointer border-b border-light"
                                onClick={() => selectFreelancer(freelancer)}
                              >
                                <div className="font-medium">{freelancer.name}</div>
                                <div className="text-sm text-darker/70">{freelancer.email}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchLoading && (
                          <div className="mt-2 text-sm text-darker/70">Searching...</div>
                        )}
                        {form.formState.errors.freelancerId && (
                          <div className="mt-1 text-sm text-red-500">
                            {form.formState.errors.freelancerId.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment & Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-darker">Terms & Timeline</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="paymentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-darker/60" />
                                <Input className="pl-10" type="number" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='bg-white text-darker'>
                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Terms</FormLabel>
                          <FormControl>
                            <Textarea {...field} 
                              rows={3} 
                              placeholder="Specify payment schedules, conditions, and methods."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="pt-4">
                  <Accordion type="single" collapsible defaultValue="milestones">
                    <AccordionItem value="milestones">
                      <AccordionTrigger className="text-lg font-semibold text-darker">
                        Milestones & Deliverables
                      </AccordionTrigger>
                      <AccordionContent className="p-4 pt-6 border-t border-light/20">
                        <div className="text-sm text-darker/70 mb-6">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-light" />
                            <p>Break down the contract into milestones with specific deliverables and payment amounts. The sum of milestone amounts should equal the total contract value.</p>
                          </div>
                          <div className="mt-2 p-3 bg-light/10 rounded-md">
                            <div className="flex justify-between">
                              <span>Total milestone amount:</span>
                              <span className="font-semibold">${calculateTotal()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contract total:</span>
                              <span className="font-semibold">${form.getValues('paymentAmount')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <ScrollArea className="max-h-[400px] overflow-auto pr-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="p-4 border border-light rounded-md mb-4"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium">Milestone {index + 1}</h4>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    <Minus className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Milestone Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.dueDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Due Date</FormLabel>
                                      <FormControl>
                                        <DatePicker
                                          date={field.value}
                                          setDate={field.onChange}
                                          className="w-full"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="mt-4">
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          rows={2}
                                          placeholder="Describe the deliverables for this milestone"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="mt-4">
                                <FormField
                                  control={form.control}
                                  name={`milestones.${index}.amount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Amount</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-darker/60" />
                                          <Input className="pl-10" type="number" {...field} />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={addMilestone}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Milestone
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-light hover:bg-light/90 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Contract...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Create Contract
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Confirmation Dialog for Milestone Total Mismatch */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment Amount</AlertDialogTitle>
              <AlertDialogDescription>
                The sum of your milestone payments (${calculateTotal()}) doesn't match the contract total (${form.getValues('paymentAmount')}).
                <br /><br />
                Would you like to update the contract total to match the milestones?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, Keep as Is</AlertDialogCancel>
              <AlertDialogAction onClick={updateTotalAmount}>
                Yes, Update Total
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer />
    </main>
  );
}