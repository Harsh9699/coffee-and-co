import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, ArrowRight, Coffee, Droplets, Leaf, X, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollCanvas from '../components/ScrollCanvas';

const PRODUCTS = [
  {
    id: 1,
    name: "Dark Truffle Mocha",
    price: "₹200",
    desc: "Double shot espresso pulled over 70% dark artisan chocolate.",
    image: "/products/dark_truffle.jpeg",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Caramel Cloud Macchiato",
    price: "₹400",
    desc: "Vanilla bean, steamed milk, and a rich, buttery caramel drizzle.",
    image: "/products/caramel_cloud.jpeg",
    tag: "Sweet"
  },
  {
    id: 3,
    name: "Hazelnut Praline Latte",
    price: "₹600",
    desc: "Warm roasted hazelnut infused with our signature house blend.",
    image: "/products/hazelnut_praline.jpeg",
    tag: "Nutty"
  },
];

const FEATURES = [
  {
    icon: Droplets,
    title: "Velvety Texture",
    desc: "We temper our chocolate to perfectly meld with steamed milk, creating a heavenly mouthfeel."
  },
  {
    icon: Coffee,
    title: "Artisan Roast",
    desc: "Sourced from high-altitude farms for a smooth, acid-free finish that pairs perfectly with cocoa."
  },
  {
    icon: Leaf,
    title: "Organic Cocoa",
    desc: "100% fair-trade, ethically sourced raw cocoa beans from the finest global estates."
  }
];

