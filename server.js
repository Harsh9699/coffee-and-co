import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const DB_PATH = path.join(__dirname, 'orders.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

const getOrders = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveOrders = (orders) => fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2));

// Admin Authentication Middleware
const requireAdmin = (req, res, next) => {
  const pin = req.headers.authorization;
  if (pin !== ADMIN_PIN) {
    return res.status(401).json({ error: 'Unauthorized. Invalid PIN.' });
  }
  next();
};

// --- CUSTOMER ROUTES ---

// Create Order
app.post('/api/orders', (req, res) => {
  const { name, email, address, product } = req.body;
  
  if (!name || !email || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder = {
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000), // e.g. ORD-12345
    name,
    email,
    address,
    product: product || 'Custom Order',
    status: 'Pending', // Pending, Accepted, Rejected
    createdAt: new Date().toISOString()
  };

  const orders = getOrders();
  orders.push(newOrder);
  saveOrders(orders);

  res.json({ success: true, trackingId: newOrder.id });
});

// Track Order
app.get('/api/orders/:id', (req, res) => {
  const orders = getOrders();
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Don't leak all info to public tracking, just basics
  res.json({
    id: order.id,
    product: order.product,
    status: order.status,
    createdAt: order.createdAt
  });
});

// --- ADMIN ROUTES ---

// Get all orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  res.json(getOrders());
});

// Update order status
app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = getOrders();
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index].status = status;
  saveOrders(orders);

  res.json({ success: true, order: orders[index] });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
