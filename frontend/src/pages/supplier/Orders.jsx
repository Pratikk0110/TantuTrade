import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const FLOW = ['pending', 'accepted', 'preparing', 'ready_for_dispatch', 'completed'];
const LABELS = { pending: 'Pending', accepted: 'Accepted', preparing: 'Preparing', ready_for_dispatch: 'Ready for dispatch', completed: 'Completed' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const load = () => api.get('/orders/incoming').then((res) => setOrders(res.data.orders));
  useEffect(() => { load(); }, []);

  const advance = async (order) => {
    const idx = FLOW.indexOf(order.status);
    if (idx === FLOW.length - 1) return;
    await api.patch(`/orders/incoming/${order._id}/status`, { status: FLOW[idx + 1] });
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Incoming orders</h1>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border border-ink/10 rounded-xl p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
              <div>
                <p className="font-mono text-sm text-ink/70">#{o._id.slice(-6)} · {o.buyer?.name}</p>
                <p className="text-xs text-ink/40">{o.items.length} item(s) · ₹{o.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                {o.status !== 'completed' && (
                  <button onClick={(e) => { e.stopPropagation(); advance(o); }}
                    className="text-xs font-mono underline text-ink/60 hover:text-ink">
                    mark {LABELS[FLOW[FLOW.indexOf(o.status) + 1]]}
                  </button>
                )}
              </div>
            </div>

            {expanded === o._id && (
              <div className="mt-4 pt-4 border-t border-dashed border-ink/20 space-y-2">
                {o.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm font-mono">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <p className="text-xs text-ink/40 mt-2">
                  Ship to: {o.shippingInfo?.fullName}, {o.shippingInfo?.address}, {o.shippingInfo?.city}
                </p>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm font-mono text-ink/40">No incoming orders yet.</p>}
      </div>
    </div>
  );
}
