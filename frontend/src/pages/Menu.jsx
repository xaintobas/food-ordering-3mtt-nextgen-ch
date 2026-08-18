import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Plus, Minus, Info, X } from 'lucide-react';

const CATEGORIES = ['All', 'Rice Dishes', 'Soups', 'Swallows', 'Grills & Sides', 'Drinks'];

// Helper to resolve a beautiful representative emoji for a dish based on name/category
export const getDishEmoji = (name, category) => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('jollof') || lowercaseName.includes('fried rice') || lowercaseName.includes('rice')) {
    return '🍛';
  }
  if (lowercaseName.includes('soup') || lowercaseName.includes('egusi') || lowercaseName.includes('pepper') || lowercaseName.includes('okra')) {
    return '🍲';
  }
  if (lowercaseName.includes('suya') || lowercaseName.includes('meat') || lowercaseName.includes('chicken') || lowercaseName.includes('fish') || lowercaseName.includes('turkey')) {
    return '🥩';
  }
  if (lowercaseName.includes('yam') || lowercaseName.includes('eba') || lowercaseName.includes('semo') || lowercaseName.includes('swallow') || lowercaseName.includes('fufu')) {
    return '🥯';
  }
  if (lowercaseName.includes('puff') || lowercaseName.includes('akara') || lowercaseName.includes('plantain') || lowercaseName.includes('dodo')) {
    return '🍌';
  }
  
  // Category fallbacks
  if (category === 'Drinks') return '🥤';
  if (category === 'Swallows') return '🥯';
  if (category === 'Soups') return '🍲';
  if (category === 'Grills & Sides') return '🥩';
  
  return '🍽️';
};

const Menu = () => {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Success Notification state
  const [toastMessage, setToastMessage] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      // Fetch only available items for customer view
      const res = await API.get('/menu?availableOnly=true');
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      setError('Could not fetch the menu items. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddToCart = (item, quantity = 1) => {
    addToCart(item, quantity);
    setToastMessage(`Added ${quantity}x ${item.name} to cart!`);
    setTimeout(() => setToastMessage(''), 3000);
    setSelectedItem(null);
    setModalQuantity(1);
  };

  // Filter Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-green text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-brand-green-light">
          <ShoppingBag className="h-5 w-5 text-brand-gold animate-bounce" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-green-dark">Our Delicious Menu</h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Browse through fresh dishes cooked by verified local kitchen vendors. Select items to compile your order.
        </p>
      </div>

      {/* Filter and Search Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search Jollof, Egusi, Suya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 block w-full px-4 py-2.5 bg-white border border-orange-100 rounded-xl text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
          />
        </div>

        {/* Category Carousel / Scroll wrapper */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-brand-green text-white border-brand-green shadow-md'
                  : 'bg-white text-brand-green-dark border-orange-100 hover:bg-orange-50/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center py-20 space-y-3">
          <div className="h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Loading local delicacies...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
          <p className="font-bold text-lg">{error}</p>
          <button 
            onClick={fetchMenu} 
            className="bg-brand-orange text-white px-5 py-2 rounded-xl font-bold hover:bg-brand-orange-dark transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white border border-dashed border-orange-200 rounded-3xl max-w-xl mx-auto space-y-3">
          <span className="text-5xl">🥡</span>
          <h3 className="text-xl font-bold text-brand-green-dark">No Food Items Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Try adjusting your search filters or check back later as vendors upload new menu entries.
          </p>
        </div>
      )}

      {/* Menu Grid */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-orange-50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group hover:-translate-y-1"
            >
              {/* Image / Emojis Section */}
              <div className="h-48 bg-gradient-to-br from-orange-50 to-orange-100/50 flex items-center justify-center relative select-none">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                    {getDishEmoji(item.name, item.category)}
                  </span>
                )}
                
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-green text-[10px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg border border-orange-100 shadow-sm">
                  {item.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-extrabold text-brand-green-dark leading-snug group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-black text-brand-green shrink-0">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-orange-50 flex items-center justify-between">
                  <div className="text-[10px] text-gray-400">
                    Vendor: <span className="font-bold text-gray-600">{item.vendor?.name || 'Local Kitchen'}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-orange-50 text-brand-green p-2 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors"
                      title="View Details"
                    >
                      <Info className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(item, 1)}
                      className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-slide-up border border-orange-100 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-orange-100 text-gray-600 transition-colors shadow z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Banner */}
            <div className="h-52 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center relative">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">{getDishEmoji(selectedItem.name, selectedItem.category)}</span>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  {selectedItem.category}
                </span>
                <h2 className="text-2xl font-black text-brand-green-dark pt-1">{selectedItem.name}</h2>
                <div className="text-sm font-bold text-gray-500">
                  Prepared by: <span className="text-brand-green">{selectedItem.vendor?.name || 'Local Kitchen'}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed bg-orange-50/30 p-3 rounded-xl border border-orange-100/50">
                {selectedItem.description}
              </p>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-orange-100/55">
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Price</span>
                  <span className="text-2xl font-black text-brand-green">₦{selectedItem.price.toLocaleString()}</span>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-orange-100 shadow-sm">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="p-1 rounded-lg text-gray-500 hover:bg-orange-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-extrabold text-sm w-5 text-center text-gray-800">{modalQuantity}</span>
                  <button
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="p-1 rounded-lg text-gray-500 hover:bg-orange-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 border border-orange-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-orange-50/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddToCart(selectedItem, modalQuantity)}
                  className="flex-1 bg-brand-green hover:bg-brand-green-light text-white font-bold py-3 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="h-4.5 w-4.5" /> Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
