const { Op } = require("sequelize");
const Product = require("../sequelize_models/product.model");

// Lấy danh sách sản phẩm kèm tìm kiếm, bộ lọc và Phân trang (Lazy Loading)
const getAllProducts = async (req, res) => {
  try {
    const { search, category, status, minPrice, maxPrice } = req.query;
    
    // Phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // Default limit 4 để test cuộn dễ dàng
    const offset = (page - 1) * limit;

    const where = {};

    // 1. Tìm kiếm theo từ khóa (tên sản phẩm)
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // 2. Lọc theo danh mục
    if (category && category !== "Tất cả") {
      where.category = category;
    }

    // 3. Lọc theo trạng thái nổi bật (mới nhất, bán chạy nhất, khuyến mãi)
    if (status) {
      if (status === "isNew") {
        where.isNew = true;
      } else if (status === "isBestSeller") {
        where.isBestSeller = true;
      } else if (status === "isPromo") {
        where.isPromo = true;
      }
    }

    // 4. Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    // Thực hiện truy vấn có đếm tổng số bản ghi và áp dụng limit/offset
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      totalCount: count,
      totalPages,
      currentPage: page,
      limit,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy chi tiết sản phẩm theo ID (Tự động tăng số lượt xem)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm này",
      });
    }

    // Tự động tăng số lượt xem lên 1
    await product.increment("views");
    await product.reload(); // Nạp lại lượt xem mới nhất để trả về cho Client

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy Top 10 Bán chạy nhất và Top 10 Xem nhiều nhất
const getHighlights = async (req, res) => {
  try {
    // 1. Top 10 Bán chạy nhất (sold giảm dần)
    const bestSellers = await Product.findAll({
      order: [["sold", "DESC"]],
      limit: 10,
    });

    // 2. Top 10 Xem nhiều nhất (views giảm dần)
    const mostViewed = await Product.findAll({
      order: [["views", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      data: {
        bestSellers,
        mostViewed,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy danh sách sản phẩm tương tự (cùng danh mục, loại trừ chính nó)
const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm gốc",
      });
    }

    const similarProducts = await Product.findAll({
      where: {
        category: product.category,
        id: {
          [Op.ne]: id,
        },
      },
      limit: 4,
    });

    return res.status(200).json({
      success: true,
      data: similarProducts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getHighlights,
  getSimilarProducts,
};
