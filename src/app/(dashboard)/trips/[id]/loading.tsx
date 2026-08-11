export default function Loading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full" />
          <div className="space-y-2">
            <div className="w-48 h-8 bg-primary/10 rounded-md" />
            <div className="w-32 h-4 bg-muted rounded-md" />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-32 h-10 bg-primary/10 rounded-md" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-24 bg-card border border-white/10 rounded-xl" />
        <div className="h-24 bg-card border border-white/10 rounded-xl" />
        <div className="h-24 bg-card border border-white/10 rounded-xl" />
        <div className="h-24 bg-card border border-white/10 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 h-[400px] bg-secondary/20 rounded-xl" />
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-card rounded-xl" />
          <div className="h-64 bg-card rounded-xl" />
        </div>
      </div>
    </div>
  );
}
