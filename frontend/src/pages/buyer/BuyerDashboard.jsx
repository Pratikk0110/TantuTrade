import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ currentOrders: [], previousOrders: [], totalOrders: 0 });

  useEffect(() => {
    api.get('/buyer/dashboard').then((res) => setData(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-1">Welcome, {user?.name}</h1>
      <p className="text-ink/50 mb-8">{data.totalOrders} orders placed so far</p>

      <h2 className="font-display font-semibold text-lg text-ink mb-3">Current orders</h2>
      <div className="space-y-3 mb-10">
        {data.currentOrders.length === 0 && <p className="text-sm font-mono text-ink/40">No active orders.</p>}
        {data.currentOrders.map((o) => (
          <div key={o._id} className="bg-white border border-ink/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-mono text-sm text-ink/70">#{o._id.slice(-6)}</p>
              <p className="text-xs text-ink/40">{o.items.length} item(s) · ₹{o.totalAmount.toLocaleString()}</p>
            </div>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-lg text-ink mb-3">Previous orders</h2>
      <div className="space-y-3">
        {data.previousOrders.length === 0 && <p className="text-sm font-mono text-ink/40">No completed orders yet.</p>}
        {data.previousOrders.map((o) => (
          <div key={o._id} className="bg-white border border-ink/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-mono text-sm text-ink/70">#{o._id.slice(-6)}</p>
              <p className="text-xs text-ink/40">{o.items.length} item(s) · ₹{o.totalAmount.toLocaleString()}</p>
            </div>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </div>

      <Link to="/marketplace" className="inline-block mt-10 text-sm text-ink underline">Continue browsing →</Link>
    </div>
  );
}
