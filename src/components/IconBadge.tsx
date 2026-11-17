import { Atom, BarChart3, BookOpen, Calculator, Dna, FlaskConical, Globe2, Lightbulb, Play, Target } from 'lucide-react';

const icons = { calculator: Calculator, atom: Atom, flask: FlaskConical, dna: Dna, globe: Globe2, target: Target, exams: BookOpen, practice: BarChart3, ai: Lightbulb, resources: BookOpen, play: Play };

type IconBadgeProps = { name: keyof typeof icons; color: string; size?: 'small' | 'large' };

export function IconBadge({ name, color, size = 'large' }: IconBadgeProps) {
  const Icon = icons[name];
  return <span className={`icon-badge ${size}`} style={{ background: color }}><Icon size={size === 'large' ? 25 : 18} strokeWidth={2.2} /></span>;
}
