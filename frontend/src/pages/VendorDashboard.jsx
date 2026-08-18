import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getDishEmoji } from './Menu';
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  Plus, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Coffee, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu
  
  // Modals state
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null means adding a new item
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rice Dishes',
    image: '',
    isAvailable: true,
  });

  const fetchDashboardData = async () => {
    setErrorMsg('');
    setLoadingOrders(true);
    setLoadingMenu(true);
    
    // Fetch orders received containing vendor items
    try {
      const ordersRes = await API.get('/orders/vendor-orders');
      if (ordersRes.data && ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load orders. Make sure backend is active.');
    } finally {
      setLoadingOrders(false);
    }

    // Fetch vendor menu items
    try {
      const menuRes = await API.get('/menu'); // Later, we filter by vendor on server or frontend, menu Controller supports fetching all but we can extract those owned by current user.
      if (menuRes.data && menuRes.data.success) {
        setMenuItems(menuRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load menu items.');
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = { status: newStatus };
      if (newStatus === 'delivered') {
        payload.paymentStatus = 'completed';
      }
      
      const res = await API.put(`/orders/${orderId}/status`, payload);
      if (res.data && res.data.success) {
        setSuccessMsg(`Order updated to '${newStatus}'!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        // Refresh orders list
        const updatedOrdersRes = await API.get('/orders/vendor-orders');
        setOrders(updatedOrdersRes.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Toggle Item Availability
  const handleToggleAvailability = async (item) => {
    setErrorMsg('');
    try {
      const res = await API.put(`/menu/${item._id}`, { isAvailable: !item.isAvailable });
      if (res.data && res.data.success) {
        setMenuItems((prev) => 
          prev.map(m => m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m)
        );
      }
    } catch (err) {
      setErrorMsg('Failed to update dish availability.');
    }
  };

  // Delete Menu Item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this dish from the menu?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await API.delete(`/menu/${itemId}`);
      if (res.data && res.data.success) {
        setSuccessMsg('Dish deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        setMenuItems((prev) => prev.filter(m => m._id !== itemId));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete dish.');
    }
  };

  // Open modal for new item
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Rice Dishes',
      image: '',
      isAvailable: true,
    });
    setMenuModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      isAvailable: item.isAvailable,
    });
    setMenuModalOpen(true);
  };

  // Submit Menu Item form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { name, description, price, category, image, isAvailable } = formData;
    if (!name || !description || !price || !category) {
      setErrorMsg('Please fill in name, category, description, and price.');
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      isAvailable,
    };

    try {
      if (editingItem) {
        // Edit mode
        const res = await API.put(`/menu/${editingItem._id}`, payload);
        if (res.data && res.data.success) {
          setSuccessMsg('Dish updated successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
          setMenuItems(prev => prev.map(m => m._id === editingItem._id ? res.data.data : m));
        }
      } else {
        // Add mode
        const res = await API.post('/menu', payload);
        if (res.data && res.data.success) {
          setSuccessMsg('New dish added to menu!');
          setTimeout(() => setSuccessMsg(''), 3000);
          setMenuItems(prev => [...prev, res.data.data]);
        }
      }
      setMenuModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save dish.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Calculations for Stats (calculated based on orders owned by this vendor)
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const revenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.vendorSubtotal || 0), 0);
  
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Alert boxes */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500">
          <CheckCircle className="h-5 w-5" />
          <span className="font-bold text-sm">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm mb-6 max-w-lg">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-green-dark">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage local menus, coordinate preparations, and track revenue flows.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-brand-green border border-orange-100 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100/50">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Vendor Revenue</span>
            <span className="text-2xl font-black text-brand-green-dark">₦{revenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-brand-orange/5 rounded-2xl text-brand-orange border border-brand-orange/15">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Total Orders</span>
            <span className="text-2xl font-black text-brand-green-dark">{orders.length} orders</span>
          </div>
        </div>

        {/* Active Prep Queue */}
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 rounded-2xl text-brand-gold-dark border border-orange-100">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 block uppercase">Prep & Ship Queue</span>
            <span className="text-2xl font-black text-brand-green-dark">{pendingCount} active</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-orange-100 mb-8 gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${
            activeTab === 'orders'
              ? 'text-brand-green border-b-2 border-brand-green'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Orders Received ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${
            activeTab === 'menu'
              ? 'text-brand-green border-b-2 border-brand-green'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Menu Manager ({menuItems.length})
        </button>
      </div>

      {/* ORDERS TAB PANEL */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-brand-green animate-spin" />
              <p className="text-gray-500 text-sm font-bold">Fetching customer orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-orange-200 rounded-3xl space-y-3">
              <span className="text-5xl">🛒</span>
              <h3 className="text-xl font-bold text-brand-green-dark">No Orders Received</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Customer purchases involving your dishes will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {orders.map((order) => {
                const isActiveOrder = order.status !== 'delivered' && order.status !== 'cancelled';
                const isCancelled = order.status === 'cancelled';

                return (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Order Details Column (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Top Header */}
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b border-orange-50 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400">Order Ref:</span>
                            <span className="text-sm font-black text-gray-700 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              order.status === 'preparing' ? 'bg-orange-100 text-brand-orange-dark' :
                              order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer Details</span>
                          <span className="text-xs font-bold text-gray-700">{order.customer?.name || 'Guest User'}</span>
                        </div>
                      </div>

                      {/* Items Listing */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Purchased Dishes</span>
                        <div className="bg-gray-50 border border-orange-100/70 rounded-xl p-3 divide-y divide-orange-100/50">
                          {order.items.map((item) => (
                            <div key={item._id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <span>{getDishEmoji(item.foodItem?.name || '', item.foodItem?.category || '')}</span>
                                <span className="font-bold text-gray-800">{item.foodItem?.name || 'Deleted dish'}</span>
                              </div>
                              <span className="font-bold text-gray-500">{item.quantity} x ₦{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address & phone details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 bg-orange-50/20 p-3 rounded-xl border border-orange-100/40">
                        <div>
                          <span className="font-bold block text-gray-400 text-[9px] uppercase tracking-wider">Address</span>
                          <span>{order.deliveryAddress}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-gray-400 text-[9px] uppercase tracking-wider">Phone</span>
                          <span>{order.deliveryPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Action Controllers (lg:col-span-4) */}
                    <div className="lg:col-span-4 bg-orange-50/20 rounded-2xl border border-orange-100/70 p-5 flex flex-col justify-between space-y-4">
                      {/* Price breakdown */}
                      <div className="space-y-1 bg-white p-3 rounded-xl border border-orange-50 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Earnings Subtotal</span>
                        <span className="text-2xl font-black text-brand-green">₦{order.vendorSubtotal?.toLocaleString()}</span>
                        <p className="text-[9px] text-gray-400">Total Order Amount: ₦{order.totalAmount.toLocaleString()}</p>
                      </div>

                      {/* Status Action Loops */}
                      <div className="space-y-2">
                        {isActiveOrder && (
                          <>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                              >
                                <Check className="h-4 w-4" /> Start Preparing
                              </button>
                            )}

                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                              >
                                <Package className="h-4 w-4" /> Dispatch Order
                              </button>
                            )}

                            {order.status === 'out_for_delivery' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                              >
                                <CheckCircle className="h-4 w-4" /> Complete Handover
                              </button>
                            )}

                            {/* Cancel Order Action */}
                            {(order.status === 'pending' || order.status === 'preparing') && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex justify-center items-center gap-1"
                              >
                                <X className="h-4 w-4" /> Decline & Cancel
                              </button>
                            )}
                          </>
                        )}

                        {order.status === 'delivered' && (
                          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Finished Order
                          </div>
                        )}

                        {isCancelled && (
                          <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center text-xs text-red-800 font-bold flex items-center justify-center gap-1">
                            <X className="h-4.5 w-4.5 text-red-600" /> Cancelled Order
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MENU TAB PANEL */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Action Trigger */}
          <div className="flex justify-between items-center border-b border-orange-100 pb-4">
            <h2 className="text-xl font-bold text-brand-green-dark">Dish Catalogue</h2>
            <button
              onClick={openAddModal}
              className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Upload New Dish
            </button>
          </div>

          {loadingMenu ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-brand-green animate-spin" />
              <p className="text-gray-500 text-sm font-bold">Retrieving menu items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-orange-200 rounded-3xl space-y-3">
              <span className="text-5xl">🥘</span>
              <h3 className="text-xl font-bold text-brand-green-dark">Your Menu is Empty</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto font-semibold">
                Click 'Upload New Dish' to begin listing items (Jollof Rice, Swallow delicacies) to customers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {menuItems.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Emojis banner representation */}
                    <div className="h-36 bg-gradient-to-br from-orange-50 to-orange-100/40 flex items-center justify-center text-6xl select-none relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        getDishEmoji(item.name, item.category)
                      )}
                      
                      <span className="absolute top-2 left-2 bg-white/90 text-brand-green text-[9px] font-extrabold uppercase px-2 py-1 rounded border border-orange-100">
                        {item.category}
                      </span>
                    </div>

                    {/* Meta details */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-bold text-brand-green-dark leading-tight">{item.name}</h3>
                        <span className="font-black text-brand-green text-sm">₦{item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Settings / Controls footer */}
                  <div className="px-4 py-3 bg-gray-50/50 border-t border-orange-50 flex justify-between items-center">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className="flex items-center gap-1 text-[11px] font-bold text-gray-500"
                      title={item.isAvailable ? 'Deactivate Listing' : 'Activate Listing'}
                    >
                      {item.isAvailable ? (
                        <>
                          <ToggleRight className="h-6 w-6 text-brand-green" />
                          <span className="text-brand-green">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-6 w-6 text-gray-300" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-white hover:bg-orange-50 border border-orange-100 p-2 rounded-lg text-gray-500 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-white hover:bg-red-50 border border-red-100 p-2 rounded-lg text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT DISH MODAL */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-slide-up border border-orange-100">
            <div className="p-6 bg-brand-green text-white flex justify-between items-center">
              <h3 className="font-extrabold text-lg">{editingItem ? 'Edit Dish Details' : 'Upload New Dish'}</h3>
              <button 
                onClick={() => setMenuModalOpen(false)} 
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Dish Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Jollof Rice with Fried Chicken"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Menu Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                >
                  <option value="Rice Dishes">Rice Dishes</option>
                  <option value="Soups">Soups</option>
                  <option value="Swallows">Swallows</option>
                  <option value="Grills & Sides">Grills & Sides</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Price (₦ Naira)</label>
                <input
                  name="price"
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                />
              </div>

              {/* Image URL (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Image URL (Optional)</label>
                <input
                  name="image"
                  type="url"
                  placeholder="e.g. https://domain.com/photo.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description & Ingredients</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  placeholder="e.g. Traditional Jollof cooked in tomato sauce, served with ripe fried plantain (dodo) and grilled chicken leg..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                />
              </div>

              {/* Available checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="isAvailable"
                  name="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded text-brand-green focus:ring-brand-green border-orange-100"
                />
                <label htmlFor="isAvailable" className="text-xs font-bold text-gray-600 uppercase select-none">
                  Available for Customer Ordering
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="flex-1 border border-orange-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs hover:bg-orange-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-green hover:bg-brand-green-light text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
