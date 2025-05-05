"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaLock } from "react-icons/fa";
import { BsCreditCard as CreditCard } from "react-icons/bs";
import { IWorkerProfile } from "@/models/freelance-collab";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [worker, setWorker] = useState<IWorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const workerId = searchParams.get('workerId');
  
  useEffect(() => {
    if (!workerId) {
      router.push('/workforce-hub');
      return;
    }
    
    const fetchWorker = async () => {
      try {
        const response = await fetch(`/api/workforce-hub/${workerId}`);
        const data = await response.json();
        
        if (data.success) {
          setWorker(data.profile);
        } else {
          toast({
            title: "Error",
            description: "Failed to load worker details",
            variant: "destructive",
          });
          router.push('/workforce-hub');
        }
      } catch (error) {
        console.error("Error fetching worker:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorker();
  }, [workerId, router]);
  
  const proceedToPayment = async () => {
    if (!worker) return;
    
    setProcessing(true);
    try {
      // Extract price from salary string
      const priceMatch = worker.salary.match(/\$?(\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId: worker._id,
          workerName: worker.name,
          price: price,
          description: `Hiring ${worker.name} for ${worker.category || 'services'}`,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Payment Error",
          description: data.error || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to process payment request",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light"></div>
      </div>
    );
  }
  
  if (!worker) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center mt-20">
        <h1 className="text-2xl font-bold">Worker Not Found</h1>
        <p className="mt-4 text-gray-500">The worker you're looking for doesn't exist.</p>
        <Button 
          onClick={() => router.push('/workforce-hub')}
          className="mt-6 bg-light hover:bg-lightest hover:text-darker"
        >
          Return to Workers
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen text-darker py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl text-white font-bold text-center">Checkout</h1>
          <p className="text-center text-white mt-2">Complete your booking with {worker.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={worker.thumbnail || "/plumber.svg"}
                      alt={worker.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{worker.name}</h3>
                    <p className="text-gray-500">{worker.level} • {worker.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-light/20 text-darker text-xs py-1 px-2 rounded-full">
                        {worker.availability}
                      </span>
                      <span className="bg-light/20 text-darker text-xs py-1 px-2 rounded-full">
                        {worker.experience?.years || 0} years experience
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6 bg-darker/50" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-medium">{worker.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-medium">{worker.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills</span>
                    <span className="font-medium">{worker.topSkills.slice(0, 3).join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6 bg-white">
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal list-inside text-gray-600 ml-2">
                  <li>
                    <span className="font-medium text-black">Secure payment</span>
                    <p className="ml-6">Your payment is processed securely via Stripe</p>
                  </li>
                  <li>
                    <span className="font-medium text-black">Contract creation</span>
                    <p className="ml-6">A contract is created between you and the worker</p>
                  </li>
                  <li>
                    <span className="font-medium text-black">Communication</span>
                    <p className="ml-6">You'll be able to message the worker to discuss details</p>
                  </li>
                  <li>
                    <span className="font-medium text-black">Service delivery</span>
                    <p className="ml-6">The worker provides the agreed-upon services</p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Rate</span>
                    <span>{worker.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>$5.00</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      ${(() => {
                        const priceMatch = worker.salary.match(/\$?(\d+)/);
                        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
                        return (price + 5).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button
                  onClick={proceedToPayment}
                  disabled={processing}
                  className="w-full bg-light text-white hover:bg-lightest hover:text-darker"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                    </>
                  )}
                </Button>
                <div className="flex justify-center items-center text-gray-500 text-sm">
                  <FaLock className="mr-2" />
                  <span>Secure payment via Stripe</span>
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800">Important Note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                By proceeding with payment, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}