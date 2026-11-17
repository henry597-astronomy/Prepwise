import { NavLink } from 'react-router-dom';
import { Bot, ClipboardList, Home, PlayCircle, UserRound } from 'lucide-react';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/exams', label: 'Exams', icon: ClipboardList },
  { to: '/practice', label: 'Practice', icon: PlayCircle },
  { to: '/ai', label: 'AI', icon: Bot },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={21} strokeWidth={2.2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
