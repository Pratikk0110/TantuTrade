const STYLES = {
  pending: 'bg-saffron/20 text-saffron-dark',
  accepted: 'bg-ink/10 text-ink',
  preparing: 'bg-ink/10 text-ink',
  ready_for_dispatch: 'bg-thread-green/15 text-thread-green',
  completed: 'bg-thread-green/20 text-thread-green',
  available: 'bg-thread-green/15 text-thread-green',
  out_of_stock: 'bg-thread-red/15 text-thread-red',
};

const LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_dispatch: 'Ready for dispatch',
  completed: 'Completed',
  available: 'Available',
  out_of_stock: 'Out of stock',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono ${STYLES[status] || 'bg-ink/10 text-ink'}`}>
      {LABELS[status] || status}
    </span>
  );
}
