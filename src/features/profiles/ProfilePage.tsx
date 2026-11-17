import { useLiveQuery } from 'dexie-react-hooks';
import { Check, ChevronRight, Download, KeyRound, Link2, ShieldCheck } from 'lucide-react';
import { db } from '@/db/schema';
import { useConnectivity } from '@/hooks/useConnectivity';

export function ProfilePage() {
  const profile = useLiveQuery(() => db.profiles.get('local-demo'), [], undefined);
  const downloads = useLiveQuery(() => db.downloads.toArray(), [], []);
  const isOnline = useConnectivity();
  return <div className="page inner-page profile-page"><header className="profile-hero"><div className="profile-avatar">{profile?.displayName.charAt(0) ?? 'H'}</div><p className="eyebrow">Local student profile</p><h1>{profile?.displayName ?? 'Student'}</h1><span>{profile?.grade ?? 'Grade 12'} · {profile?.localOnly ? 'Local-only for now' : 'Connected account'}</span></header><section className="profile-panel"><div className="panel-heading"><ShieldCheck size={18} /><div><strong>Secure offline access</strong><p>PIN setup and account linking are planned for the authentication phase.</p></div><ChevronRight size={18} /></div><button className="profile-action" disabled><KeyRound size={18} /><span>Configure local PIN<small>Next phase · never store plaintext passwords</small></span><ChevronRight size={17} /></button><button className="profile-action" disabled><Link2 size={18} /><span>Link to Supabase account<small>{isOnline ? 'Next phase · Supabase is not connected' : 'Connect to the internet first'}</small></span><ChevronRight size={17} /></button></section><section className="profile-panel"><div className="panel-heading"><Download size={18} /><div><strong>Offline storage</strong><p>Your examination data is separate from optional video downloads.</p></div></div>{downloads.map((download) => <div className="download-row" key={download.id}><span className={`download-dot ${download.status}`} /> <span>{download.label}<small>{download.kind === 'video' ? 'Video resource' : 'Exam package'} · {download.sizeLabel}</small></span><span className="download-state">{download.status === 'ready' ? <><Check size={14} /> Ready</> : 'Available'}</span></div>)}</section></div>;
}
