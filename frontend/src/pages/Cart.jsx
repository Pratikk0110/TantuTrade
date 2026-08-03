import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

export default function Cart() {
  const { cart, refreshCart, updateItem, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => { refreshCart(); }, [refreshCart]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/50 mb-6">Browse the marketplace to find fabrics for your next order.</p>
        <Link to="/marketplace" className="bg-ink text-canvas px-6 py-3 rounded-full font-medium">Browse fabrics</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Your cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-white border border-ink/10 rounded-xl p-4">
            <div className="w-16 h-16 rounded-lg bg-canvas-dim shrink-0" />
            <div className="flex-1">
              <p className="font-display font-semibold text-ink">{item.product?.name}</p>
              <p className="text-xs font-mono text-ink/40">₹{item.product?.price}/{item.product?.unit}</p>
            </div>
            <input type="number" min={1} value={item.quantity}
              onChange={(e) => updateItem(item._id, Number(e.target.value))}
              className="w-20 border border-ink/20 rounded-lg px-2 py-2 font-mono text-sm" />
            <p className="font-mono w-24 text-right">₹{(item.quantity * (item.product?.price || 0)).toLocaleString()}</p>
            <button onClick={() => removeItem(item._id)} className="text-ink/30 hover:text-thread-red">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-dashed border-ink/20 pt-6">
        <div>
          <p className="text-sm text-ink/50">Subtotal</p>
          <p className="font-mono text-2xl text-ink">₹{subtotal.toLocaleString()}</p>
        </div>
        <button onClick={() => navigate('/checkout')} className="bg-ink text-canvas px-8 py-3 rounded-full font-medium hover:bg-ink-soft">
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
