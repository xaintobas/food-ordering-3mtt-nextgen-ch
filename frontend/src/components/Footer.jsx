import React from 'react';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-green-dark text-orange-50 border-t border-brand-green-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>🍛</span> Naija Bite
            </h3>
            <p className="text-sm text-orange-100/70 leading-relaxed max-w-sm">
              Empowering local Nigerian culinary vendors with state-of-the-art ordering systems, connecting spicy cravings with local kitchens.
            </p>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-brand-gold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-orange-100/70">
              <li><a href="/menu" className="hover:text-brand-orange transition-colors">View Menu</a></li>
              <li><a href="/login" className="hover:text-brand-orange transition-colors">Vendor Login</a></li>
              <li><a href="/register?role=vendor" className="hover:text-brand-orange transition-colors">Become a Partner Vendor</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-brand-gold uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-2 text-sm text-orange-100/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-orange" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>+234 812 345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span>support@naijabite.ng</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-green-light/10 text-center text-xs text-orange-100/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Naija Bite. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-brand-orange fill-brand-orange animate-pulse" /> for local vendors in Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
