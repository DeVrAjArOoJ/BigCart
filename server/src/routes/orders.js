import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();

router.post('/', protect, async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Your cart is empty.' });
  if (!shippingAddress?.trim()) return res.status(400).json({ message: 'Shipping address is required.' });
  const orderItems = [];
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    const quantity = Number(item.quantity);
    if (!product) return res.status(400).json({ message: 'A product in your cart no longer exists.' });
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Invalid item quantity.' });
    if (product.stock < quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
    orderItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, quantity });
    total += product.price * quantity;
  }
  // Recheck/decrement stock at checkout. For a production store, use a transaction.
  for (const item of orderItems) {
    const updated = await Product.findOneAndUpdate({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } });
    if (!updated) return res.status(409).json({ message: `Stock changed for ${item.name}. Please try again.` });
  }
  const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress: shippingAddress.trim(), total });
  res.status(201).json({ order });
});
router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});
router.get('/', protect, adminOnly, async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ orders });
});
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const allowed = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status.' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order });
});
export default router;
