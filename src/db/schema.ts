import Dexie, { type Table } from 'dexie';

export type SyncState = 'synced' | 'pending' | 'failed';

export interface StudentProfile {
  id: string;
  displayName: string;
  grade: string;
  goal: string;
  streak: number;
  avatarColor: string;
  localOnly: boolean;
  updatedAt: number;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  completedPercent: number;
  updatedAt: number;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  year: number;
  questionCount: number;
  durationMinutes: number;
  packageVersion: string;
  downloaded: boolean;
  updatedAt: number;
}

export interface Question {
  id: string;
  examId: string;
  order: number;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Attempt {
  id: string;
  profileId: string;
  examId: string;
  startedAt: number;
  completedAt?: number;
  score: number;
  total: number;
  syncState: SyncState;
  updatedAt: number;
}

export interface Response {
  id: string;
  attemptId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: number;
  syncState: SyncState;
}

export interface Bookmark {
  id: string;
  profileId: string;
  questionId: string;
  createdAt: number;
}

export interface SyncQueueItem {
  id: string;
  entity: 'attempt' | 'response' | 'bookmark' | 'profile';
  entityId: string;
  operation: 'upsert' | 'delete';
  status: 'pending' | 'failed';
  retryCount: number;
  lastError?: string;
  updatedAt: number;
}

export interface DownloadRecord {
  id: string;
  kind: 'exam-package' | 'video';
  label: string;
  version: string;
  status: 'ready' | 'available' | 'downloading';
  sizeLabel: string;
  updatedAt: number;
}

class PrepwiseDatabase extends Dexie {
  profiles!: Table<StudentProfile, string>;
  subjects!: Table<Subject, string>;
  exams!: Table<Exam, string>;
  questions!: Table<Question, string>;
  attempts!: Table<Attempt, string>;
  responses!: Table<Response, string>;
  bookmarks!: Table<Bookmark, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  downloads!: Table<DownloadRecord, string>;

