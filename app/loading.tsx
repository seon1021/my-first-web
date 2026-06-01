export default function Loading() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="h-10 bg-border rounded-md w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-card rounded-lg shadow-sm animate-pulse" />
            <div className="h-48 bg-card rounded-lg shadow-sm animate-pulse" />
            <div className="h-48 bg-card rounded-lg shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
