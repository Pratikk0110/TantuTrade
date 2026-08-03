import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ totalProducts: 0, activeProducts: 0, pendingOrders: 0, recentOrders: [], inventoryAlerts: [] });

  useEffect(() => {
    api.get('/supplier/dashboard').then((res) => setData(res.data));
  }, []);

  const stats = [
    { label: 'Total products', value: data.totalProducts },
    { label: 'Active products', value: data.activeProducts },
    { label: 'Pending orders', value: data.pendingOrders },
    { label: 'Low stock alerts', value: data.inventoryAlerts.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">{user?.name}'s dashboard</h1>
          <p className="text-ink/50">Here's what's happening in your storefront.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/supplier/inventory" className="bg-ink text-canvas px-5 py-2.5 rounded-full text-sm font-medium">Manage inventory</Link>
          <Link to="/supplier/orders" className="border border-ink/20 px-5 py-2.5 rounded-full text-sm font-medium">View orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-ink/10 rounded-xl p-5">
            <p className="font-mono text-3xl text-ink">{s.value}</p>
            <p className="text-xs text-ink/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {data.inventoryAlerts.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">Inventory alerts</h2>
          <div className="space-y-2">
            {data.inventoryAlerts.map((p) => (
              <div key={p._id} className="flex justify-between items-center bg-thread-red/10 border border-thread-red/20 rounded-lg px-4 py-2.5 text-sm">
                <span>{p.name}</span>
                <span className="font-mono text-thread-red">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-display font-semibold text-lg text-ink mb-3">Recent orders</h2>
      <div className="space-y-3">
        {data.recentOrders.length === 0 && <p className="text-sm font-mono text-ink/40">No orders yet.</p>}
        {data.recentOrders.map((o) => (
          <Link to="/supplier/orders" key={o._id} className="flex justify-between items-center bg-white border border-ink/10 rounded-xl p-4 hover:border-saffron">
            <div>
              <p className="font-mono text-sm text-ink/70">#{o._id.slice(-6)}</p>
              <p className="text-xs text-ink/40">₹{o.totalAmount.toLocaleString()}</p>
            </div>
            <StatusBadge status={o.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
