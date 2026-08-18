import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

// @desc    Create new order (Customer only)
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryPhone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ success: false, message: 'Please add delivery address and phone number' });
    }

    // Resolve items and calculate price from database directly (prevents price manipulation from client)
    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const dbFoodItem = await FoodItem.findById(item.foodItem);
      if (!dbFoodItem) {
        return res.status(404).json({ success: false, message: `Food item with ID ${item.foodItem} not found` });
      }

      if (!dbFoodItem.isAvailable) {
        return res.status(400).json({ success: false, message: `Food item ${dbFoodItem.name} is currently unavailable` });
      }

      const itemPrice = dbFoodItem.price;
      const quantity = parseInt(item.quantity, 10);
      
      totalAmount += itemPrice * quantity;
      
      resolvedItems.push({
        foodItem: dbFoodItem._id,
        quantity,
        price: itemPrice,
      });
    }

    const order = await Order.create({
      customer: req.user.id,
      items: resolvedItems,
      totalAmount,
      deliveryAddress,
      deliveryPhone,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      paymentStatus: 'pending',
      status: 'pending',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate({
        path: 'items.foodItem',
        select: 'name price image category',
        populate: {
          path: 'vendor',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vendor's orders (orders that contain their food items)
// @route   GET /api/orders/vendor-orders
// @access  Private/Vendor
export const getVendorOrders = async (req, res) => {
  try {
    // Find all items belonging to this vendor
    const vendorFoodItems = await FoodItem.find({ vendor: req.user.id });
    const vendorFoodItemIds = vendorFoodItems.map(item => item._id.toString());

    // Find orders that contain any of these items
    const orders = await Order.find({
      'items.foodItem': { $in: vendorFoodItemIds }
    })
      .populate('customer', 'name email phone address')
      .populate('items.foodItem', 'name price category vendor')
      .sort({ createdAt: -1 });

    // Filter items inside the order response so vendor only sees items that belong to them
    // (though in a single-vendor system or standard system, showing the order is fine,
    // let's map it so they see the entire order context but we flag which items are theirs)
    const customizedOrders = orders.map(order => {
      const vendorItems = order.items.filter(item => 
        item.foodItem && item.foodItem.vendor && item.foodItem.vendor.toString() === req.user.id
      );

      // Recalculate subtotal for this vendor's items (just in case multiple vendors are in one cart,
      // but usually orders are placed per vendor or processed in parts)
      const vendorSubtotal = vendorItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      return {
        _id: order._id,
        customer: order.customer,
        items: order.items,
        totalAmount: order.totalAmount,
        vendorSubtotal,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        deliveryPhone: order.deliveryPhone,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      };
    });

    res.status(200).json({ success: true, count: customizedOrders.length, data: customizedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Vendor only)
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    let order = await Order.findById(req.params.id).populate('items.foodItem');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify vendor owns at least one item in the order
    const ownsItem = order.items.some(item => 
      item.foodItem && item.foodItem.vendor && item.foodItem.vendor.toString() === req.user.id
    );

    if (!ownsItem) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status. This order does not contain your items.',
      });
    }

    const updates = {};
    if (status) {
      updates.status = status;
    }
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
      // Auto complete payment if delivered for COD
      if (status === 'delivered' && order.paymentMethod === 'cash_on_delivery') {
        updates.paymentStatus = 'completed';
      }
    }

    order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('customer', 'name email phone')
      .populate('items.foodItem', 'name price category');

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
