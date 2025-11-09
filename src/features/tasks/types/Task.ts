export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'all' | 'active' | 'completed' | 'overdue';

export interface TaskFilter {
  status: TaskStatus;
  searchQuery?: string;
  tagIds?: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: Date;
  tags?: Tag[];
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
  tags?: Tag[];
}

export type TaskAction = 
  | { type: 'ADD_TASK'; payload: CreateTaskInput }
  | { type: 'UPDATE_TASK'; payload: UpdateTaskInput }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'CLEAR_TASKS' };