export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Header skeleton */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
            <div className="w-32 h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Featured post skeleton */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-56 md:h-72 bg-gray-200" />
              <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                <div className="h-5 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts grid skeleton */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
