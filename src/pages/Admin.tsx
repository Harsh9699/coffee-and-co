import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Settings, Check, X, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app we'd authenticate against Supabase auth. 
      // For now, if the PIN is "1234", we let them in.
      if (pin === "1234") {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) {
          setOrders(data);
          setIsAuthenticated(true);
        }
      } else {
        setError("Invalid PIN");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
        
      if (!error) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#2D1A19] flex items-center justify-center p-6 font-outfit">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Store
        </Link>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#FAF6F0] p-8 rounded-[2rem] w-full max-w-sm text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#4A2C2A] text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-black text-[#4A2C2A] mb-2">Admin Portal</h1>
          <p className="text-[#8C6246] font-medium text-sm mb-6">Enter your secret PIN to access the dashboard.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="••••" 
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full bg-white border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8C6246] outline-none text-[#4A2C2A] font-bold text-center text-2xl tracking-widest"
            />
            <button disabled={loading} className="bg-[#4A2C2A] text-white py-4 rounded-2xl font-bold hover:bg-[#2D1A19] transition-colors disabled:opacity-50">
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
          {error && <p className="text-red-500 font-bold mt-4 text-sm">{error}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-outfit text-[#4A2C2A] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4A2C2A] text-white rounded-xl flex items-center justify-center">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black">Dashboard</h1>
              <p className="text-[#8C6246] font-medium">Manage your incoming orders</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-all text-red-500">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm p-6 overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-[#8C6246] font-medium">
              No orders yet. They will appear here when customers check out.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#4A2C2A]/10 text-[#8C6246] text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Address</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-[#4A2C2A]/5 hover:bg-[#FAF6F0]/50 transition-colors">
                      <td className="p-4 font-black">{order.id}</td>
                      <td className="p-4">
                        <div className="font-bold">{order.name}</div>
                        <div className="text-sm text-[#8C6246]">{order.email}</div>
                      </td>
                      <td className="p-4 font-medium">{order.product}</td>
                      <td className="p-4 text-sm max-w-xs truncate" title={order.address}>{order.address}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            order.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <button onClick={() => updateStatus(order.id, 'Accepted')} className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Accept">
                              <Check size={18} />
                            </button>
                            <button onClick={() => updateStatus(order.id, 'Rejected')} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Reject">
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
