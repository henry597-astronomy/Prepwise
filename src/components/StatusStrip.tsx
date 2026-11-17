import { CloudOff, CloudUpload, Radio, RefreshCw } from 'lucide-react';

type StatusStripProps = {
  isOnline: boolean;
  pendingCount: number;
  failedCount: number;
  cloudConfigured: boolean;
};

export function StatusStrip({ isOnline, pendingCount, failedCount, cloudConfigured }: StatusStripProps) {
  const syncLabel = failedCount > 0 ? 'Synchronization failed' : pendingCount > 0 ? 'Pending synchronization' : !cloudConfigured ? 'Local-only' : isOnline ? 'Synced' : 'Offline-ready';
  const syncIcon = failedCount > 0 || !cloudConfigured ? <CloudOff size={14} /> : pendingCount > 0 ? <RefreshCw size={14} /> : <CloudUpload size={14} />;

  return (
    <div className="status-strip" role="status" aria-live="polite">
      <span className={`connection-dot ${isOnline ? 'online' : 'offline'}`} />
      <span>{isOnline ? 'Online' : 'Offline mode'}</span>
      <span className="status-divider" />
      <span className={`sync-status ${pendingCount > 0 || failedCount > 0 ? 'pending' : ''}`}>{syncIcon}{syncLabel}</span>
      {isOnline && <Radio size={13} className="status-live" />}
    </div>
  );
}
