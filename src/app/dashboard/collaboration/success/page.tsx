"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  File, 
  ArrowRight, 
  MessageCircle, 
  Calendar,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentDetails {
  amount: string;
  currency: string;
  status: string;
  workerName: string;
  collaborationId?: string;
}

export default function CollaborationSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // First verify the payment
        const verifyResponse = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          console.error("Payment verification failed:", verifyData.error);
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: verifyData.error || "Unable to verify payment status.",
          });
          setLoading(false);
          return;
        }

        setPaymentDetails(verifyData.payment);

        // Then create the hired collaboration record
        const successResponse = await fetch('/api/checkout/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
          }),
        });
        
        const successData = await successResponse.json();
        
        if (!successData.success) {
          console.error("Failed to create collaboration record:", successData.error);
          toast({
            variant: "destructive",
            title: "Collaboration Creation Failed",
            description: successData.error || "Unable to create collaboration record.",
          });
        } else {
          console.log("Collaboration record created successfully:", successData.message);          // Store the collaboration ID in the payment details for access in UI
          if (verifyData.payment) {
            setPaymentDetails({
              ...verifyData.payment,
              collaborationId: successData.collabId
            });
          }
        }
      } catch (error) {
        console.error("Error processing payment completion:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while processing payment completion.",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex-grow mt-[90px] py-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light mb-4"></div>
        <p className="text-lg">Verifying your payment...</p>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex-grow mt-[90px] py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700">Invalid Session</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <p className="text-center mb-4">No payment session was found. Please try again or contact support if you believe this is an error.</p>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-gray-50 p-4">
              <Button 
                onClick={() => router.push('/dashboard/collaboration')}
                className="bg-light hover:bg-lightest hover:text-darker"
              >
                Go to Collaborations
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!paymentDetails) {
    return (
      <div className="flex-grow mt-[90px] py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="bg-yellow-50">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
              </div>
              <CardTitle className="text-center text-yellow-700">Payment Status Pending</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <p className="text-center mb-4">
                We're still processing your payment. It may take a few moments to complete.
                Please check your dashboard for updates.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-gray-50 p-4">
              <Button 
                onClick={() => router.push('/dashboard/collaboration')}
                className="bg-light hover:bg-lightest hover:text-darker mr-4"
              >
                View Collaborations
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Check Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow mt-[90px] py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-green-50 border-b">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl text-green-700">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <div className="text-center mb-6">
              <p className="text-lg mb-1">
                Thank you for your payment. {paymentDetails.workerName} has been notified.
              </p>
              <p className="text-gray-600">
                A collaboration contract has been created and you can now communicate with your worker to arrange services.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-lg mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{sessionId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Worker:</span>
                  <span className="font-medium">{paymentDetails.workerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{paymentDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">              <Button 
                onClick={() => {
                  if (paymentDetails?.collaborationId) {
                    router.push(`/dashboard/collaboration/${paymentDetails.collaborationId}`);
                  } else {
                    router.push('/dashboard/collaboration?tab=hired-collabs');
                  }
                }}
                className="bg-light hover:bg-lightest hover:text-darker flex items-center justify-center"
              >
                <File className="mr-2 h-4 w-4" />
                View Collaboration Details
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/messages')}
                className="flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Worker
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">What's next?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-light text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h3 className="font-medium">Connect with your worker</h3>
                <p className="text-gray-600">Use the messaging system to discuss project details and logistics.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-light text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h3 className="font-medium">Schedule the service</h3>
                <p className="text-gray-600">Agree on dates and times for the work to be performed.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-light text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h3 className="font-medium">Track progress</h3>
                <p className="text-gray-600">Monitor the work through your collaboration dashboard.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-light text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h3 className="font-medium">Leave feedback</h3>
                <p className="text-gray-600">After completion, rate and review your experience to help the community.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => router.push('/workforce-hub')}
              variant="outline"
              className="flex items-center"
            >
              Find More Workers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}