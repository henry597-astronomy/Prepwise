import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, RotateCcw, Save, Star } from 'lucide-react';
import { completeAttempt, createAttempt, db, toggleBookmark, type Question } from '@/db/schema';
import { answerQuestion, loadPracticeQuestions } from './practice-data';

export function PracticePage() {
  const questions = useLiveQuery(() => loadPracticeQuestions(), [], []);
  const [attemptId, setAttemptId] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const current: Question | undefined = questions[currentIndex];
  const bookmarked = useLiveQuery(() => current ? db.bookmarks.get(`bookmark:local-demo:${current.id}`) : Promise.resolve(undefined), [current?.id], undefined);
  const answeredCount = useLiveQuery(() => attemptId ? db.responses.where('attemptId').equals(attemptId).count() : Promise.resolve(0), [attemptId], 0) ?? 0;

  useEffect(() => { if (!attemptId && questions.length) void createAttempt('math-2025-p1').then((attempt) => setAttemptId(attempt.id)); }, [attemptId, questions.length]);

  const progress = useMemo(() => questions.length ? ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100 : 0, [currentIndex, questions.length, submitted]);

  const submitAnswer = async () => {
    if (!current || selected === undefined || !attemptId || submitted) return;
    const correct = await answerQuestion(attemptId, current, selected);
    if (correct) setScore((value) => value + 1);
    setSubmitted(true);
  };

  const nextQuestion = () => { if (currentIndex >= questions.length - 1) { if (attemptId) void completeAttempt(attemptId, score, questions.length); setFinished(true); } else { setCurrentIndex((value) => value + 1); setSelected(undefined); setSubmitted(false); } };
  const restart = () => { setCurrentIndex(0); setSelected(undefined); setSubmitted(false); setScore(0); setFinished(false); void createAttempt('math-2025-p1').then((attempt) => setAttemptId(attempt.id)); };

  if (finished) return <div className="page inner-page practice-result"><div className="result-icon"><CheckCircle2 size={42} /></div><p className="eyebrow">Practice complete</p><h1>{score} / {questions.length}</h1><p className="muted">Your result was saved locally and will sync when a cloud account is connected.</p><div className="result-actions"><button className="primary-button" onClick={restart}><RotateCcw size={17} /> Try again</button><button className="secondary-button"><Save size={17} /> Review later</button></div></div>;

  return <div className="page inner-page practice-page">
    <header className="practice-header"><div><p className="eyebrow">Mathematics · 2025</p><h1>Practice test</h1></div><span className="timer-pill"><Clock3 size={15} /> 32:18</span></header>
    <div className="practice-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.min(currentIndex + (submitted ? 1 : 0), questions.length)} of {questions.length}</span></div>
    {current && <article className="question-card"><div className="question-meta"><span>Question {current.order}</span><button className={`bookmark-button ${bookmarked ? 'bookmarked' : ''}`} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'} onClick={() => void toggleBookmark('local-demo', current.id)}><Star size={18} fill={bookmarked ? 'currentColor' : 'none'} /></button></div><h2>{current.prompt}</h2><div className="answer-list">{current.options.map((option, index) => <button key={option} className={`answer-option ${selected === index ? 'selected' : ''} ${submitted && index === current.answerIndex ? 'correct' : ''} ${submitted && selected === index && index !== current.answerIndex ? 'incorrect' : ''}`} onClick={() => setSelected(index)} disabled={submitted}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}{submitted && index === current.answerIndex && <CheckCircle2 size={18} />}</button>)}</div>{submitted && <div className={`explanation ${selected === current.answerIndex ? 'correct' : 'incorrect'}`}><strong>{selected === current.answerIndex ? 'Correct answer' : 'Review this one'}</strong><p>{current.explanation}</p></div>}</article>}
    <div className="practice-actions"><button className="secondary-button" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={currentIndex === 0}><ArrowLeft size={17} /> Previous</button>{submitted ? <button className="primary-button" onClick={nextQuestion}>{currentIndex === questions.length - 1 ? 'Finish test' : 'Next question'} <ArrowRight size={17} /></button> : <button className="primary-button" onClick={submitAnswer} disabled={selected === undefined}>Check answer <CheckCircle2 size={17} /></button>}</div><p className="save-note"><Save size={14} /> Answer saved on this device first · {answeredCount} saved</p>
  </div>;
}
