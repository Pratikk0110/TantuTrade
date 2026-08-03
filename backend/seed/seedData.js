require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const SupplierProfile = require('../models/SupplierProfile');
const Product = require('../models/Product');

const run = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), SupplierProfile.deleteMany({}), Product.deleteMany({})]);

  const suppliers = await User.create([
    { name: 'Rohan Textiles', email: 'supplier1@demo.com', password: 'password123', role: 'supplier' },
    { name: 'Vivaan Fabrics Co.', email: 'supplier2@demo.com', password: 'password123', role: 'supplier' },
  ]);

  await SupplierProfile.create([
    {
      user: suppliers[0]._id,
      businessName: 'Rohan Textiles',
      businessType: 'Manufacturer',
      contactInfo: 'contact@rohantextiles.demo',
      businessAddress: 'Bhiwandi, Maharashtra, India',
      operatingHours: 'Mon-Sat, 9:00 AM - 7:00 PM',
      productCategories: ['Cotton', 'Denim'],
      fabricTypesOffered: ['cotton', 'denim'],
      minimumOrderQuantity: '100 meters',
    },
    {
      user: suppliers[1]._id,
      businessName: 'Vivaan Fabrics Co.',
      businessType: 'Wholesaler',
      contactInfo: 'contact@vivaanfabrics.demo',
      businessAddress: 'Surat, Gujarat, India',
      operatingHours: 'Mon-Sat, 10:00 AM - 6:00 PM',
      productCategories: ['Silk', 'Chiffon', 'Velvet'],
      fabricTypesOffered: ['silk', 'chiffon', 'velvet'],
      minimumOrderQuantity: '50 meters',
    },
  ]);

  await User.create({ name: 'Demo Buyer', email: 'buyer@demo.com', password: 'password123', role: 'buyer' });

  const products = [
    { supplier: suppliers[0]._id, name: 'Premium Combed Cotton', category: 'Cotton', fabricType: 'cotton', description: '100% combed cotton, soft hand-feel, ideal for shirting.', colors: ['White', 'Sky Blue', 'Charcoal'], specifications: '150 GSM, 44" width', price: 180, stock: 500, moq: 100, featured: true, images: [] },
    { supplier: suppliers[0]._id, name: 'Heavy Denim Twill', category: 'Denim', fabricType: 'denim', description: 'Rugged 12oz denim twill for workwear and jeans.', colors: ['Indigo', 'Black'], specifications: '340 GSM, 58" width', price: 320, stock: 300, moq: 150, featured: true, images: [] },
    { supplier: suppliers[0]._id, name: 'Organic Cotton Poplin', category: 'Cotton', fabricType: 'cotton', description: 'GOTS-certified organic poplin for premium apparel.', colors: ['Off-White', 'Pastel Pink'], specifications: '120 GSM, 44" width', price: 240, stock: 8, moq: 100, images: [] },
    { supplier: suppliers[1]._id, name: 'Mulberry Silk Satin', category: 'Silk', fabricType: 'silk', description: 'Luxurious mulberry silk satin with a lustrous finish.', colors: ['Ivory', 'Emerald', 'Ruby Red'], specifications: '22 Momme, 44" width', price: 950, stock: 120, moq: 50, featured: true, images: [] },
    { supplier: suppliers[1]._id, name: 'Georgette Chiffon', category: 'Chiffon', fabricType: 'chiffon', description: 'Lightweight flowing chiffon, perfect for eveningwear.', colors: ['Blush', 'Navy', 'Mustard'], specifications: '60 GSM, 44" width', price: 210, stock: 0, moq: 50, images: [] },
    { supplier: suppliers[1]._id, name: 'Crushed Velvet', category: 'Velvet', fabricType: 'velvet', description: 'Rich crushed velvet with deep color saturation.', colors: ['Wine', 'Forest Green', 'Black'], specifications: '280 GSM, 52" width', price: 480, stock: 90, moq: 50, featured: true, images: [] },
    { supplier: suppliers[0]._id, name: 'Stretch Cotton Lycra', category: 'Cotton', fabricType: 'cotton', description: 'Cotton-lycra blend with 4-way stretch for activewear.', colors: ['Black', 'Grey Melange'], specifications: '220 GSM, 60" width', price: 260, stock: 200, moq: 100, images: [] },
    { supplier: suppliers[1]._id, name: 'Raw Silk Dupioni', category: 'Silk', fabricType: 'silk', description: 'Textured raw silk dupioni with natural slubs.', colors: ['Champagne', 'Teal'], specifications: '90 GSM, 44" width', price: 720, stock: 60, moq: 50, images: [] },
  ];

  await Product.create(products);

  console.log('Seed complete.');
  console.log('Demo logins: supplier1@demo.com / supplier2@demo.com / buyer@demo.com (password: password123)');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
