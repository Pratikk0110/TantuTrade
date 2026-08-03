import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const QUESTIONS = [
  { key: 'businessName', text: "What's your business name?" },
  { key: 'businessType', text: "What type of business are you — manufacturer, wholesaler, mill, trader?" },
  { key: 'contactInfo', text: "Best contact email or phone for buyers to reach you?" },
  { key: 'businessAddress', text: "Where's your business located?" },
  { key: 'operatingHours', text: "What are your operating hours?" },
  { key: 'productCategories', text: "Which product categories will you list? (comma-separated, e.g. Cotton, Silk)", list: true },
  { key: 'fabricTypesOffered', text: "Which fabric types do you offer? (comma-separated, e.g. cotton, denim)", list: true },
  { key: 'minimumOrderQuantity', text: "What's your typical minimum order quantity (MOQ)?" },
];

export default function SupplierOnboarding() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const q = QUESTIONS[step];

  const next = async () => {
    const value = q.list ? current.split(',').map((s) => s.trim()).filter(Boolean) : current;
    const updated = { ...answers, [q.key]: value };
    setAnswers(updated);
    setCurrent('');

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        await api.post('/onboarding/supplier', updated);
        await refreshUser();
        navigate('/supplier/dashboard');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-saffron-dark mb-3">
        Setting up your business · {step + 1} of {QUESTIONS.length}
      </p>
      <div className="w-full h-1.5 bg-canvas-dim rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-saffron transition-all" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>

      <h1 className="font-display font-bold text-2xl text-ink mb-6">{q.text}</h1>

      <textarea
        autoFocus
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && current.trim()) { e.preventDefault(); next(); } }}
        placeholder="Type your answer…"
        rows={3}
        className="w-full border border-ink/20 rounded-lg px-4 py-3 outline-none focus:border-saffron"
      />

      <button onClick={next} disabled={!current.trim() || submitting}
        className="mt-6 w-full bg-ink text-canvas rounded-lg py-3 font-medium disabled:opacity-40">
        {submitting ? 'Setting up your profile…' : step === QUESTIONS.length - 1 ? 'Finish setup' : 'Next'}
      </button>
    </div>
  );
}
