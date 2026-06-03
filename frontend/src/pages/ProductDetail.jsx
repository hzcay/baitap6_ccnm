import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import CustomSwiper from "../components/CustomSwiper";
import { ChevronRight, Box, ShoppingCart, Star, Percent, ArrowLeft, Heart, CheckCircle2, ShieldCheck, Truck, Eye } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quantity selected locally
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch main product details
      const response = await axios.get(`/products/${id}`);
      if (response.data && response.data.success) {
        setProduct(response.data.data);
        setQuantity(1); // Reset selected quantity to 1 on product load
      }

      // 2. Fetch similar products (same category)
      const similarResponse = await axios.get(`/products/${id}/similar`);
      if (similarResponse.data && similarResponse.data.success) {
        setSimilarProducts(similarResponse.data.data);
      }
    } catch (err) {
      console.error("Error loading product details:", err);
      setError(err.response?.data?.message || "Không thể tải chi tiết sản phẩm này. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch product details whenever the URL parameter id changes
  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when loading new product details
  }, [id]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    try {
      // 1. Fetch current cart
      const cartRes = await axios.get('/cart');
      const currentCart = cartRes.data || { items: [], total: 0 };
      
      // 2. Check if item exists and update array
      let updatedItems = [...currentCart.items];
      const existingItemIndex = updatedItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems.push({
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: quantity,
          image: product.images && product.images[0] ? product.images[0] : null
        });
      }

      // 3. Recalculate total
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // 4. Save back to backend
      await axios.post('/cart', { items: updatedItems, total: newTotal });

      setToastMessage(`Đã thêm thành công ${quantity} chiếc "${product.name}" vào giỏ hàng!`);
      setTimeout(() => {
        setToastMessage(null);
      }, 4000); // Hide toast after 4s
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col text-left">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Đang truy vấn MySQL...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col text-left">
        <Navbar />
        <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl mb-6 font-medium">
            {error || "Sản phẩm không khả dụng."}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all text-sm focus:outline-none"
          >
            <ArrowLeft size={16} /> Quay về Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-left">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-indigo-900 border border-indigo-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in animate-slide-up max-w-md">
            <div className="bg-indigo-500 p-1.5 rounded-full">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-sm font-semibold m-0">{toastMessage}</p>
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-fit">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-400">Cửa hàng</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase text-[10px] font-bold">
            {product.category}
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Dynamic Detail Frame */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Interactive Swiper Slider */}
          <div className="w-full">
            <CustomSwiper images={product.images} />
          </div>

          {/* Right Column: Key Details & Actions */}
          <div className="w-full flex flex-col gap-6 justify-between text-left">
            <div className="flex flex-col gap-4">
              
              {/* Category Ribbon */}
              <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase rounded-full w-fit tracking-wide">
                Danh mục: {product.category}
              </span>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight m-0">
                {product.name}
              </h1>

              {/* Review Stars & Sales Counters */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">4.8</span>
                  <span className="text-xs text-gray-400 font-medium">(24 đánh giá)</span>
                </div>
                <span className="text-gray-200">|</span>
                
                {/* Sales counter requirement */}
                <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl">
                  <ShoppingCart size={15} className="text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-600">Đã bán: <strong className="text-indigo-600">{product.sold}</strong> sản phẩm</span>
                </div>

                {/* Views count tracker */}
                <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl">
                  <Eye size={15} className="text-purple-600" />
                  <span className="text-xs font-semibold text-gray-600">Lượt xem: <strong className="text-purple-600">{product.views || 0}</strong> lượt</span>
                </div>
              </div>

              {/* Member-Exclusive Pricing Frame */}
              <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Giá thành viên</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        ${parseFloat(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                {discountPercent > 0 && (
                  <span className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-0.5 animate-pulse">
                    <Percent size={14} /> -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Inventory count requirement ("Báo hàng tồn") */}
              <div className="flex items-center gap-2">
                <Box size={18} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Báo hàng tồn:</span>
                {product.stock === 0 ? (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-extrabold rounded-full">
                    Hết hàng
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-extrabold rounded-full animate-bounce">
                    Sắp hết hàng (Chỉ còn {product.stock} chiếc!)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-extrabold rounded-full">
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-left">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">Mô tả sản phẩm</h4>
                <p className="text-sm text-gray-600 leading-relaxed m-0">
                  {product.description}
                </p>
              </div>

            </div>

            {/* Quantity Modifier & Add to Cart Frame */}
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-100 mt-4">
              
              {/* Quantity increment/decrement Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600 text-left">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={product.stock === 0 || quantity <= 1}
                    className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-800 min-w-[32px] text-center">
                    {product.stock === 0 ? 0 : quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors focus:outline-none"
                  >
                    +
                  </button>
                </div>
                {product.stock > 0 && quantity === product.stock && (
                  <span className="text-[10px] text-rose-500 font-bold uppercase animate-pulse">
                    Đã đạt giới hạn tồn kho
                  </span>
                )}
              </div>

              {/* Add to Cart CTA */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-95 disabled:scale-100 disabled:shadow-none focus:outline-none"
                >
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </button>
                
                <button className="p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-rose-500 transition-all">
                  <Heart size={18} />
                </button>
              </div>
            </div>

            {/* Premium assurances for shopping wow factor */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={16} className="text-indigo-500" />
                <span>Giao hàng 2H</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span>Bảo hành 2 năm</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <CheckCircle2 size={16} className="text-indigo-500" />
                <span>100% Chính hãng</span>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-gray-800 m-0">Sản phẩm tương tự</h2>
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Cùng danh mục {product.category}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {similarProducts.map((simProd) => (
                <Link
                  key={simProd.id}
                  to={`/product/${simProd.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col gap-3 group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={simProd.images && simProd.images[0] ? simProd.images[0] : ""}
                      alt={simProd.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-1 my-0 group-hover:text-indigo-600 transition-colors">
                      {simProd.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-indigo-600">${parseFloat(simProd.price).toFixed(2)}</span>
                      <span className="text-[9px] font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Tồn: {simProd.stock}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ProductDetail;
