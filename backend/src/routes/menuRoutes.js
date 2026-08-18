import express from 'express';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('vendor'), createMenuItem);

router.route('/:id')
  .get(getMenuItem)
  .put(protect, authorize('vendor'), updateMenuItem)
  .delete(protect, authorize('vendor'), deleteMenuItem);

export default router;
