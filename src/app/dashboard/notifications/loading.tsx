import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="flex-1 mt-24 overflow-auto">
      <div className="container px-4 mx-auto py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-64" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-md border border-gray-100">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
