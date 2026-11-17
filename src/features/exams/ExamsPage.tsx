import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, Check, Download, Filter, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, type Exam } from '@/db/schema';
import { IconBadge } from '@/components/IconBadge';

function ExamCard({ exam, subjectName, color }: { exam: Exam; subjectName: string; color: string }) {
  return <article className="exam-card">
    <div className="exam-card-top"><IconBadge name="exams" color={color} size="small" /><span className="package-label">Package {exam.packageVersion}</span>{exam.downloaded ? <span className="downloaded-label"><Check size={13} /> Offline ready</span> : <span className="online-label"><LockKeyhole size={13} /> Online</span>}</div>
    <h2>{subjectName} <span>·</span> {exam.year}</h2>
    <p>{exam.title} · {exam.questionCount} questions · {exam.durationMinutes} min</p>
    <div className="exam-card-footer"><span>{exam.downloaded ? 'Available without internet' : 'Package import comes next'}</span>{exam.downloaded ? <Link className="ghost-button" to="/practice" aria-label="Open examination"><BookOpen size={16} />Open</Link> : <button className="ghost-button" disabled aria-label="Download examination"><Download size={16} />Download</button>}</div>
  </article>;
}

export function ExamsPage() {
  const exams = useLiveQuery(() => db.exams.orderBy('year').reverse().toArray(), [], []);
  const subjects = useLiveQuery(() => db.subjects.toArray(), [], []);
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));

  return <div className="page inner-page">
    <header className="inner-header"><div><p className="eyebrow">Exam library</p><h1>Past exams</h1><p className="muted">Downloaded packages stay with you offline.</p></div><button className="icon-button subtle" aria-label="Filter exams"><Filter size={20} /></button></header>
    <div className="library-summary"><div><strong>{exams.filter((exam) => exam.downloaded).length}</strong><span>offline-ready packages</span></div><div><strong>{exams.length}</strong><span>in your library</span></div><div className="summary-mark"><Download size={19} /><span>Local-first</span></div></div>
    <div className="exam-list">{exams.map((exam) => { const subject = subjectMap.get(exam.subjectId); return <ExamCard key={exam.id} exam={exam} subjectName={subject?.name ?? 'Subject'} color={subject?.color ?? '#6554e8'} />; })}</div>
  </div>;
}
