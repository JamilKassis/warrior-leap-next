export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white animate-pulse">
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-32 bg-gray-200 rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </div>
                <div className="px-2 pb-1.5 md:px-4 md:pb-4">
                  <div className="h-9 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
