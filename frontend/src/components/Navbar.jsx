import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    navigate(q ? `/marketplace?search=${encodeURIComponent(q)}` : '/marketplace');
  };

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/" className="font-display font-bold text-xl tracking-tight text-ink shrink-0">
          Tantu<span className="text-saffron">Trade</span>
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-white border border-ink/15 rounded-full px-4 py-2">
          <Search size={16} className="text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fabrics, categories, suppliers…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink/40"
          />
        </form>

        <nav className="ml-auto flex items-center gap-3 sm:gap-5 text-sm font-medium">
          <Link to="/marketplace" className="hidden sm:inline text-ink/70 hover:text-ink transition-colors">Marketplace</Link>

          {!user && (
            <>
              <Link to="/login" className="text-ink/70 hover:text-ink transition-colors">Log in</Link>
              <Link to="/register" className="bg-ink text-canvas px-4 py-2 rounded-full hover:bg-ink-soft transition-colors">Sign up</Link>
            </>
          )}

          {user?.role === 'buyer' && (
            <>
              <Link to="/cart" className="relative text-ink/70 hover:text-ink transition-colors">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-thread-red text-white text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/buyer/dashboard" className="text-ink/70 hover:text-ink transition-colors" title="Dashboard">
                <LayoutDashboard size={20} />
              </Link>
            </>
          )}

          {user?.role === 'supplier' && (
            <Link to="/supplier/dashboard" className="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user && (
            <button onClick={() => { logout(); navigate('/'); }} className="text-ink/50 hover:text-thread-red transition-colors" title="Log out">
              <LogOut size={18} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
