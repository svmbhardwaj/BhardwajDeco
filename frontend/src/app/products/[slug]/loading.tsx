export default function ProductDetailLoading() {
  return (
    <div className="pb-24">
      <div className="skeleton h-[52vh] w-full md:h-[70vh]" />
      <div className="mx-auto mt-10 max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 md:col-span-7 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-44 w-full md:h-56" />
            ))}
          </div>
          <div className="space-y-4 md:col-span-5">
            <div className="skeleton h-8 w-1/2" />
            <div className="skeleton h-20 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-44 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
