import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coffee, Search, CheckCircle2, Clock, XCircle, ArrowLeft, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const savedOrders = localStorage.getItem('coffee_orders');
        if (!savedOrders) {
          setLoading(false);
          return;
        }

        const orderIds = JSON.parse(savedOrders);
        if (orderIds.length === 0) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .in('id', orderIds)
          .order('created_at', { ascending: false });

        if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch my orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-outfit text-[#4A2C2A] flex flex-col items-center justify-start pt-24 md:pt-12 p-6 relative">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 font-bold text-[#8C6246] hover:text-[#4A2C2A] transition-colors">
        <ArrowLeft size={20} /> Back to Store
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">My Orders</h1>
            <p className="text-[#8C6246] font-medium">Your recent coffee history.</p>
          </div>
          <div className="w-16 h-16 bg-[#D4A373]/20 text-[#8C6246] rounded-full flex items-center justify-center hidden md:flex">
            <PackageSearch size={32} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#8C6246] font-bold">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm text-center">
            <Coffee className="w-20 h-20 text-[#D4A373]/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet!</h2>
            <p className="text-[#8C6246] mb-8">You haven't placed any orders on this device.</p>
            <Link to="/" className="bg-[#4A2C2A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2D1A19] transition-colors shadow-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-[#8C6246]/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden"
              >
                <div className="z-10 relative">
                  <p className="text-sm font-bold text-[#8C6246] uppercase tracking-widest mb-1">{order.id}</p>
                  <h3 className="text-xl md:text-2xl font-black mb-2 max-w-md leading-tight">{order.product}</h3>
                  <p className="text-sm text-[#4A2C2A]/60 font-medium">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF6F0] px-5 py-3 rounded-xl border border-[#8C6246]/10 z-10 relative">
                  {order.status === 'Pending' && <Clock className="text-yellow-500" size={24} />}
                  {order.status === 'Accepted' && <CheckCircle2 className="text-green-500" size={24} />}
                  {order.status === 'Rejected' && <XCircle className="text-red-500" size={24} />}
                  
                  <div>
                    <p className="font-bold text-lg leading-none">{order.status}</p>
                  </div>
                </div>
                
                <Coffee className="absolute -right-8 -bottom-8 w-40 h-40 text-[#FAF6F0] pointer-events-none z-0" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
