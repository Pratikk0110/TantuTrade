import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const STEPS = ['Shipping', 'Review', 'Confirmation'];

export default function Checkout() {
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', state: '', postalCode: '', phone: '' });
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const res = await api.post('/orders', { shippingInfo: shipping });
      setOrder(res.data.order);
      await refreshCart();
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex gap-2 mb-10 font-mono text-xs uppercase tracking-wide">
        {STEPS.map((s, i) => (
          <span key={s} className={`px-3 py-1 rounded-full ${i === step ? 'bg-ink text-canvas' : 'bg-canvas-dim text-ink/40'}`}>{s}</span>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h1 className="font-display font-bold text-2xl text-ink mb-6">Shipping information</h1>
          <div className="space-y-4">
            {['fullName', 'address', 'city', 'state', 'postalCode', 'phone'].map((field) => (
              <input key={field} required placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={shipping[field]}
                onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron capitalize" />
            ))}
          </div>
          <button onClick={() => setStep(1)} disabled={!shipping.fullName || !shipping.address}
            className="mt-6 w-full bg-ink text-canvas rounded-lg py-3 font-medium disabled:opacity-40">
            Continue to review
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="font-display font-bold text-2xl text-ink mb-6">Review your order</h1>
          <div className="bg-white border border-ink/10 rounded-xl p-5 space-y-3 mb-6">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm font-mono">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>₹{(item.quantity * item.product?.price).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-ink/20 pt-3 flex justify-between font-mono font-semibold">
              <span>Total</span><span>₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-sm text-ink/60 mb-6">
            Shipping to {shipping.fullName}, {shipping.address}, {shipping.city}, {shipping.state} {shipping.postalCode}
          </div>
          {error && <p className="text-thread-red text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 border border-ink/20 rounded-lg py-3 font-medium">Back</button>
            <button onClick={placeOrder} disabled={placing} className="flex-1 bg-ink text-canvas rounded-lg py-3 font-medium disabled:opacity-50">
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && order && (
        <div className="text-center py-10">
          <h1 className="font-display font-bold text-3xl text-ink mb-3">Order confirmed 🎉</h1>
          <p className="text-ink/60 mb-2">Order ID: <span className="font-mono">{order._id}</span></p>
          <p className="text-ink/60 mb-8">Total: <span className="font-mono">₹{order.totalAmount.toLocaleString()}</span></p>
          <button onClick={() => navigate('/buyer/dashboard')} className="bg-ink text-canvas px-6 py-3 rounded-full font-medium">
            View my orders
          </button>
        </div>
      )}
    </div>
  );
}
