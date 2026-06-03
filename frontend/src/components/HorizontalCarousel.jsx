import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Percent, Star, Box, Eye } from "lucide-react";

export default function HorizontalCarousel({ products = [] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Dynamically update items per page based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute total pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Reset page index if resize results in index out of bounds
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  if (!products.length) return null;

  // Chunk products into pages
  const pages = [];
  for (let i = 0; i < products.length; i += itemsPerPage) {
    pages.push(products.slice(i, i + itemsPerPage));
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex flex-col gap-6 text-left group/carousel w-full">
      {/* Outer Slider Wrapper */}
      <div className="relative w-full overflow-hidden rounded-3xl p-1">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageProducts, pageIdx) => (
            <div
              key={pageIdx}
              className="w-full shrink-0 grid gap-5 px-1"
              style={{
                gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
              }}
            >
              {pageProducts.map((prod) => {
                const hasDiscount = prod.originalPrice > prod.price;
                const discountPercent = hasDiscount
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer h-full"
                  >
                    {/* Image frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                      <img
                        src={
                          prod.images && prod.images[0]
                            ? prod.images[0]
                            : "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* State Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        {prod.isNew && (
                          <span className="px-2.5 py-0.5 bg-teal-500 text-white text-[9px] font-extrabold uppercase rounded-full shadow-sm">
                            Mới
                          </span>
                        )}
                        {prod.isBestSeller && (
                          <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[9px] font-extrabold uppercase rounded-full shadow-sm">
                            Hot
                          </span>
                        )}
                        {prod.isPromo && (
                          <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[9px] font-extrabold uppercase rounded-full shadow-sm">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Sale Percent Tag */}
                      {discountPercent > 0 && (
                        <div className="absolute top-4 right-4 bg-rose-500 text-white px-2 py-0.5 text-[10px] font-black rounded-lg shadow-md z-10 flex items-center gap-0.5">
                          <Percent size={10} /> -{discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="p-5 flex flex-col gap-3 flex-1 justify-between text-left">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {prod.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-bold text-gray-700">4.8</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 my-0 group-hover:text-indigo-600 transition-colors h-10">
                          {prod.name}
                        </h3>

                        {/* Sold & Views details */}
                        <div className="flex flex-col gap-1.5 text-[11px] text-gray-500 mt-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Box size={12} className="text-gray-400" /> Hàng tồn: <strong className={prod.stock <= 5 ? "text-rose-600" : "text-gray-700"}>{prod.stock}</strong>
                            </span>
                            <span className="font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md">
                              Đã bán: {prod.sold}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md w-fit">
                            <Eye size={12} className="text-gray-400" /> Lượt xem: <strong className="text-purple-600 ml-0.5">{prod.views || 0}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                        <div className="flex flex-col text-left">
                          {hasDiscount && (
                            <span className="text-[10px] text-gray-400 line-through font-medium leading-none">
                              ${parseFloat(prod.originalPrice).toFixed(2)}
                            </span>
                          )}
                          <span className="text-base font-black text-gray-900 leading-tight">
                            ${parseFloat(prod.price).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold text-indigo-600 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent px-3 py-1.5 rounded-xl transition-all">
                          Chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next Buttons (Visible on Hover of carousel area, or always on touch screens) */}
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-12 -translate-x-4 bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 p-2.5 rounded-full shadow-lg border border-gray-150 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/carousel:opacity-100 z-25 focus:outline-none"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-12 translate-x-4 bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 p-2.5 rounded-full shadow-lg border border-gray-150 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/carousel:opacity-100 z-25 focus:outline-none"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Bottom Paging Indicator Dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === idx ? "w-6 bg-indigo-600" : "w-2 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
