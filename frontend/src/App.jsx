import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistantWidget from './components/AIAssistantWidget';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import BuyerOnboarding from './pages/buyer/BuyerOnboarding';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

import SupplierOnboarding from './pages/supplier/SupplierOnboarding';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import Inventory from './pages/supplier/Inventory';
import Orders from './pages/supplier/Orders';
import SupplierProfile from './pages/supplier/SupplierProfile';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<ProtectedRoute role="buyer"><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>} />
          <Route path="/buyer/onboarding" element={<ProtectedRoute role="buyer"><BuyerOnboarding /></ProtectedRoute>} />
          <Route path="/buyer/dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />

          <Route path="/supplier/onboarding" element={<ProtectedRoute role="supplier"><SupplierOnboarding /></ProtectedRoute>} />
          <Route path="/supplier/dashboard" element={<ProtectedRoute role="supplier"><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/supplier/inventory" element={<ProtectedRoute role="supplier"><Inventory /></ProtectedRoute>} />
          <Route path="/supplier/orders" element={<ProtectedRoute role="supplier"><Orders /></ProtectedRoute>} />
          <Route path="/supplier/profile" element={<ProtectedRoute role="supplier"><SupplierProfile /></ProtectedRoute>} />

          <Route path="*" element={<div className="max-w-2xl mx-auto px-6 py-24 text-center font-display text-2xl">Page not found</div>} />
        </Routes>
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}

export default App;
