import FoodItem from '../models/FoodItem.js';

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const { category, vendorId, availableOnly } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    const items = await FoodItem.find(query).populate('vendor', 'name email phone');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate('vendor', 'name email phone');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create menu item (Vendor only)
// @route   POST /api/menu
// @access  Private/Vendor
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable } = req.body;

    const newItem = await FoodItem.create({
      name,
      description,
      price,
      image: image || '',
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      vendor: req.user.id,
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item (Vendor only)
// @route   PUT /api/menu/:id
// @access  Private/Vendor
export const updateMenuItem = async (req, res) => {
  try {
    let item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Make sure user is the vendor who owns the item
    if (item.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item. You can only update items you created.',
      });
    }

    item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item (Vendor only)
// @route   DELETE /api/menu/:id
// @access  Private/Vendor
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Make sure user is the vendor who owns the item
    if (item.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item. You can only delete items you created.',
      });
    }

    await FoodItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Food item removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
