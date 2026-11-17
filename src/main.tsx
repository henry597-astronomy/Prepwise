import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { seedDemoData } from '@/db/schema';
import App from '@/app/App';
import '@/styles.css';

void seedDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
