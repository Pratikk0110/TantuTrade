import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate(form.role === 'supplier' ? '/supplier/onboarding' : '/buyer/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Create your account</h1>
      <p className="text-ink/50 mb-8">Join as a buyer sourcing fabric, or a supplier listing inventory.</p>

      <div className="flex gap-2 mb-6">
        {['buyer', 'supplier'].map((r) => (
          <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
            className={`flex-1 py-2 rounded-full text-sm font-medium border ${
              form.role === r ? 'bg-ink text-canvas border-ink' : 'border-ink/20 text-ink/60'
            }`}>
            I'm a {r}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input required placeholder="Full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        <input type="email" required placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        <input placeholder="Phone (optional)" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        <input type="password" required minLength={6} placeholder="Password (min 6 characters)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        {error && <p className="text-thread-red text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-ink text-canvas rounded-lg py-3 font-medium hover:bg-ink-soft disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6">
        Already registered? <Link to="/login" className="text-ink underline">Log in</Link>
      </p>
    </div>
  );
}
