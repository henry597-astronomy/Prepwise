import { db } from '@/db/schema';

export async function markExamPackageReady(downloadId: string) {
  await db.downloads.update(downloadId, { status: 'ready', updatedAt: Date.now() });
}

export async function removeVideoDownload(downloadId: string) {
  const item = await db.downloads.get(downloadId);
  if (item?.kind === 'video') await db.downloads.update(downloadId, { status: 'available', updatedAt: Date.now() });
}
