import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function SupplierProfile() {
  const [form, setForm] = useState({ businessName: '', contactInfo: '', businessAddress: '', operatingHours: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/supplier/profile').then((res) => {
      if (res.data.profile) setForm(res.data.profile);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/supplier/profile', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Business profile</h1>
      <form onSubmit={save} className="space-y-4">
        {[
          ['businessName', 'Business name'], ['contactInfo', 'Contact info'],
          ['businessAddress', 'Business address'], ['operatingHours', 'Operating hours'],
        ].map(([key, label]) => (
          <input key={key} placeholder={label} value={form[key] || ''}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border border-ink/20 rounded-lg px-4 py-3 text-sm" />
        ))}
        <button className="w-full bg-ink text-canvas rounded-lg py-3 font-medium">
          {saved ? 'Saved ✓' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
