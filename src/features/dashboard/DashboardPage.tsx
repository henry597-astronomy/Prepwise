import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Flame, Menu, MoreHorizontal, Target } from 'lucide-react';
import { db } from '@/db/schema';
import { IconBadge } from '@/components/IconBadge';

const quickAccess = [
  { to: '/exams', label: 'Past Exams', helper: 'By subject & year', icon: 'exams' as const, color: '#2667f5' },
  { to: '/practice', label: 'Practice Tests', helper: 'Timed & focused', icon: 'practice' as const, color: '#5a5be7' },
  { to: '/ai', label: 'AI Assistant', helper: 'Get help online', icon: 'ai' as const, color: '#f3bd20' },
  { to: '/profile', label: 'Study Resources', helper: 'Notes & tips', icon: 'resources' as const, color: '#fa8b18' },
];

export function DashboardPage() {
  const profile = useLiveQuery(() => db.profiles.get('local-demo'), [], undefined);
  const subjects = useLiveQuery(() => db.subjects.toArray().then((rows) => rows.sort((a, b) => a.name.localeCompare(b.name))), [], []);
  const attempts = useLiveQuery(() => db.attempts.orderBy('updatedAt').reverse().limit(3).toArray(), [], []);

  const subjectRows = subjects ?? [];
  const attemptRows = attempts ?? [];
  const displayName = String(profile?.displayName ?? 'Student');
  const overallProgress = Math.round((subjectRows.reduce((sum, subject) => sum + subject.completedPercent, 0) / Math.max(subjectRows.length, 1)));

  return (
    <div className="page dashboard-page">
      <header className="topbar">
        <button className="icon-button" aria-label="Open menu"><Menu size={23} /></button>
        <Link to="/" className="wordmark" aria-label="Prepwise home">Matric<span>Master</span></Link>
        <button className="icon-button" aria-label="Notifications"><Bell size={21} /></button>
      </header>

      <section className="welcome-row">
        <div className="avatar">{displayName.charAt(0)}</div>
        <div className="welcome-copy">
          <p className="eyebrow">Welcome back,</p>
          <h1>{displayName}!</h1>
          <p className="muted">Keep going towards your goals <span className="spark">✦</span></p>
        </div>
        <div className="streak-card"><Flame size={18} fill="currentColor" /><strong>{profile?.streak ?? 7}</strong><span>Day streak</span></div>
      </section>

      <section className="goal-card">
        <div className="goal-icon"><Target size={30} /></div>
        <div className="goal-content">
          <p className="eyebrow">Your goal</p>
          <h2>{profile?.goal ?? 'Score 90%+ in the Matric Exam'}</h2>
          <div className="progress-row"><div className="progress-track"><div className="progress-fill" style={{ width: `${overallProgress}%` }} /></div><strong>{overallProgress}%</strong></div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><h2>Quick access</h2><MoreHorizontal size={20} className="muted-icon" /></div>
        <div className="quick-grid">
          {quickAccess.map((item) => <Link to={item.to} className="quick-card" key={item.to}><IconBadge name={item.icon} color={item.color} size="small" /><span><strong>{item.label}</strong><small>{item.helper}</small></span><ChevronRight size={16} className="quick-arrow" /></Link>)}
        </div>
      </section>

      <section className="section-block subjects-section">
        <div className="section-heading"><h2>Subjects</h2><Link to="/exams">See all <ChevronRight size={16} /></Link></div>
        <div className="subject-scroller">
          {subjectRows.map((subject) => <Link to={`/exams?subject=${subject.slug}`} className="subject-item" key={subject.id}><IconBadge name={subject.icon as 'calculator'} color={subject.color} /><strong>{subject.shortName}</strong><small>{subject.completedPercent}% done</small></Link>)}
        </div>
      </section>

      <section className="revision-card">
        <div><p className="eyebrow">Revision trail</p><h2>{attemptRows.length ? 'You are building momentum.' : 'Your first practice is ready.'}</h2><p className="muted">Your progress is saved on this device first, even without internet.</p></div>
        <Link to="/practice" className="primary-button">Continue practice</Link>
      </section>
    </div>
  );
}
