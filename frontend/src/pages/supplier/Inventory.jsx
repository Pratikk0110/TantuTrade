import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const emptyForm = {
  name: '', category: '', fabricType: '', description: '', colors: '', specifications: '',
  price: '', unit: 'meter', stock: '', moq: '1', featured: false,
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/products/mine/all').then((res) => setItems(res.data.items));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, category: p.category, fabricType: p.fabricType, description: p.description,
      colors: (p.colors || []).join(', '), specifications: p.specifications,
      price: p.price, unit: p.unit, stock: p.stock, moq: p.moq, featured: p.featured,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      moq: Number(form.moq),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const toggleStock = async (p) => {
    const status = p.status === 'available' ? 'out_of_stock' : 'available';
    await api.patch(`/products/${p._id}/stock`, { status });
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-ink">Inventory</h1>
        <button onClick={openNew} className="bg-ink text-canvas px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Add product
        </button>
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p._id} className="bg-white border border-ink/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-canvas-dim shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink truncate">{p.name}</p>
              <p className="text-xs text-ink/40 font-mono">{p.category} · ₹{p.price}/{p.unit} · stock {p.stock}</p>
            </div>
            <StatusBadge status={p.status} />
            <button onClick={() => toggleStock(p)} className="text-xs font-mono text-ink/50 underline">
              mark {p.status === 'available' ? 'out of stock' : 'available'}
            </button>
            <button onClick={() => openEdit(p)} className="text-ink/40 hover:text-ink"><Pencil size={16} /></button>
            <button onClick={() => remove(p._id)} className="text-ink/40 hover:text-thread-red"><Trash2 size={16} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm font-mono text-ink/40">No products yet — add your first one.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()}
            className="bg-canvas rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-display font-bold text-xl">{editingId ? 'Edit product' : 'New product'}</h2>
              <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            {[
              ['name', 'Product name'], ['category', 'Category'], ['fabricType', 'Fabric type'],
              ['colors', 'Colors (comma-separated)'], ['specifications', 'Specifications'],
            ].map(([key, label]) => (
              <input key={key} required={key === 'name' || key === 'category'} placeholder={label}
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
            ))}
            <textarea placeholder="Description" rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Price" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
              <input placeholder="Unit (e.g. meter)" value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
              <input required type="number" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
              <input type="number" placeholder="MOQ" value={form.moq}
                onChange={(e) => setForm({ ...form, moq: e.target.value })}
                className="border border-ink/20 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Feature on homepage
            </label>
            <button disabled={saving} className="w-full bg-ink text-canvas rounded-lg py-3 font-medium disabled:opacity-50">
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
