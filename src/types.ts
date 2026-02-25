import { User, Mail, Briefcase, Calendar, CheckCircle2, Clock, ChevronRight, Plus, Search, Filter, MoreVertical, Sparkles } from 'lucide-react';

export type Stage = 'Applied' | 'Screening' | 'Technical' | 'Culture' | 'Job Offer';

export type UserRole = 'HR' | 'COMPANY';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  stage: Stage;
  appliedDate: string;
  avatar: string;
  notes?: string;
}

export const STAGES: Stage[] = ['Applied', 'Screening', 'Technical', 'Culture', 'Job Offer'];

export const STAGE_CONFIG: Record<Stage, { icon: any; color: string; description: string }> = {
  'Applied': { icon: Clock, color: 'blue', description: 'Initial application received' },
  'Screening': { icon: Search, color: 'purple', description: 'Initial HR screening call' },
  'Technical': { icon: Briefcase, color: 'amber', description: 'Technical assessment or interview' },
  'Culture': { icon: User, color: 'rose', description: 'Team and culture fit interview' },
  'Job Offer': { icon: CheckCircle2, color: 'emerald', description: 'Final offer extended' },
};

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'Senior Frontend Engineer',
    company: 'TechFlow Inc.',
    stage: 'Technical',
    appliedDate: '2024-02-15',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    notes: 'Strong React background, very impressive portfolio.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    role: 'Product Designer',
    company: 'CreativePulse',
    stage: 'Applied',
    appliedDate: '2024-02-20',
    avatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    role: 'Backend Developer',
    company: 'TechFlow Inc.',
    stage: 'Job Offer',
    appliedDate: '2024-01-10',
    avatar: 'https://picsum.photos/seed/elena/100/100',
    notes: 'Exceptional system design skills.'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'dkim@example.com',
    role: 'DevOps Engineer',
    company: 'CloudScale',
    stage: 'Screening',
    appliedDate: '2024-02-18',
    avatar: 'https://picsum.photos/seed/david/100/100',
  }
];
