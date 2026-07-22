import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Store from './pages/Store';
import Track from './pages/Track';
import Admin from './pages/Admin';
import MyOrders from './pages/MyOrders';
import Preloader from './components/Preloader';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scrolling while the preloader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <BrowserRouter>
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/track" element={<Track />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
