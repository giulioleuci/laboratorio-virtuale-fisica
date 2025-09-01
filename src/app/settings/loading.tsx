import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SettingsLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Header skeleton */}
      <header className="mb-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3" />
      </header>

      {/* Settings sections */}
      <div className="space-y-6">
        {[...Array(4)].map((_, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Setting items */}
              {[...Array(3)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Color palette section skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, colorIndex) => (
              <div key={colorIndex} className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
