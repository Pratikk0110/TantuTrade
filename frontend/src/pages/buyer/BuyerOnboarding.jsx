import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const QUESTIONS = [
  { key: 'businessType', text: "What kind of business are you sourcing for? (e.g. garment manufacturer, retailer, designer studio)" },
  { key: 'industry', text: "Which industry does that serve — fashion, home textiles, industrial, uniforms?" },
  { key: 'categoriesOfInterest', text: "Which fabric categories are you most interested in? (comma-separated, e.g. Cotton, Denim)", list: true },
  { key: 'preferredFabricTypes', text: "Any specific fabric types you prefer? (comma-separated, e.g. cotton, silk)", list: true },
  { key: 'typicalOrderQuantity', text: "What's your typical order quantity per fabric?" },
  { key: 'budgetRange', text: "What's your usual budget range per meter?" },
  { key: 'additionalPreferences', text: "Anything else we should know — preferred colors, certifications, delivery timelines?" },
];

export default function BuyerOnboarding() {
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
        await api.post('/onboarding/buyer', updated);
        await refreshUser();
        navigate('/marketplace');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-saffron-dark mb-3">
        Question {step + 1} of {QUESTIONS.length}
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
        {submitting ? 'Setting up your profile…' : step === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
      </button>
      <button onClick={() => navigate('/marketplace')} className="mt-3 w-full text-sm text-ink/40 hover:text-ink">
        Skip for now
      </button>
    </div>
  );
}
