import { Router } from "express";
import { orderController } from "./order.controller.js";
import { protectedRoute } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(protectedRoute);

// Create order
router.post("/", orderController.createOrder);

// Get user orders 
router.get("/", orderController.getUserOrders)


export default router;