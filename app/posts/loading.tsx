export default function PostsLoading() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-1/4 bg-border rounded animate-pulse" />
          <div className="h-8 w-24 bg-border rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-card rounded-lg shadow-sm animate-pulse" />
          <div className="h-40 bg-card rounded-lg shadow-sm animate-pulse" />
          <div className="h-40 bg-card rounded-lg shadow-sm animate-pulse" />
          <div className="h-40 bg-card rounded-lg shadow-sm animate-pulse" />
        </div>
      </div>
    </section>
  )
}
