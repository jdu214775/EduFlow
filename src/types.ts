export type Language = 'ja' | 'en' | 'uz';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  subject: string;
  progress: number;
  members: string[];
  tasksCount: {
    total: number;
    completed: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export interface JWTStep {
  title: string;
  description: string;
  sender: 'client' | 'server';
  status: 'idle' | 'active' | 'completed';
}

export interface MongoCollection {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    isRef?: boolean;
  }[];
}