  constructor() {
    super('prepwise-local');
    this.version(1).stores({
      profiles: 'id, updatedAt',
      subjects: 'id, slug, updatedAt',
      exams: 'id, subjectId, year, downloaded, updatedAt',
      questions: 'id, examId, order',
      attempts: 'id, profileId, examId, startedAt, syncState, updatedAt',
      responses: 'id, attemptId, questionId, syncState',
      bookmarks: 'id, profileId, questionId',
      syncQueue: 'id, entity, entityId, status, updatedAt',
      downloads: 'id, kind, status, updatedAt',
    });
  }
}

export const db = new PrepwiseDatabase();

const demoProfile: StudentProfile = {
  id: 'local-demo',
  displayName: 'Henok',
  grade: 'Grade 12',
  goal: 'Score 90%+ in the Matric Exam',
  streak: 7,
  avatarColor: '#2667f5',
  localOnly: true,
  updatedAt: Date.now(),
};

const demoSubjects: Subject[] = [
  { id: 'math', slug: 'mathematics', name: 'Mathematics', shortName: 'Maths', color: '#2f6bff', icon: 'calculator', completedPercent: 72, updatedAt: Date.now() },
  { id: 'physics', slug: 'physics', name: 'Physics', shortName: 'Physics', color: '#8d55ff', icon: 'atom', completedPercent: 48, updatedAt: Date.now() },
  { id: 'chemistry', slug: 'chemistry', name: 'Chemistry', shortName: 'Chem', color: '#17be83', icon: 'flask', completedPercent: 61, updatedAt: Date.now() },
  { id: 'biology', slug: 'biology', name: 'Biology', shortName: 'Bio', color: '#ff961f', icon: 'dna', completedPercent: 36, updatedAt: Date.now() },
  { id: 'english', slug: 'english', name: 'English', shortName: 'English', color: '#10b9a4', icon: 'globe', completedPercent: 54, updatedAt: Date.now() },
];

const demoExams: Exam[] = [
  { id: 'math-2025-p1', subjectId: 'math', title: 'Mathematics Paper 1 · local fixture', year: 2025, questionCount: 3, durationMinutes: 12, packageVersion: '2025.1', downloaded: true, updatedAt: Date.now() },
  { id: 'math-2024-p1', subjectId: 'math', title: 'Mathematics Paper 1', year: 2024, questionCount: 40, durationMinutes: 90, packageVersion: '2024.1', downloaded: false, updatedAt: Date.now() },
  { id: 'physics-2025-p1', subjectId: 'physics', title: 'Physics Paper 1', year: 2025, questionCount: 35, durationMinutes: 90, packageVersion: '2025.1', downloaded: false, updatedAt: Date.now() },
  { id: 'chemistry-2025-p1', subjectId: 'chemistry', title: 'Chemistry Paper 1', year: 2025, questionCount: 35, durationMinutes: 90, packageVersion: '2025.1', downloaded: false, updatedAt: Date.now() },
];

const demoQuestions: Question[] = [
  { id: 'q-math-1', examId: 'math-2025-p1', order: 1, prompt: 'If f(x) = 2x² − 3x + 1, what is f(2)?', options: ['1', '3', '5', '7'], answerIndex: 1, explanation: 'Substitute x = 2: 2(4) − 3(2) + 1 = 8 − 6 + 1 = 3.' },
  { id: 'q-math-2', examId: 'math-2025-p1', order: 2, prompt: 'A sequence starts 4, 7, 10, 13. Which expression gives its nth term?', options: ['3n − 1', '3n + 1', '4n − 1', 'n + 3'], answerIndex: 1, explanation: 'The common difference is 3 and the first term is 4, so aₙ = 4 + (n − 1)3 = 3n + 1. Use the first term to validate the expression.' },
  { id: 'q-math-3', examId: 'math-2025-p1', order: 3, prompt: 'Which transformation maps y = x² to y = (x − 2)² + 3?', options: ['2 left, 3 down', '2 right, 3 up', '2 left, 3 up', '2 right, 3 down'], answerIndex: 1, explanation: 'The minus sign inside the bracket shifts the graph right by 2, and +3 outside shifts it up by 3.' },
];

export async function seedDemoData() {
  const profile = await db.profiles.get(demoProfile.id);
  if (!profile) await db.profiles.add(demoProfile);
  if ((await db.subjects.count()) === 0) await db.subjects.bulkAdd(demoSubjects);
  if ((await db.exams.count()) === 0) await db.exams.bulkAdd(demoExams);
  if ((await db.questions.count()) === 0) await db.questions.bulkAdd(demoQuestions);
  if ((await db.downloads.count()) === 0) {
    await db.downloads.bulkAdd([
      { id: 'download-math-2025', kind: 'exam-package', label: 'Mathematics 2025', version: 'v2025.1', status: 'ready', sizeLabel: '2.4 MB', updatedAt: Date.now() },
      { id: 'download-video-functions', kind: 'video', label: 'Functions: quick revision', version: '720p', status: 'available', sizeLabel: '38 MB', updatedAt: Date.now() },
    ]);
  }
}

export async function recordResponse(input: Omit<Response, 'id' | 'answeredAt' | 'syncState'>) {
  const response: Response = {
    ...input,
    id: `${input.attemptId}:${input.questionId}`,
    answeredAt: Date.now(),
    syncState: 'pending',
  };
  await db.responses.put(response);
  await db.syncQueue.put({
    id: `response:${response.id}`,
    entity: 'response',
    entityId: response.id,
    operation: 'upsert',
    status: 'pending',
    retryCount: 0,
    updatedAt: Date.now(),
  });
}

export async function createAttempt(examId: string, profileId = demoProfile.id) {
  const attempt: Attempt = {
    id: `attempt:${profileId}:${examId}:${Date.now()}`,
    profileId,
    examId,
    startedAt: Date.now(),
    score: 0,
    total: 0,
    syncState: 'pending',
    updatedAt: Date.now(),
  };
  await db.attempts.put(attempt);
  await db.syncQueue.put({ id: `attempt:${attempt.id}`, entity: 'attempt', entityId: attempt.id, operation: 'upsert', status: 'pending', retryCount: 0, updatedAt: Date.now() });
  return attempt;
}

export async function completeAttempt(attemptId: string, score: number, total: number) {
  const now = Date.now();
  await db.transaction('rw', db.attempts, db.syncQueue, async () => {
    await db.attempts.update(attemptId, { score, total, completedAt: now, syncState: 'pending', updatedAt: now });
    await db.syncQueue.put({ id: `attempt:${attemptId}`, entity: 'attempt', entityId: attemptId, operation: 'upsert', status: 'pending', retryCount: 0, updatedAt: now });
  });
}

export async function toggleBookmark(profileId: string, questionId: string) {
  const id = `bookmark:${profileId}:${questionId}`;
  const existing = await db.bookmarks.get(id);
  if (existing) {
    await db.bookmarks.delete(id);
    return false;
  }
  await db.bookmarks.put({ id, profileId, questionId, createdAt: Date.now() });
  return true;
}
