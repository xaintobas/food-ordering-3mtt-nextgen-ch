import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getDishEmoji } from './Menu';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pre-fill user data when user changes or loads
  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.isVerified) {
      setError('Please verify your email address to place orders. A verification link was sent to your inbox.');
      return;
    }

    if (!address || !phone) {
      setError('Please specify both a delivery address and contact phone number.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          foodItem: item.foodItem._id,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
        deliveryPhone: phone,
        paymentMethod,
      };

      const res = await API.post('/orders', orderPayload);
      if (res.data && res.data.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <span className="text-6xl animate-pulse">🛒</span>
        <h2 className="text-3xl font-extrabold text-brand-green-dark">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Add some spicy local delicacies like Jollof Rice or Semovita to your basket.
        </p>
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-green-light text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            Browse Menu <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-brand-green-dark mb-10">Your Basket Checkout</h1>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-3xl max-w-xl mx-auto text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black">Order Placed Successfully!</h2>
          <p className="text-sm">Connecting with kitchen hubs. Redirecting to your tracking dashboard...</p>
        </div>
      )}

      {!success && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-orange-50/50 border-b border-orange-100 font-bold text-brand-green-dark text-sm">
                Item Details ({cartItems.length} dish types)
              </div>
              <div className="divide-y divide-orange-100">
                {cartItems.map((item) => (
                  <div key={item.foodItem._id} className="p-4 sm:p-5 flex gap-4 items-center">
                    {/* Emojis representation */}
                    <div className="w-16 h-16 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl shrink-0">
                      {item.foodItem.image ? (
                        <img src={item.foodItem.image} alt={item.foodItem.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        getDishEmoji(item.foodItem.name, item.foodItem.category)
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-brand-green-dark truncate">{item.foodItem.name}</h4>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider pt-0.5">{item.foodItem.category}</p>
                      <p className="text-sm font-black text-brand-green pt-1">₦{item.foodItem.price.toLocaleString()}</p>
                    </div>

                    {/* Adjusters */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-2 bg-orange-50 px-2.5 py-1.5 rounded-xl border border-orange-100/70 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.foodItem._id, item.quantity - 1)}
                          className="p-0.5 rounded-md text-gray-500 hover:bg-orange-100 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs w-4 text-center text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.foodItem._id, item.quantity + 1)}
                          className="p-0.5 rounded-md text-gray-500 hover:bg-orange-100 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.foodItem._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-all cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary & Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-orange-100 shadow-xl p-6 space-y-6">
              <h3 className="text-lg font-black text-brand-green-dark border-b border-orange-50 pb-3">Checkout Details</h3>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Delivery Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Detailed Delivery Address</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide street names, apartment number, and close landmarks..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`text-center py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm'
                          : 'border-orange-100 text-gray-600 hover:bg-orange-50/50'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`text-center py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm'
                          : 'border-orange-100 text-gray-600 hover:bg-orange-50/50'
                      }`}
                    >
                      Pay Online (Mockup)
                    </button>
                  </div>
                </div>

                {/* Order Cost Breakdown */}
                <div className="pt-4 border-t border-orange-50 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">₦{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-dashed border-orange-100">
                    <span className="text-base font-bold text-brand-green-dark">Grand Total</span>
                    <span className="text-xl font-black text-brand-green">₦{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Submission Action */}
                <div className="pt-4">
                  {user && !user.isVerified ? (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-xs flex gap-2 items-start leading-relaxed">
                      <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
                      <span>Order actions are disabled. Check your inbox to verify your email, then reload this page.</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex justify-center items-center gap-1.5 disabled:opacity-75"
                    >
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="h-4.5 w-4.5" /> Place Order
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
