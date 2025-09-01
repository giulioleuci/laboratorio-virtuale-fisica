"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading on route change
    setIsLoading(true);
    
    // Hide loading after a short delay to allow page to render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-7xl p-4 md:p-8">
          <GlobalLoadingSkeleton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function GlobalLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 animate-pulse">
      {/* Header skeleton */}
      <header className="text-center mb-16">
        <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </header>

      {/* Main content skeleton */}
      <div className="space-y-16">
        {/* Multiple sections */}
        {[...Array(2)].map((_, sectionIndex) => (
          <section key={sectionIndex}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-10 w-1/4" />
            </div>
            
            {/* Grid of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, cardIndex) => (
                <Card key={cardIndex} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Fixed bottom button skeleton */}
      <div className="fixed bottom-8 right-8">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </div>
  );
}
