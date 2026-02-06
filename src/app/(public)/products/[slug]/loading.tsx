export default function ProductDetailLoading() {
  return (
    <div className="bg-white animate-pulse">
      {/* Product hero — full-width, matches actual layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] mb-10">
        {/* Image skeleton — grey hits left edge */}
        <div className="bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center px-4 py-4 lg:py-10 lg:px-12">
          <div className="w-full max-w-2xl">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            {/* Thumbnail dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        </div>

        {/* Details skeleton */}
        <div className="flex flex-col px-4 sm:px-6 lg:pl-8 lg:pr-8 xl:pr-16 pt-4 lg:pt-8">
          {/* Title */}
          <div className="h-9 w-3/4 bg-gray-200 rounded-lg mb-4" />

          {/* Description */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="h-8 w-32 bg-gray-200 rounded-lg" />
          </div>

          {/* Features/Highlights */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Add to Cart button */}
          <div className="flex items-stretch gap-3 mb-4">
            <div className="w-28 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
          </div>

          {/* Info block */}
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          {/* WhatsApp CTA */}
          <div className="h-12 w-full bg-gray-100 rounded-lg mt-5" />
        </div>
      </div>

      {/* Specifications skeleton — content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="py-8 border-t border-gray-100">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
