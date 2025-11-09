import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TabNavigator } from './TabNavigator';
import { TaskList, useTasks, TaskFilter } from '../features/tasks';

export const RootNavigator: React.FC = () => {
  const {
    filteredTasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    setFilter,
    totalTasks,
    activeTasks,
    completedTasks,
  } = useTasks();

  const handleTabChange = React.useCallback((activeTab: string) => {
    const filter: TaskFilter = {
      status: activeTab as any,
    };
    setFilter(filter);
  }, [setFilter]);

  const renderContent = React.useCallback((activeTab: string, onEditTask: (task: any) => void) => {
    const getEmptyMessage = () => {
      switch (activeTab) {
        case 'active':
          return 'No active tasks. All done! Tap + to add one.';
        case 'completed':
          return 'No completed tasks yet.';
        default:
          return 'No tasks yet. Tap + to add one!';
      }
    };

    return (
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onEditTask={onEditTask}
        emptyMessage={getEmptyMessage()}
      />
    );
  }, [filteredTasks, loading, toggleTask, deleteTask]);

  return (
    <>
      <StatusBar style="auto" />
      <TabNavigator
        totalTasks={totalTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onTabChange={handleTabChange}
        onAddTask={addTask}
        onUpdateTask={updateTask}
      >
        {renderContent}
      </TabNavigator>
    </>
  );
};