import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    image: {
      type: String,
      default: '', // Will hold imageUrl or base64
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Swallows', 'Soups', 'Rice Dishes', 'Grills & Sides', 'Drinks'],
      default: 'Rice Dishes',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
