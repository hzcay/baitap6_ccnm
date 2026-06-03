const Product = require("../sequelize_models/product.model");

const seedProducts = async () => {
  try {
    const count = await Product.count();
    
    // In local development, if we want to overwrite and apply the new 12 products,
    // we can either check count, or let's clean the table if it only had 6 products!
    if (count >= 12) {
      console.log("Products table already has sufficient data, skipping seeding.");
      return;
    }
    
    // Clean old data to apply the new 12 products
    await Product.destroy({ where: {} });
    console.log("Cleaning products table to seed expanded 12-item dataset...");

    const defaultProducts = [
      {
        name: "Bàn phím cơ Apex Pro 75% Wireless",
        price: 120.00,
        originalPrice: 150.00,
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600",
          "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600"
        ],
        stock: 12,
        sold: 145,
        views: 245,
        category: "Custom Series",
        description: "Bàn phím cơ Apex Pro 75% Wireless sở hữu thiết kế công thái học cực đẹp với đèn nền RGB 16.8 triệu màu. Kết nối không dây siêu mượt và độ trễ cực thấp, mang lại trải nghiệm gõ phím đỉnh cao.",
        isNew: false,
        isBestSeller: true,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ VibeQuest 60% Compact",
        price: 96.00,
        originalPrice: 120.00,
        images: [
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600"
        ],
        stock: 5,
        sold: 28,
        views: 89,
        category: "Custom Series",
        description: "Thiết kế siêu nhỏ gọn 60% thích hợp cho những góc làm việc tối giản. Vỏ case nhựa trong suốt cùng hiệu ứng LED gầm nổi bật giúp bạn tăng thêm cảm hứng làm việc và chiến game.",
        isNew: true,
        isBestSeller: false,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ StealthKey TKL Silent",
        price: 180.00,
        originalPrice: 180.00,
        images: [
          "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600"
        ],
        stock: 15,
        sold: 90,
        views: 124,
        category: "Silent Editions",
        description: "Được trang bị Switch giảm âm thế hệ mới nhất, StealthKey TKL mang lại sự tĩnh lặng tuyệt đối cho môi trường văn phòng mà vẫn giữ lại cảm giác nhấn đầm tay và chắc chắn.",
        isNew: false,
        isBestSeller: true,
        isPromo: false,
      },
      {
        name: "Bàn phím cơ RetroBoard 100% Classic",
        price: 112.00,
        originalPrice: 140.00,
        images: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600",
          "https://images.unsplash.com/photo-1631553127989-5f6a6aa5d8b8?q=80&w=600"
        ],
        stock: 8,
        sold: 14,
        views: 45,
        category: "Retro Classics",
        description: "Lấy cảm hứng từ những cỗ máy tính cổ điển thập niên 90, RetroBoard mang tông màu xám cổ điển kết hợp cùng núm xoay âm lượng đa năng tiện dụng.",
        isNew: false,
        isBestSeller: false,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ CyberFlow 65% Acrylic",
        price: 220.00,
        originalPrice: 220.00,
        images: [
          "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600"
        ],
        stock: 3,
        sold: 62,
        views: 312,
        category: "Custom Series",
        description: "Bản đặc biệt với khung case Acrylic CNC nguyên khối bóng mờ, mạch xuôi hỗ trợ Hotswap và stab được tinh chỉnh sẵn. Sản phẩm dành cho những người đam mê chơi phím cơ chuyên nghiệp.",
        isNew: true,
        isBestSeller: true,
        isPromo: false,
      },
      {
        name: "Bàn phím cơ Legend 98% Forest Green",
        price: 136.00,
        originalPrice: 170.00,
        images: [
          "https://images.unsplash.com/photo-1631553127989-5f6a6aa5d8b8?q=80&w=600",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600"
        ],
        stock: 20,
        sold: 35,
        views: 95,
        category: "Premium Prebuilts",
        description: "Phiên bản màu Xanh rừng già (Forest Green) sang trọng. Layout 98 phím đầy đủ cụm số phụ nhưng vẫn tối ưu hóa không gian di chuột của bạn.",
        isNew: true,
        isBestSeller: false,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ NuPhy Air75 Ultra-Thin",
        price: 109.99,
        originalPrice: 129.99,
        images: [
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600"
        ],
        stock: 18,
        sold: 84,
        views: 198,
        category: "Premium Prebuilts",
        description: "Bàn phím cơ siêu mỏng NuPhy Air75 với switch cơ học low-profile cực nhạy, thích hợp cho cả Mac và Windows. Dễ dàng bỏ túi mang theo mọi lúc mọi nơi.",
        isNew: false,
        isBestSeller: true,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ Keychron Q1 Pro QMK",
        price: 199.00,
        originalPrice: 199.00,
        images: [
          "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600"
        ],
        stock: 10,
        sold: 115,
        views: 220,
        category: "Custom Series",
        description: "Sản phẩm đỉnh cao với khung nhôm full CNC, hỗ trợ tùy biến QMK/VIA mượt mà. Đệm Gasket Mount 2 lớp triệt tiêu âm vang cực tốt, cho âm thanh gõ trầm ấm thoải mái.",
        isNew: false,
        isBestSeller: true,
        isPromo: false,
      },
      {
        name: "Bàn phím cơ Epomaker TH80 Pro SE",
        price: 79.99,
        originalPrice: 99.99,
        images: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600",
          "https://images.unsplash.com/photo-1631553127989-5f6a6aa5d8b8?q=80&w=600"
        ],
        stock: 25,
        sold: 160,
        views: 180,
        category: "Custom Series",
        description: "Bản đặc biệt TH80 Pro Special Edition sở hữu cụm núm kim loại xoay mượt mà, hỗ trợ Hotswap mạch xuôi, LED RGB tùy biến nhiều chế độ cùng keycap PBT siêu bền bỉ.",
        isNew: false,
        isBestSeller: true,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ Wooting 60HE Hall Effect",
        price: 249.00,
        originalPrice: 249.00,
        images: [
          "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600"
        ],
        stock: 4,
        sold: 130,
        views: 290,
        category: "Premium Prebuilts",
        description: "Sử dụng switch từ tính Hall Effect thế hệ mới, cho phép tùy chỉnh hành trình kích hoạt phím (Rapid Trigger) cực nhạy. Phím cơ gaming tối thượng được game thủ chuyên nghiệp săn lùng.",
        isNew: true,
        isBestSeller: true,
        isPromo: false,
      },
      {
        name: "Bàn phím cơ Ducky One 3 TKL DayBreak",
        price: 119.00,
        originalPrice: 149.00,
        images: [
          "https://images.unsplash.com/photo-1631553127989-5f6a6aa5d8b8?q=80&w=600",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600"
        ],
        stock: 14,
        sold: 48,
        views: 75,
        category: "Retro Classics",
        description: "Thiết kế tông màu DayBreak phối hợp giữa màu xanh đậm và vàng chanh cực kỳ thời trang. Chất lượng hoàn thiện đỉnh cao từ thương hiệu Ducky nổi tiếng.",
        isNew: false,
        isBestSeller: false,
        isPromo: true,
      },
      {
        name: "Bàn phím cơ Akko 3098B Plus Cyan",
        price: 89.99,
        originalPrice: 109.99,
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600",
          "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600"
        ],
        stock: 22,
        sold: 72,
        views: 110,
        category: "Retro Classics",
        description: "Layout 3098B tối ưu diện tích. Phối màu Cyan đại dương trong lành cùng switch Akko độc quyền cho cảm giác gõ mượt mà và nảy tốt.",
        isNew: true,
        isBestSeller: false,
        isPromo: true,
      }
    ];

    await Product.bulkCreate(defaultProducts);
    console.log("Database seeded successfully with 12 default products!");
  } catch (error) {
    console.error("Failed to seed database:", error.message);
  }
};

module.exports = seedProducts;
