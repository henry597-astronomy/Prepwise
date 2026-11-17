import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, RotateCcw, Save, Star } from 'lucide-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { completeAttempt, createAttempt, db, toggleBookmark, type Question } from '@/db/schema';
import { answerQuestion, loadPracticeQuestions } from './practice-data';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const subjects = useLiveQuery(() => db.subjects.toArray(), [], []) ?? [];
  const exams = useLiveQuery(() => db.exams.toArray(), [], []) ?? [];
  const requestedExamId = searchParams.get('exam');
  const selectedExam = exams.find((exam) => exam.id === requestedExamId);
  const selectedSubject = subjects.find((subject) => subject.id === selectedExam?.subjectId);
  const questions = useLiveQuery(() => selectedExam ? loadPracticeQuestions(selectedExam.id) : Promise.resolve([]), [selectedExam?.id], []) ?? [];
  const [attemptId, setAttemptId] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const current: Question | undefined = questions[currentIndex];
  const bookmarked = useLiveQuery(() => current ? db.bookmarks.get(`bookmark:local-demo:${current.id}`) : Promise.resolve(undefined), [current?.id], undefined);
  const answeredCount = useLiveQuery(() => attemptId ? db.responses.where('attemptId').equals(attemptId).count() : Promise.resolve(0), [attemptId], 0) ?? 0;

  useEffect(() => {
    if (selectedExam && questions.length && !attemptId && !finished) {
      void createAttempt(selectedExam.id).then((attempt) => { setAttemptId(attempt.id); setSecondsLeft(selectedExam.durationMinutes * 60); });
    }
  }, [selectedExam?.id, questions.length, attemptId, finished]);

  useEffect(() => {
    if (!attemptId || finished || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [attemptId, finished, secondsLeft]);

  useEffect(() => {
    if (attemptId && secondsLeft === 0 && questions.length && !finished) { void completeAttempt(attemptId, score, questions.length); setFinished(true); }
  }, [attemptId, secondsLeft, questions.length, finished, score]);

  const progress = useMemo(() => questions.length ? ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100 : 0, [currentIndex, questions.length, submitted]);
  const submitAnswer = async () => { if (!current || selected === undefined || !attemptId || submitted) return; const correct = await answerQuestion(attemptId, current, selected); if (correct) setScore((value) => value + 1); setSubmitted(true); };
  const nextQuestion = () => { if (currentIndex >= questions.length - 1) { if (attemptId) void completeAttempt(attemptId, score + (selected === current?.answerIndex ? 1 : 0), questions.length); setFinished(true); } else { setCurrentIndex((value) => value + 1); setSelected(undefined); setSubmitted(false); } };
  const restart = () => { setSearchParams({ exam: selectedExam?.id ?? '' }); setAttemptId(undefined); setCurrentIndex(0); setSelected(undefined); setSubmitted(false); setScore(0); setFinished(false); setSecondsLeft(0); };

  if (!selectedExam) return <Navigate to="/exams" replace />;
  if (!questions.length) return <div className="page inner-page"><button className="back-link" onClick={() => setSearchParams({})}><ArrowLeft size={16} /> Choose another test</button><div className="empty-state"><p className="eyebrow">{selectedSubject?.name} · {selectedExam.year}</p><h1>Practice content is not imported yet.</h1><p className="muted">This year is listed in the library, but its local questions are still waiting for an exam package import.</p></div></div>;
  if (finished) return <div className="page inner-page practice-result"><div className="result-icon"><CheckCircle2 size={42} /></div><p className="eyebrow">Practice complete</p><h1>{score} / {questions.length}</h1><p className="muted">Your result was saved locally. {secondsLeft === 0 ? 'The timer reached zero.' : 'Nice work.'}</p><div className="result-actions"><button className="primary-button" onClick={restart}><RotateCcw size={17} /> Try again</button><button className="secondary-button"><Save size={17} /> Review later</button></div></div>;

  return <div className="page inner-page practice-page">
    <header className="practice-header"><div><p className="eyebrow">{selectedSubject?.name} · {selectedExam.year}</p><h1>Practice test</h1></div><span className={`timer-pill ${secondsLeft < 60 ? 'timer-warning' : ''}`}><Clock3 size={15} /> {formatTime(secondsLeft)}</span></header>
    <div className="practice-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.min(currentIndex + (submitted ? 1 : 0), questions.length)} of {questions.length}</span></div>
    {current && <article className="question-card"><div className="question-meta"><span>Question {current.order}</span><button className={`bookmark-button ${bookmarked ? 'bookmarked' : ''}`} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'} onClick={() => void toggleBookmark('local-demo', current.id)}><Star size={18} fill={bookmarked ? 'currentColor' : 'none'} /></button></div><h2>{current.prompt}</h2><div className="answer-list">{current.options.map((option, index) => <button key={option} className={`answer-option ${selected === index ? 'selected' : ''} ${submitted && index === current.answerIndex ? 'correct' : ''} ${submitted && selected === index && index !== current.answerIndex ? 'incorrect' : ''}`} onClick={() => setSelected(index)} disabled={submitted}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}{submitted && index === current.answerIndex && <CheckCircle2 size={18} />}</button>)}</div>{submitted && <div className={`explanation ${selected === current.answerIndex ? 'correct' : 'incorrect'}`}><strong>{selected === current.answerIndex ? 'Correct answer' : 'Review this one'}</strong><p>{current.explanation}</p></div>}</article>}
    <div className="practice-actions"><button className="secondary-button" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={currentIndex === 0}><ArrowLeft size={17} /> Previous</button>{submitted ? <button className="primary-button" onClick={nextQuestion}>{currentIndex === questions.length - 1 ? 'Finish test' : 'Next question'} <ArrowRight size={17} /></button> : <button className="primary-button" onClick={submitAnswer} disabled={selected === undefined}>Check answer <CheckCircle2 size={17} /></button>}</div><p className="save-note"><Save size={14} /> Answer saved on this device first · {answeredCount} saved</p>
  </div>;
}
