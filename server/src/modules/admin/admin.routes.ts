import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { adminOnly, protectedRoute } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.use(protectedRoute, adminOnly)

// Create product
router.post("/products", upload.array("images", 5), adminController.createProduct);

// Get all products
router.get("/products", adminController.getAllProducts);

// Update product
router.put("/products/:productId", upload.array("images", 5), adminController.updateProduct);

// Delete product
router.delete("/products/:productId", adminController.deleteProduct);

// Get all orders 
router.get("/orders", adminController.getAllOrders);

// Update order status
router.patch("/orders/:orderId/status", adminController.updateOrderStatus);

// Get all customers
router.get("/customers", adminController.getAllCustomers);

// Get dashboard stats
router.get("/stats", adminController.getDashboardStats);



export default router