import { useState, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import api from '../services/api';
import ProductCard from './ProductCard';

export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm your fabric sourcing assistant. Ask me things like \"cotton under 200\" or \"show me something like velvet\".", products: [] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message) return;
    setMessages((m) => [...m, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message });
      setMessages((m) => [...m, { role: 'assistant', text: res.data.reply, products: res.data.products }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: "Sorry, I couldn't reach the assistant just now." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      recognition.stop();
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-ink text-canvas rounded-full p-4 shadow-lg hover:bg-ink-soft transition-colors"
        aria-label="Open AI assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[65vh] bg-white border border-ink/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-ink text-canvas px-4 py-3 font-display font-semibold text-sm">
            Fabric Assistant
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-saffron/25 text-ink' : 'bg-canvas-dim text-ink'
                }`}>
                  {m.text}
                </div>
                {m.products?.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {m.products.slice(0, 3).map((p) => <ProductCard key={p._id} product={p} />)}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs font-mono text-ink/40">thinking…</div>}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-ink/10 p-2 flex items-center gap-2"
          >
            <button type="button" onClick={toggleVoice} className={`p-2 rounded-full ${listening ? 'bg-thread-red text-white' : 'text-ink/50 hover:bg-canvas-dim'}`}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fabrics…"
              className="flex-1 text-sm outline-none px-2"
            />
            <button type="submit" className="p-2 rounded-full bg-ink text-canvas hover:bg-ink-soft">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
