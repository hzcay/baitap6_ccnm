const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc)
router.get("/", productController.getAllProducts);

// Lấy sản phẩm nổi bật (Top 10 bán chạy & xem nhiều)
router.get("/highlights", productController.getHighlights);

// Lấy chi tiết một sản phẩm
router.get("/:id", productController.getProductById);

// Lấy danh sách sản phẩm tương tự
router.get("/:id/similar", productController.getSimilarProducts);

module.exports = router;
