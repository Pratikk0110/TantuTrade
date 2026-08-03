import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    api.get('/products', { params })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <h3 className="font-display font-semibold text-sm mb-3 text-ink/70 uppercase tracking-wide">Category</h3>
          <div className="space-y-1">
            <button onClick={() => setParam('category', '')}
              className={`block text-sm w-full text-left px-2 py-1.5 rounded ${!category ? 'bg-saffron/20 text-ink' : 'text-ink/60 hover:bg-canvas-dim'}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c} onClick={() => setParam('category', c)}
                className={`block text-sm w-full text-left px-2 py-1.5 rounded ${category === c ? 'bg-saffron/20 text-ink' : 'text-ink/60 hover:bg-canvas-dim'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-sm mb-3 text-ink/70 uppercase tracking-wide">Sort</h3>
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Newest</option>
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </aside>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-ink">
            {search ? `Results for "${search}"` : category || 'All fabrics'}
          </h1>
          <span className="text-sm font-mono text-ink/40">{items.length} items</span>
        </div>

        {loading ? (
          <p className="font-mono text-sm text-ink/40">Loading…</p>
        ) : items.length === 0 ? (
          <p className="font-mono text-sm text-ink/40">No products match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
