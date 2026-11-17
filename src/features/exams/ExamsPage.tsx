import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, BookOpen, Check, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, type Exam, type Subject } from '@/db/schema';
import { IconBadge } from '@/components/IconBadge';

function SubjectCard({ subject, examCount, onSelect }: { subject: Subject; examCount: number; onSelect: () => void }) {
  return <button className="subject-choice-card" onClick={onSelect}>
    <IconBadge name={subject.icon as 'calculator'} color={subject.color} size="large" />
    <span><strong>{subject.name}</strong><small>{examCount} {examCount === 1 ? 'year' : 'years'} available</small></span>
    <ArrowRight size={18} className="quick-arrow" />
  </button>;
}

function YearCard({ exam, subject, onPractice }: { exam: Exam; subject: Subject; onPractice: () => void }) {
  return <article className="exam-card year-card">
    <div className="exam-card-top"><IconBadge name={subject.icon as 'calculator'} color={subject.color} size="small" /><span className="package-label">{exam.packageVersion}</span>{exam.downloaded ? <span className="downloaded-label"><Check size={13} /> Offline ready</span> : <span className="online-label"><LockKeyhole size={13} /> Online</span>}</div>
    <h2>{exam.year}</h2>
    <p>{exam.title} · {exam.questionCount} questions · {exam.durationMinutes} min</p>
    <div className="exam-card-footer"><span>{exam.downloaded ? 'Ready to practice offline' : 'Content will be available after import'}</span>{exam.downloaded ? <Link className="ghost-button" to={`/practice?exam=${exam.id}`} onClick={onPractice} aria-label={`Practice ${exam.year}`}><BookOpen size={16} />Practice</Link> : <button className="ghost-button" disabled aria-label={`Practice ${exam.year}`}><LockKeyhole size={16} />Unavailable</button>}</div>
  </article>;
}

export function ExamsPage() {
  const exams = useLiveQuery(() => db.exams.toArray(), [], []) ?? [];
  const subjects = useLiveQuery(() => db.subjects.toArray(), [], []) ?? [];
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);
  const subjectExams = exams.filter((exam) => exam.subjectId === selectedSubjectId).sort((a, b) => b.year - a.year);

  return <div className="page inner-page">
    <header className="inner-header"><div><p className="eyebrow">Exam library</p><h1>{selectedSubject ? `${selectedSubject.name} exams` : 'Choose a subject'}</h1><p className="muted">{selectedSubject ? 'Choose a year to start practicing.' : 'Select a subject to see available examination years.'}</p></div></header>
    {selectedSubject ? <>
      <button className="back-link" onClick={() => setSelectedSubjectId(undefined)}><ArrowLeft size={16} /> All subjects</button>
      <div className="year-list">{subjectExams.length ? subjectExams.map((exam) => <YearCard key={exam.id} exam={exam} subject={selectedSubject} onPractice={() => undefined} />) : <div className="empty-state"><p className="eyebrow">No exam years yet</p><h2>More {selectedSubject.name} papers are coming.</h2><p className="muted">This subject is ready for package imports.</p></div>}</div>
    </> : <div className="subject-choice-list">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} examCount={exams.filter((exam) => exam.subjectId === subject.id).length} onSelect={() => setSelectedSubjectId(subject.id)} />)}</div>}
  </div>;
}
