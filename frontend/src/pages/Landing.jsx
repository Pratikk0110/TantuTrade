import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORY_LABELS = ['Cotton', 'Denim', 'Silk', 'Chiffon', 'Velvet'];

export default function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products/featured').then((res) => setFeatured(res.data.items)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <p className="font-mono text-xs tracking-widest text-saffron-dark uppercase mb-4">Sourcing, without the sample courier</p>
        <h1 className="font-display font-bold text-4xl sm:text-6xl leading-[1.05] text-ink max-w-3xl">
          Every mill's shade card, in one ledger.
        </h1>
        <p className="mt-6 text-ink/60 max-w-xl text-lg">
          TantuTrade connects fabric buyers directly with verified suppliers — browse stock,
          compare weaves, and place bulk orders without leaving the page.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/marketplace" className="bg-ink text-canvas px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-ink-soft transition-colors">
            Browse the marketplace <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="border border-ink/20 px-6 py-3 rounded-full font-medium hover:border-ink transition-colors">
            Join as a supplier
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6 stitch-divider pt-8">
        <div className="flex flex-wrap gap-3">
          {CATEGORY_LABELS.map((c) => (
            <Link key={c} to={`/marketplace?category=${encodeURIComponent(c)}`}
              className="font-mono text-sm px-4 py-2 rounded-full bg-white border border-ink/15 hover:border-saffron transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-ink">Featured this week</h2>
          <Link to="/marketplace" className="text-sm text-ink/50 hover:text-ink">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          {featured.length === 0 && <p className="text-sm text-ink/40 font-mono col-span-full">No featured products yet — seed the database to see samples here.</p>}
        </div>
      </section>
    </div>
  );
}
