import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomSwiper = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
        Không có hình ảnh
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-sm">
        <img
          src={images[activeIndex]}
          alt={`Product View ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:outline-none backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:outline-none backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Rows */}
      {images.length > 1 && (
        <div className="flex gap-3 justify-center">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-indigo-600 ring-2 ring-indigo-100 scale-105"
                  : "border-gray-200 hover:border-indigo-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSwiper;
