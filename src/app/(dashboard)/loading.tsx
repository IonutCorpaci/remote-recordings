export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-primary/20 rounded-lg" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="hidden sm:block h-10 w-28 bg-primary/20 rounded-lg" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="flex flex-col rounded-xl border border-white/10 bg-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1 mr-4">
                <div className="h-5 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
              </div>
              <div className="h-6 w-24 bg-white/10 rounded-full" />
            </div>

            <div className="space-y-3 py-2">
              <div className="h-8 w-36 bg-secondary/50 rounded-lg" />
              <div className="flex space-x-4">
                <div className="h-4 w-12 bg-white/5 rounded" />
                <div className="h-4 w-12 bg-white/5 rounded" />
              </div>
            </div>

            <div className="pt-2 mt-auto">
              <div className="h-10 w-full bg-secondary/40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
