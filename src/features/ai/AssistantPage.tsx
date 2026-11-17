import { Bot, LockKeyhole, Send, Sparkles } from 'lucide-react';
import { useConnectivity } from '@/hooks/useConnectivity';

export function AssistantPage() {
  const isOnline = useConnectivity();
  const aiConfigured = Boolean(import.meta.env.VITE_AI_ENDPOINT);
  const ready = isOnline && aiConfigured;
  return <div className="page inner-page assistant-page"><header className="inner-header"><div><p className="eyebrow">Study support</p><h1>AI assistant</h1><p className="muted">Ask for a hint, not a shortcut.</p></div><span className="assistant-mark"><Bot size={22} /></span></header><section className="assistant-card"><div className="assistant-bubble"><Sparkles size={20} /><div><strong>Prepwise AI</strong><p>{!isOnline ? 'AI needs internet, but your exams and progress still work offline.' : ready ? 'Online assistant is ready for your questions.' : 'AI provider setup is coming next; your local study tools are ready now.'}</p></div></div><div className="suggestion-row"><button disabled={!ready}>Explain a difficult step</button><button disabled={!ready}>Give me a study plan</button></div><div className="assistant-input"><input placeholder={ready ? 'Ask about a question or topic…' : 'AI is not connected yet'} disabled={!ready} /><button disabled={!ready} aria-label="Send question"><Send size={18} /></button></div>{!ready && <p className="offline-callout"><LockKeyhole size={15} /> {!isOnline ? 'Offline mode keeps your local study tools available.' : 'No AI provider is connected in this local-first build.'}</p>}</section></div>;
}
