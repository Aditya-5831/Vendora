import { Router } from "express";
import { productController } from "./product.controller.js";

const router = Router();

// Get all products
router.get("/", productController.getAllProducts);

// Get single product 
router.get("/:productId", productController.getSingleProduct);

export default router;