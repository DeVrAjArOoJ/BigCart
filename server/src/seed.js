import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere');
let admin = await User.findOne({ email: 'admin@shopsphere.local' });
if (!admin) {
  admin = await User.create({ name: 'Shop Admin', email: 'admin@shopsphere.local', password: await bcrypt.hash('Admin123!', 12), role: 'admin' });
  console.log('Demo admin created: admin@shopsphere.local / Admin123!');
} else console.log('Demo admin already exists; left unchanged.');
if (await Product.countDocuments() === 0) {
  await Product.insertMany([
    { name: 'Everyday Backpack', description: 'A durable everyday backpack with a padded laptop sleeve and roomy compartments.', price: 1499, category: 'Accessories', stock: 25, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80' },
    { name: 'Wireless Headphones', description: 'Comfortable over-ear headphones for work, travel, and daily listening.', price: 2299, category: 'Electronics', stock: 18, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' },
    { name: 'Classic Sneakers', description: 'Minimal sneakers designed for all-day comfort and versatile outfits.', price: 1999, category: 'Fashion', stock: 30, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
    { name: 'Ceramic Coffee Mug', description: 'A clean, sturdy ceramic mug for your morning coffee or tea.', price: 399, category: 'Home', stock: 50, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80' },
    { name: 'Smart Watch', description: 'A lightweight smartwatch-inspired fitness accessory for daily routines.', price: 3499, category: 'Electronics', stock: 12, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' },
    { name: 'Desk Lamp', description: 'A modern desk lamp that adds focused light to your study space.', price: 899, category: 'Home', stock: 20, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80' }
  ]);
  console.log('Sample products created.');
}
await mongoose.disconnect();
