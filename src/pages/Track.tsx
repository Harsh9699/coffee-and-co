import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, Search, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Track() {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setStatus(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', trackingId)
        .single();

      if (data) {
        setStatus(data);
      } else {
        setError("Order not found or invalid Tracking ID.");
      }
    } catch (err) {
      setError("Failed to fetch order status. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-outfit text-[#4A2C2A] flex flex-col items-center justify-center p-6">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-[#8C6246] hover:text-[#4A2C2A] transition-colors">
        <ArrowLeft size={20} /> Back to Store
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl text-center"
      >
        <div className="w-16 h-16 bg-[#D4A373]/20 text-[#8C6246] rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={32} />
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tight">Track Order</h1>
        <p className="text-[#8C6246] font-medium mb-8">Enter your Tracking ID below to see the current status of your coffee.</p>

        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="e.g. ORD-12345" 
            value={trackingId}
            onChange={e => setTrackingId(e.target.value)}
            className="w-full bg-[#FAF6F0] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8C6246] outline-none text-[#4A2C2A] font-bold text-center text-xl placeholder-[#4A2C2A]/30"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#4A2C2A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2D1A19] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Track Now"}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-red-500 font-bold bg-red-50 p-4 rounded-xl">
            {error}
          </motion.div>
        )}

        {status && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 bg-[#FAF6F0] p-6 rounded-[2rem] text-left border border-[#8C6246]/20 relative overflow-hidden">
            <p className="text-xs font-bold text-[#8C6246] uppercase tracking-widest mb-1">Order Details</p>
            <h2 className="text-xl font-black mb-4">{status.product}</h2>
            
            <div className="flex items-center gap-3">
              {status.status === 'Pending' && <Clock className="text-yellow-500" size={24} />}
              {status.status === 'Accepted' && <CheckCircle2 className="text-green-500" size={24} />}
              {status.status === 'Rejected' && <XCircle className="text-red-500" size={24} />}
              
              <div>
                <p className="font-bold text-lg leading-none">{status.status}</p>
                <p className="text-sm font-medium text-[#4A2C2A]/60">
                  {status.status === 'Pending' ? "We are reviewing your order." : 
                   status.status === 'Accepted' ? "Your order is being prepared!" : 
                   "Unfortunately, we could not process this order."}
                </p>
              </div>
            </div>
            <Coffee className="absolute -right-6 -bottom-6 w-32 h-32 text-[#8C6246]/5 pointer-events-none" />
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
