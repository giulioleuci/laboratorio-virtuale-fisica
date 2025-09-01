import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function FormulaLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Header skeleton */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2" />
      </header>

      {/* Experimental data card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode switches skeleton */}
          <div className="rounded-lg border bg-card/50 p-4 space-y-4">
            <div className="flex flex-wrap gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="border rounded-lg">
              {/* Table header */}
              <div className="border-b p-4 bg-muted/50">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              {/* Table rows */}
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="border-b p-4">
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, colIndex) => (
                      <Skeleton key={colIndex} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chart card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Results card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
