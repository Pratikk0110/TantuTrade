import { Link } from 'react-router-dom';
import swatchColor from './colorSwatches';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white border border-dashed border-ink/25 rounded-xl p-4 hover:border-saffron transition-colors"
    >
      <div className="aspect-[4/3] rounded-lg bg-canvas-dim overflow-hidden mb-3 flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-xs text-ink/30">no image</span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-ink leading-snug">{product.name}</h3>
        {product.status === 'out_of_stock' && (
          <span className="text-[10px] font-mono text-thread-red shrink-0 mt-1">OUT OF STOCK</span>
        )}
      </div>
      <p className="text-xs text-ink/50 mb-2">{product.category} · {product.fabricType}</p>

      <div className="flex items-center gap-1.5 mb-3">
        {(product.colors || []).slice(0, 5).map((c) => (
          <span key={c} className="swatch-dot" style={{ backgroundColor: swatchColor(c) }} title={c} />
        ))}
      </div>

      <div className="flex items-end justify-between font-mono">
        <span className="text-base text-ink">₹{product.price}<span className="text-ink/40 text-xs">/{product.unit || 'm'}</span></span>
        <span className="text-xs text-ink/40">MOQ {product.moq}{product.unit || 'm'}</span>
      </div>
    </Link>
  );
}
