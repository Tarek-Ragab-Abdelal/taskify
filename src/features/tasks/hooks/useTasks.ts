import { useState, useEffect, useCallback } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Task, CreateTaskInput, TaskFilter } from '../types/Task';
import { TaskService } from '../services/taskService';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  
  // Task operations
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  
  // Filter operations
  setFilter: (filter: TaskFilter) => void;
  setSearchQuery: (query: string) => void;
  
  // Statistics
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all' });

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);


  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await TaskService.getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to external changes from TaskService (so other parts of the app
  // that call TaskService directly will cause this hook to reload tasks).
  useEffect(() => {
    const unsubscribe = TaskService.subscribe(() => {
      // reload tasks when service notifies of changes
      loadTasks();
    });

    return () => {
      // ensure unsubscribe returns void
      unsubscribe();
    };
  }, [loadTasks]);

  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      setError(null);
      
      // Validate input
      const validationErrors = TaskService.validateTaskInput(input);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      const newTask = await TaskService.createTask(input);
      
      // Animate the addition
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setError(null);
      const updatedTask = await TaskService.updateTask(id, updates);
      
      if (updatedTask) {
        setTasks(prevTasks =>
          prevTasks.map(task => task.id === id ? updatedTask : task)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedTask = await TaskService.toggleTaskCompletion(id);
      
      if (updatedTask) {
        // Animate the state change
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(prevTasks =>
          prevTasks.map(task => task.id === id ? updatedTask : task)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await TaskService.deleteTask(id);
      
      if (success) {
        // Animate the removal
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const clearAllTasks = useCallback(async () => {
    try {
      setError(null);
      await TaskService.clearAllTasks();
      
      // Animate the clearing
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear tasks');
    }
  }, []);

  const setFilterStatus = useCallback((newFilter: TaskFilter) => {
    setFilter(newFilter);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilter(prevFilter => ({ ...prevFilter, searchQuery: query }));
  }, []);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    switch (filter.status) {
      case 'active':
        if (task.completed) return false;
        break;
      case 'completed':
        if (!task.completed) return false;
        break;
      case 'all':
      default:
        break;
    }

    // Filter by search query
    if (filter.searchQuery?.trim()) {
      const query = filter.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      
      if (!titleMatch && !descriptionMatch) return false;
    }

    return true;
  });

  // Sort tasks: incomplete first, then by creation date (newest first)
  const sortedFilteredTasks = [...filteredTasks].sort((a, b) => {
    try {
      // First, sort by completion status (incomplete tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then sort by creation date (newest first)
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    } catch (error) {
      console.error('Error sorting tasks:', error, 'Task A:', a, 'Task B:', b);
      return 0;
    }
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return {
    tasks,
    filteredTasks: sortedFilteredTasks,
    loading,
    error,
    filter,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearAllTasks,
    setFilter: setFilterStatus,
    setSearchQuery,
    totalTasks,
    completedTasks,
    activeTasks,
  };
};