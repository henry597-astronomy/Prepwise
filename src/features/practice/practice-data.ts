import { db, createAttempt, recordResponse, type Question } from '@/db/schema';

export async function loadPracticeQuestions(examId = 'math-2025-p1') {
  return db.questions.where('examId').equals(examId).sortBy('order');
}

export async function answerQuestion(attemptId: string, question: Question, selectedIndex: number) {
  const isCorrect = selectedIndex === question.answerIndex;
  await recordResponse({ attemptId, questionId: question.id, selectedIndex, isCorrect });
  return isCorrect;
}

export { createAttempt };
