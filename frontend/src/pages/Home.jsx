import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import HorizontalCarousel from "../components/HorizontalCarousel";
import { SlidersHorizontal, Sparkles, TrendingUp, Percent, Star, Box, ShoppingBag, X, RefreshCw } from "lucide-react";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  // States for search and filter conditions
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Catalog Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination States for Lazy Loading
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Top 10 Highlights States
  const [highlights, setHighlights] = useState({ bestSellers: [], mostViewed: [] });
  const [activeHighlightTab, setActiveHighlightTab] = useState("bestSellers");
  const [highlightsLoading, setHighlightsLoading] = useState(true);

  const categories = ["Tất cả", "Custom Series", "Premium Prebuilts", "Retro Classics", "Silent Editions"];

  // Fetch highlights (Top 10 best sellers & most viewed) from database
  const fetchHighlights = async () => {
    try {
      setHighlightsLoading(true);
      const response = await axios.get("/products/highlights");
      if (response.data && response.data.success) {
        setHighlights(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching highlights:", err);
    } finally {
      setHighlightsLoading(false);
    }
  };

  // Fetch products with dynamic pagination
  const fetchProducts = async (currentPage = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        limit: 3, // Limit 3 sản phẩm trên 1 trang để kiểm thử lazy loading rõ rệt nhất!
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== "Tất cả") params.category = selectedCategory;
      if (statusFilter) params.status = statusFilter;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await axios.get("/products", { params });
      if (response.data && response.data.success) {
        const fetchedData = response.data.data;
        if (append) {
          setProducts((prev) => [...prev, ...fetchedData]);
        } else {
          setProducts(fetchedData);
        }

        // Kiểm tra xem có thể load tiếp trang sau hay không
        const totalPages = response.data.totalPages;
        setHasMore(currentPage < totalPages && fetchedData.length === 3);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch highlights once on mount
  useEffect(() => {
    fetchHighlights();
  }, []);

  // Trigger loading page 1 whenever filter conditions change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchProducts(1, false);
      fetchHighlights(); // Tải lại cả highlights để đồng bộ lượt xem mới nhất
    }, 300); // 300ms debounce to prevent hitting MySQL excessively on typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, statusFilter, minPrice, maxPrice]);

  // Fetch next page when page increments
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, true);
    }
  }, [page]);

  // Window scroll event listener to detect when reaching bottom (Lazy Loading)
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isLoadingMore || !hasMore) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      // Scroll cách đáy dưới 100px sẽ tự động kích hoạt load trang tiếp theo
      if (documentHeight - (scrollTop + windowHeight) < 100) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isLoadingMore, hasMore]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setStatusFilter("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-left">
      {/* Navbar with integrated live search */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Member Exclusive Hero Banner */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl overflow-hidden p-8 sm:p-12 shadow-xl border border-indigo-950 text-left">
          {/* Decorative gradients */}
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl flex flex-col gap-4 text-white">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit">
              <Sparkles size={12} /> Ưu đãi độc quyền Thành viên
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white my-0">
              Xin chào, <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">{user?.name || "Thành viên"}</span>!
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Chào mừng bạn đã trở lại hệ thống KeyQuest. Để tri ân thành viên, chúng tôi giảm giá ngay <span className="font-bold text-yellow-400">20%</span> cho toàn bộ sản phẩm trên cửa hàng khi bạn thanh toán trực tuyến.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                <span className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Mã của bạn:</span>
                <span className="font-mono text-sm font-bold text-yellow-300 tracking-wider">MEMBER20</span>
              </div>
              <button 
                onClick={() => alert("Đã sao chép mã MEMBER20!")} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
              >
                Sao chép mã
              </button>
            </div>
          </div>
        </div>

        {/* Top 10 Highlights Horizontal Paging Carousel Section */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-2xl">
                <Sparkles size={20} className="animate-pulse" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-gray-900 m-0">Sản phẩm Nổi bật</h2>
                <p className="text-[11px] text-gray-500 m-0">Bộ sưu tập Top 10 Bán chạy nhất và Được xem nhiều nhất</p>
              </div>
            </div>
            {/* Horizontal Carousel Tabs */}
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 w-fit">
              <button
                onClick={() => setActiveHighlightTab("bestSellers")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeHighlightTab === "bestSellers"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                🔥 Bán chạy nhất
              </button>
              <button
                onClick={() => setActiveHighlightTab("mostViewed")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeHighlightTab === "mostViewed"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                👁️ Xem nhiều nhất
              </button>
            </div>
          </div>

          {/* Highlights Carousel View */}
          {highlightsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <HorizontalCarousel
              products={
                activeHighlightTab === "bestSellers"
                  ? highlights.bestSellers
                  : highlights.mostViewed
              }
            />
          )}
        </div>

        {/* Tabs & Filters Dashboard */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          
          {/* Category Tabs */}
          <div className="border-b border-gray-100 pb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtering Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Status Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" /> Trạng thái Nổi bật
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
              >
                <option value="">Tất cả</option>
                <option value="isNew">Mới nhất</option>
                <option value="isBestSeller">Bán chạy nhất</option>
                <option value="isPromo">Khuyến mãi</option>
              </select>
            </div>

            {/* Min Price */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500">Giá tối thiểu ($)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Ví dụ: 80"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
              />
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500">Giá tối đa ($)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Ví dụ: 200"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(1, false)}
                className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all focus:outline-none border border-transparent active:scale-95"
              >
                <RefreshCw size={14} /> Tải lại
              </button>
              {(searchTerm || selectedCategory !== "Tất cả" || statusFilter || minPrice || maxPrice) && (
                <button
                  onClick={handleClearFilters}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-1 transition-all focus:outline-none border border-transparent active:scale-95"
                  title="Xóa bộ lọc"
                >
                  <X size={14} /> Xóa lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl font-extrabold text-gray-800 m-0 flex items-center gap-2">
              <ShoppingBag size={20} className="text-indigo-600" /> Danh sách Sản phẩm
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Đã hiển thị: {products.length} sản phẩm
            </span>
          </div>

          {/* Loading view */}
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-gray-500 animate-pulse">Đang tải sản phẩm từ MySQL...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl text-center font-medium">
              {error}
            </div>
          ) : products.length === 0 ? (
            /* No Results Found */
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 px-4">
              <div className="bg-gray-100 p-4 rounded-full text-gray-400 mb-4">
                <Box size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-700 m-0">Không tìm thấy bàn phím cơ nào</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                Không tìm thấy sản phẩm khớp với các tiêu chí tìm kiếm hoặc bộ lọc của bạn trong database. Vui lòng thử lại!
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all text-xs focus:outline-none"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {products.map((prod) => {
                // Calculate promotion badge values
                const hasDiscount = prod.originalPrice > prod.price;
                const discountPercent = hasDiscount
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer"
                  >
                    {/* Image frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gray-50">
                      <img
                        src={prod.images && prod.images[0] ? prod.images[0] : "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600"}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* State Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        {prod.isNew && (
                          <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-extrabold uppercase rounded-full shadow-sm">
                            Mới
                          </span>
                        )}
                        {prod.isBestSeller && (
                          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-extrabold uppercase rounded-full shadow-sm flex items-center gap-1">
                            Hot
                          </span>
                        )}
                        {prod.isPromo && (
                          <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold uppercase rounded-full shadow-sm">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Sale Percent Tag */}
                      {discountPercent > 0 && (
                        <div className="absolute top-4 right-4 bg-rose-500 text-white px-2.5 py-1 text-xs font-black rounded-xl shadow-md z-10 flex items-center gap-0.5">
                          <Percent size={12} /> -{discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Product Metadata & Info */}
                    <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                      <div className="flex flex-col gap-2">
                        {/* Category & Ratings row */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {prod.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700">4.8</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-800 line-clamp-2 my-0 group-hover:text-indigo-600 transition-colors">
                          {prod.name}
                        </h3>

                        {/* Inventory & Sales statistics */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <Box size={13} className="text-gray-400" /> Hàng tồn: <strong className={prod.stock <= 5 ? "text-rose-600" : "text-gray-700"}>{prod.stock} chiếc</strong>
                          </span>
                          <span className="bg-gray-50 px-2 py-1 rounded-lg font-medium">
                            Đã bán: <strong className="text-indigo-600">{prod.sold}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Pricing Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                        <div className="flex flex-col text-left">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                              ${parseFloat(prod.originalPrice).toFixed(2)}
                            </span>
                          )}
                          <span className="text-lg font-black text-gray-900">
                            ${parseFloat(prod.price).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold text-indigo-600 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent px-3.5 py-2 rounded-2xl transition-all">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Lazy Loading Spinner Indicator */}
          {isLoadingMore && (
            <div className="flex flex-col items-center justify-center py-6 gap-2 border-t border-gray-100/50 mt-4">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[11px] font-semibold text-gray-500 animate-pulse">Đang tải thêm bàn phím cơ từ MySQL...</p>
            </div>
          )}

          {/* End of Catalog Success Message */}
          {!hasMore && !loading && !isLoadingMore && products.length > 0 && (
            <div className="text-center py-8 border-t border-dashed border-gray-150 mt-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                🎉 Đã hiển thị tất cả {products.length} sản phẩm từ MySQL!
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
