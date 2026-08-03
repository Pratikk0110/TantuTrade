import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'supplier' ? '/supplier/dashboard' : '/marketplace');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Welcome back</h1>
      <p className="text-ink/50 mb-8">Log in to your buyer or supplier account.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input type="email" required placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        <input type="password" required placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron" />
        {error && <p className="text-thread-red text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-ink text-canvas rounded-lg py-3 font-medium hover:bg-ink-soft disabled:opacity-50">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6">
        No account? <Link to="/register" className="text-ink underline">Sign up</Link>
      </p>
      <p className="text-xs font-mono text-ink/30 mt-8">Demo: buyer@demo.com / supplier1@demo.com — password123</p>
    </div>
  );
}
