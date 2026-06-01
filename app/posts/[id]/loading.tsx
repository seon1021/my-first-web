export default function PostDetailLoading() {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <div className="h-10 bg-border rounded w-1/2 mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-64 bg-card rounded shadow-sm animate-pulse" />
          <div className="h-32 bg-card rounded shadow-sm animate-pulse" />
        </div>
        <div className="md:col-span-1">
          <div className="h-48 bg-card rounded shadow-sm animate-pulse" />
        </div>
      </div>
    </article>
  )
}