export default function Store() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openCheckout = (product: any = null) => {
    setSelectedProduct(product);
    setIsSuccess(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedProduct(null);
    }, 300);
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: dataObj.name,
          email: dataObj.email,
          address: dataObj.address,
          product: dataObj.Product
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTrackingId(data.trackingId);
        setIsSuccess(true);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      alert("Failed to submit order. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-outfit text-[#4A2C2A] selection:bg-[#4A2C2A] selection:text-[#FAF6F0] relative">
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919699213169" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:scale-110 hover:shadow-[0_15px_25px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center group"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 bg-white text-[#4A2C2A] px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us!
        </span>
      </a>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-40 transition-all duration-500 px-6 md:px-12 flex justify-between items-center ${
          isScrolled ? 'py-4 bg-[#FAF6F0]/90 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4A2C2A] rounded-full flex items-center justify-center text-[#FAF6F0]">
            <Coffee size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tight">COFFEE & CO.</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-wide">
          <a href="#" className="hover:text-[#8C6246] transition-colors">MENU</a>
          <a href="#" className="hover:text-[#8C6246] transition-colors">STORY</a>
          <Link to="/track" className="hover:text-[#8C6246] transition-colors">TRACK ORDER</Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => openCheckout()} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-105 transition-transform text-[#4A2C2A]">
            <ShoppingBag size={18} strokeWidth={2.5} />
          </button>
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-[#4A2C2A]">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Stage */}
      <section className="relative h-[600vh] bg-[#FAF6F0]">
        <ScrollCanvas />
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-1/4 -left-32 md:left-1/4 w-[30rem] h-[30rem] bg-[#D4A373]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 md:right-1/4 w-[30rem] h-[30rem] bg-[#8C6246]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="absolute w-full px-6 md:px-16 flex flex-col md:flex-row justify-between items-center md:items-end bottom-12 md:bottom-20 pointer-events-none z-20">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-black text-[#4A2C2A] leading-[0.95] tracking-tighter text-center md:text-left mb-6 md:mb-0"
            >
              SWEET &<br/>VELVETY
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-xs text-center md:text-right text-[#8C6246] font-medium text-sm md:text-base"
            >
              <p>Experience the ultimate fusion of rich roasted coffee and premium artisan chocolate.</p>
              <p className="mt-2 text-xs uppercase tracking-widest font-bold text-[#4A2C2A] flex items-center justify-center md:justify-end gap-2">
                Scroll to explore <ArrowRight size={14} />
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white relative z-20 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-30px_60px_rgba(74,44,42,0.05)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-[#4A2C2A] tracking-tight mb-4">Signature Blends</h2>
              <p className="text-[#8C6246] font-medium max-w-md">Crafted with precision, our signature beverages combine the world's finest cocoa with expertly pulled espresso.</p>
            </div>
            <button onClick={() => openCheckout()} className="bg-[#FAF6F0] text-[#4A2C2A] px-8 py-4 rounded-full font-bold hover:bg-[#F0E6D8] transition-colors border border-[#4A2C2A]/10 shadow-sm flex items-center gap-2">
              Order Now <ArrowRight size={18} />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                onClick={() => openCheckout(item)}
                className="bg-[#FAF6F0] rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-sm hover:shadow-[0_20px_40px_rgba(74,44,42,0.08)] transition-all cursor-pointer group"
              >
                <div className="w-full aspect-[4/5] rounded-[2rem] relative overflow-hidden shadow-inner group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-4 left-4 z-10 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {item.tag}
                  </div>
                  <motion.img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                
                <div className="px-2">
                  <h3 className="text-2xl font-bold text-[#4A2C2A] mb-2 leading-tight">{item.name}</h3>
                  <p className="text-[#8C6246] text-sm leading-relaxed mb-6 h-12">{item.desc}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-[#4A2C2A]/10">
                    <span className="text-2xl font-black text-[#4A2C2A]">{item.price}</span>
                    <button className="w-12 h-12 rounded-full bg-[#4A2C2A] text-white flex items-center justify-center group-hover:bg-[#8C6246] transition-colors shadow-md">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crafting Process */}
      <section className="py-24 md:py-32 bg-[#4A2C2A] text-[#FAF6F0] px-6 md:px-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2D1A19] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The Sweetest Journey</h2>
            <p className="text-[#D4A373] max-w-2xl mx-auto font-medium leading-relaxed">
              Every cup is a masterpiece. We meticulously source, roast, and craft our ingredients to deliver an unparalleled experience of sweetness and warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#5C3A21] flex items-center justify-center text-[#D4A373] mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                  <feature.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#FAF6F0]/70 leading-relaxed max-w-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Commerce Footer */}
      <footer className="bg-[#2D1A19] text-[#FAF6F0] py-16 px-6 md:px-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A2C2A]">
                <Coffee size={20} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">COFFEE & CO.</span>
            </div>
            <p className="text-white/60 font-medium max-w-sm mb-6 leading-relaxed">
              Serving the finest artisan coffee and premium chocolate blends. Order online and experience the magic.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/harsh_kukreja_18" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#4A2C2A] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://wa.me/919699213169" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-white/60 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 w-5 h-5 mt-0.5 text-[#D4A373]" />
                <span>343, Nanak nagar<br/>Sindhi colony<br/>Bhusawal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 w-5 h-5 text-[#D4A373]" />
                <span>+91 9699213169</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 w-5 h-5 text-[#D4A373]" />
                <span>hmkgamer190@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Policies</h4>
            <ul className="space-y-3 text-white/60 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center text-white/40 font-medium text-sm">
          <p>© 2026 Coffee & Co. All rights reserved.</p>
        </div>
      </footer>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={closeCheckout}
                className="absolute top-6 right-6 w-10 h-10 bg-[#FAF6F0] text-[#4A2C2A] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-20 cursor-pointer"
              >
                <X size={20} />
              </button>

              {isSuccess ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#D4A373]/20 text-[#8C6246] rounded-full flex items-center justify-center mb-6">
                    <Coffee size={40} strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-black text-[#4A2C2A] mb-4">Order Placed!</h3>
                  <p className="text-[#8C6246] font-medium leading-relaxed mb-4">
                    Your order is successfully placed!<br/>Thank you for visiting, we will process your order shortly.
                  </p>
                  <div className="bg-[#FAF6F0] px-6 py-3 rounded-xl mb-8">
                    <p className="text-sm font-bold text-[#4A2C2A]/60 uppercase tracking-widest mb-1">Your Tracking ID</p>
                    <p className="text-2xl font-black text-[#8C6246]">{trackingId}</p>
                  </div>
                  <button 
                    onClick={closeCheckout}
                    className="bg-[#4A2C2A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2D1A19] transition-colors w-full shadow-lg cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8 pr-12">
                    <h3 className="text-3xl font-black text-[#4A2C2A] tracking-tight mb-2">Complete Order</h3>
                    {selectedProduct ? (
                      <p className="text-[#8C6246] font-medium">Ordering: <strong className="text-[#4A2C2A]">{selectedProduct.name}</strong></p>
                    ) : (
                      <p className="text-[#8C6246] font-medium">Fill in your details to process your order.</p>
                    )}
                  </div>

                  <form onSubmit={handleOrderSubmit} className="flex flex-col gap-5 relative z-10">
                    <input type="hidden" name="Product" value={selectedProduct ? selectedProduct.name : "Custom Cart Order"} />
                    
                    <div>
                      <label className="block text-sm font-bold text-[#4A2C2A] mb-1.5 ml-1">Full Name</label>
                      <input required type="text" name="name" className="w-full bg-[#FAF6F0] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8C6246] outline-none text-[#4A2C2A] font-medium placeholder-[#4A2C2A]/30" placeholder="John Doe" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-[#4A2C2A] mb-1.5 ml-1">Email Address</label>
                      <input required type="email" name="email" className="w-full bg-[#FAF6F0] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8C6246] outline-none text-[#4A2C2A] font-medium placeholder-[#4A2C2A]/30" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#4A2C2A] mb-1.5 ml-1">Delivery Address</label>
                      <textarea required name="address" rows={3} className="w-full bg-[#FAF6F0] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8C6246] outline-none text-[#4A2C2A] font-medium placeholder-[#4A2C2A]/30 resize-none" placeholder="Enter your full shipping address..."></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="mt-4 bg-[#4A2C2A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2D1A19] transition-colors w-full shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : `Place Order ${selectedProduct ? `- ${selectedProduct.price}` : ''}`}
                    </button>
                    <p className="text-center text-xs font-medium text-[#4A2C2A]/40 mt-2">
                      Secure encrypted checkout
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
