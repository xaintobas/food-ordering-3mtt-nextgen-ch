import express from 'express';
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor'), updateOrderStatus);

export default router;
