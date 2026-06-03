import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, fetchUserProfile } from "../redux/authSlice";
import { Keyboard, ShoppingCart, Search, LogOut, User, ChevronDown } from "lucide-react";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-md transition-transform group-hover:scale-105">
              <Keyboard size={20} className="animate-pulse" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              KeyQuest
            </span>
          </Link>

          {/* Search Bar - only shown if setter is passed */}
          {setSearchTerm !== undefined ? (
            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm bàn phím cơ..."
                  className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          ) : null}

          {/* Right Section: Member Profile & Cart */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart Icon */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600 transition-colors">
              <ShoppingCart size={20} />
            </Link>

            {/* Member Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full md:rounded-xl border border-transparent hover:border-gray-200 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-700 hidden md:block max-w-[120px] truncate">
                    {user.name || "Thành viên"}
                  </span>
                  <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left animate-fade-in animate-slide-up">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Đăng nhập với tư cách</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name || "Thành viên"}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase">
                        {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                      </span>
                    </div>

                    <Link
                      to="/edit-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="text-gray-400" />
                      Chỉnh sửa hồ sơ
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingCart size={16} className="text-gray-400" />
                      Lịch sử đơn hàng
                    </Link>

                    <hr className="border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
