import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getDishEmoji } from './Menu';
import { Clock, MapPin, Phone, RefreshCw, ChevronDown, ChevronUp, CheckCircle, Package, Truck, AlertTriangle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'preparing', label: 'Preparing', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Expanded Order IDs state to show details
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders/my-orders');
      if (res.data && res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setError('Could not load your orders. Make sure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Helper to find index of current status in ST_STEPS
  const getStatusIndex = (status) => {
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-orange-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-green-dark">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">Track active orders and review past delicious requests.</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1 bg-orange-50 border border-orange-100 text-brand-green px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-100/60 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20 space-y-3">
          <div className="h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Retrieving orders...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-6 rounded-2xl text-center">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-20 bg-white border border-dashed border-orange-200 rounded-3xl space-y-3">
          <span className="text-5xl">📦</span>
          <h3 className="text-xl font-bold text-brand-green-dark">No Orders Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            You haven't placed any food orders yet. Navigate to the Browse page to start ordering.
          </p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusIdx = getStatusIndex(order.status);
            const isCancelled = order.status === 'cancelled';
            const isExpanded = expandedOrders[order._id];

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden"
              >
                {/* Order Top Panel */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-orange-50/20 transition-all select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400">Order ID:</span>
                      <span className="text-sm font-black text-gray-700 font-mono">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      {isCancelled && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block uppercase font-bold">Total Amount</span>
                      <span className="text-lg font-black text-brand-green">₦{order.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="bg-orange-50 p-2 rounded-xl text-gray-500 border border-orange-100">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Progress Timeline Track (Always Visible for active orders unless expanded/cancelled) */}
                {!isCancelled && (
                  <div className="px-5 py-4 bg-orange-50/30 border-t border-orange-50">
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 relative">
                      {/* Central Line connecting steps */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-brand-green -translate-y-1/2 z-0 rounded-full transition-all duration-700"
                        style={{
                          width: `${(statusIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />

                      {STATUS_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isDone = idx <= statusIdx;
                        const isCurrent = idx === statusIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center relative z-10">
                            {/* Circle */}
                            <div
                              className={`h-9 w-9 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${
                                isCurrent
                                  ? 'bg-brand-orange border-brand-orange text-white scale-110 ring-4 ring-brand-orange/20 animate-pulse-subtle'
                                  : isDone
                                  ? 'bg-brand-green border-brand-green text-white'
                                  : 'bg-white border-gray-200 text-gray-400'
                              }`}
                            >
                              <StepIcon className="h-4.5 w-4.5" />
                            </div>
                            {/* Label */}
                            <span
                              className={`text-[9px] sm:text-xs font-bold mt-2 text-center leading-tight transition-colors ${
                                isCurrent
                                  ? 'text-brand-orange font-black'
                                  : isDone
                                  ? 'text-brand-green-dark'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="px-5 py-3.5 bg-red-50 border-t border-red-100 flex items-center gap-2 text-xs text-red-700">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>This order has been cancelled by the kitchen/shop. E-refund or COD release has been updated.</span>
                  </div>
                )}

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="p-5 border-t border-orange-100 bg-gray-50/50 space-y-5 animate-fade-in">
                    {/* Items List */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</h4>
                      <div className="bg-white rounded-xl border border-orange-100 overflow-hidden divide-y divide-orange-100">
                        {order.items.map((item) => (
                          <div key={item._id} className="p-3 flex items-center gap-3">
                            <span className="text-2xl select-none">
                              {getDishEmoji(item.foodItem?.name || '', item.foodItem?.category || '')}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-800 truncate">
                                {item.foodItem?.name || 'Deleted Dish'}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Prepared by: {item.foodItem?.vendor?.name || 'Local Kitchen'}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 font-semibold">{item.quantity} x ₦{item.price.toLocaleString()}</span>
                              <span className="block font-bold text-xs text-brand-green pt-0.5">
                                ₦{(item.quantity * item.price).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Address */}
                      <div className="bg-white p-3.5 rounded-xl border border-orange-100 flex items-start gap-2.5">
                        <MapPin className="h-4.5 w-4.5 text-brand-orange mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Address</span>
                          <span className="text-xs text-gray-700 leading-relaxed font-semibold">{order.deliveryAddress}</span>
                        </div>
                      </div>

                      {/* Contact phone */}
                      <div className="bg-white p-3.5 rounded-xl border border-orange-100 flex items-start gap-2.5">
                        <Phone className="h-4.5 w-4.5 text-brand-orange mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recipient Contact Phone</span>
                          <span className="text-xs text-gray-700 font-semibold">{order.deliveryPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta info bottom */}
                    <div className="flex flex-wrap gap-4 justify-between items-center text-xs pt-2 text-gray-500 border-t border-orange-100/50">
                      <div>
                        Payment Method: <span className="font-bold text-gray-700 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</span>
                      </div>
                      <div>
                        Payment Status: <span className={`font-bold uppercase ${order.paymentStatus === 'completed' ? 'text-emerald-600' : 'text-amber-500'}`}>{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
