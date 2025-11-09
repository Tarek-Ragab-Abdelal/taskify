import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, CreateTaskInput } from '../types/Task';
import { generateId } from '../../../utils';

const TASKS_STORAGE_KEY = '@simpletask_tasks';

type ChangeListener = () => void;

export class TaskService {
  // Simple in-memory subscriber list so callers can react when tasks change
  private static readonly listeners: Set<ChangeListener> = new Set();

  /**
   * Subscribe to changes in task storage. Returns an unsubscribe function.
   */
  static subscribe(listener: ChangeListener) {
    this.listeners.add(listener);
    // Return an unsubscribe function that returns void (avoid returning boolean from Set.delete)
    return () => { this.listeners.delete(listener); };
  }

  private static emitChange() {
    for (const l of Array.from(this.listeners)) {
      try {
        l();
      } catch (err) {
        // Protect callers from throw in listeners
        // eslint-disable-next-line no-console
        console.error('TaskService listener error', err);
      }
    }
  }
  /**
   * Retrieves all tasks from storage
   */
  static async getAllTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (!tasksJson) {
        return [];
      }
      
      const tasks = JSON.parse(tasksJson);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        tags: task.tags || [],
      }));
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return [];
    }
  }

  /**
   * Saves all tasks to storage
   */
  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const tasksJson = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, tasksJson);
      // Notify subscribers after successfully saving
      this.emitChange();
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  /**
   * Creates a new task
   */
  static async createTask(input: CreateTaskInput): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title: input.title.trim(),
      description: input.description?.trim(),
      completed: false,
      dueDate: input.dueDate,
      tags: Array.isArray(input.tags) ? input.tags : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tasks = await this.getAllTasks();
    tasks.push(newTask);
    await this.saveTasks(tasks);
    
    return newTask;
  }

  /**
   * Updates an existing task
   */
  static async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const tasks = await this.getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    await this.saveTasks(tasks);
    
    return updatedTask;
  }

  /**
   * Toggles task completion status
   */
  static async toggleTaskCompletion(taskId: string): Promise<Task | null> {
    const tasks = await this.getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return null;
    }

    return this.updateTask(taskId, { completed: !task.completed });
  }

  /**
   * Deletes a task
   */
  static async deleteTask(taskId: string): Promise<boolean> {
    const tasks = await this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) {
      return false; // Task not found
    }

    await this.saveTasks(filteredTasks);
    return true;
  }

  /**
   * Clears all tasks
   */
  static async clearAllTasks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
      this.emitChange();
    } catch (error) {
      console.error('Error clearing tasks:', error);
      throw error;
    }
  }

  /**
   * Generates a unique ID for tasks using imported utility
   */
  private static generateId(): string {
    return generateId();
  }

  /**
   * Validates task input
   */
  static validateTaskInput(input: CreateTaskInput): string[] {
    const errors: string[] = [];
    
    if (!input.title || input.title.trim().length === 0) {
      errors.push('Task title is required');
    }
    
    if (input.title && input.title.trim().length > 100) {
      errors.push('Task title must be 100 characters or less');
    }
    
    if (input.description && input.description.trim().length > 500) {
      errors.push('Task description must be 500 characters or less');
    }
    
    return errors;
  }

  /**
   * Clears all tasks from storage
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
      this.emitChange();
    } catch (error) {
      console.error('Error clearing tasks:', error);
      throw new Error('Failed to clear tasks');
    }
  }
}