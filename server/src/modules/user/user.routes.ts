import { Router } from 'express';
import { protectedRoute } from '../../middlewares/auth.middleware.js';
import { userController } from './user.controller.js';

const router = Router();

router.use(protectedRoute)

// Add address
router.post("/addresses", userController.addAddress);

// Get addresses
router.get("/addresses", userController.getAddress);

// Update address
router.put("/addresses/:addressId", userController.updateAddress);

// Delete address
router.delete("/addresses/:addressId", userController.deleteAddress);

// Add to wishlist
router.post("/wishlist", userController.addToWishlist);

// Remove from wishlist
router.delete("/wishlist", userController.removeFromWishlist);


export default router;