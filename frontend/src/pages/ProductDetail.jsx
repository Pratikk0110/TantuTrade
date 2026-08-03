import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import StatusBadge from '../components/StatusBadge';
import swatchColor from '../components/colorSwatches';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setQty(res.data.product.moq || 1);
    });
    api.get(`/products/${id}/similar`).then((res) => setSimilar(res.data.items));
  }, [id]);

  if (!product) return <p className="max-w-7xl mx-auto px-6 py-16 font-mono text-sm text-ink/40">Loading…</p>;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-xl bg-canvas-dim flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-sm text-ink/30">no image available</span>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">{product.category} · {product.fabricType}</p>
          <h1 className="font-display font-bold text-3xl text-ink mt-2">{product.name}</h1>
          <p className="text-ink/60 mt-3">{product.description}</p>

          <div className="mt-5"><StatusBadge status={product.status} /></div>

          <div className="mt-6 flex items-center gap-2">
            {(product.colors || []).map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <span className="swatch-dot" style={{ backgroundColor: swatchColor(c), width: 24, height: 24 }} />
                <span className="text-[10px] font-mono text-ink/50">{c}</span>
              </div>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm font-mono border-t border-dashed border-ink/20 pt-4">
            <dt className="text-ink/40">Specifications</dt><dd>{product.specifications || '—'}</dd>
            <dt className="text-ink/40">Available stock</dt><dd>{product.stock} {product.unit}</dd>
            <dt className="text-ink/40">MOQ</dt><dd>{product.moq} {product.unit}</dd>
            <dt className="text-ink/40">Supplier</dt><dd>{product.supplier?.name}</dd>
          </dl>

          <div className="mt-8 flex items-end gap-6">
            <span className="font-mono text-3xl text-ink">₹{product.price}<span className="text-ink/40 text-base">/{product.unit}</span></span>
          </div>

          {user?.role !== 'supplier' && product.status === 'available' && (
            <div className="mt-6 flex items-center gap-3">
              <input type="number" min={product.moq} value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-28 border border-ink/20 rounded-lg px-3 py-3 font-mono" />
              <button onClick={handleAddToCart} className="flex-1 bg-ink text-canvas rounded-lg py-3 font-medium hover:bg-ink-soft">
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display font-semibold text-xl text-ink mb-4">Similar fabrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
