import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Store from './pages/Store';
import Track from './pages/Track';
import Admin from './pages/Admin';
import MyOrders from './pages/MyOrders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/track" element={<Track />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
