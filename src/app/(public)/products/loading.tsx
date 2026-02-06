export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-7 w-36 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded mt-1" />
            </div>
            <div className="hidden sm:flex items-center gap-5">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <section className="py-12 md:py-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50" />
                <div className="p-4 md:p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                  <div className="h-11 w-full bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
