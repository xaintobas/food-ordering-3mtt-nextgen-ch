import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Sparkles, Truck, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark to-brand-green py-24 text-white">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left animate-slide-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-orange text-orange-50 uppercase tracking-widest">
                <Sparkles className="h-3 w-3 animate-spin" /> Capstone Project App
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans leading-tight">
                Authentic <span className="text-brand-gold">Nigerian Delicacies</span>, Served Fresh
              </h1>
              
              <p className="text-base sm:text-lg text-orange-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                From sizzling hot Jollof Rice and aromatic Egusi soup to tender Peppered Meat and soft Swallows. We give local vendors the digital ordering tools they need to reach you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Order Now <ArrowRight className="h-5 w-5" />
                </Link>
                
                <Link
                  to="/register?role=vendor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 backdrop-blur-md cursor-pointer"
                >
                  Join as Vendor
                </Link>
              </div>
            </div>

            {/* Right Graphic/Illustration */}
            <div className="flex justify-center relative animate-fade-in delay-200">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-4 border-brand-gold/30 bg-orange-100/10 flex items-center justify-center shadow-2xl p-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-gold rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                <span className="text-[120px] sm:text-[180px] drop-shadow-xl select-none animate-pulse-subtle">
                  🍛
                </span>
                
                {/* Floating bubbles */}
                <div className="absolute -top-4 -left-4 bg-white/95 p-3 rounded-2xl shadow-lg text-gray-800 flex items-center gap-2 border border-orange-100">
                  <span className="text-xl">🔥</span>
                  <div className="text-[10px] leading-tight font-bold text-left">
                    <p className="text-gray-900">Spicy Suya</p>
                    <p className="text-brand-orange">Ready to Go</p>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-4 bg-white/95 p-3 rounded-2xl shadow-lg text-gray-800 flex items-center gap-2 border border-orange-100">
                  <span className="text-xl">🥘</span>
                  <div className="text-[10px] leading-tight font-bold text-left">
                    <p className="text-gray-900">Egusi & Semo</p>
                    <p className="text-brand-green">Hot Seller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Columns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-green-dark">
              Supporting Our Local Food Ecosystem
            </h2>
            <div className="h-1.5 w-24 bg-brand-orange mx-auto rounded-full"></div>
            <p className="text-gray-600 leading-relaxed">
              We empower street vendors, local bukhas, and home caterers with professional, modern ordering pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-orange-50/30 p-8 rounded-2xl border border-orange-100 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brand-orange/10 p-4 rounded-full text-brand-orange">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark">Verified Local Chefs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dishes prepared by local vendors cooking with authentic recipes handed down generations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-orange-50/30 p-8 rounded-2xl border border-orange-100 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brand-green/10 p-4 rounded-full text-brand-green">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark">Rapid Hub Dispatch</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders are piped immediately to the vendor, cooking starts, and courier gets it to you fresh and hot.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-orange-50/30 p-8 rounded-2xl border border-orange-100 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brand-gold/10 p-4 rounded-full text-brand-gold-dark">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark">Safe Digital Pipeline</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Verify accounts and securely trace order statuses from prep to doorstep handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Promo CTA */}
      <section className="bg-orange-50 border-y border-orange-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-brand-green-dark">Hungry? Explore Our Spice Trails</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Browse through categories including Rice, Soups, Swallows, Grills, and ice-cold Drinks.
          </p>
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Browse Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
