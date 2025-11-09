import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, typography, spacing, borderRadius } from '../theme';
import { SettingsBottomSheet } from '../components/SettingsBottomSheet';
import { AddTaskBottomSheet } from '../components/AddTaskBottomSheet';
import { EditTaskBottomSheet } from '../components/EditTaskBottomSheet';
import { TaskStatus } from '../features/tasks';
import { CreateTaskInput, Task } from '../features/tasks/types/Task';

interface Tab {
  id: TaskStatus;
  label: string;
  badge?: number;
}

interface TabNavigatorProps {
  children: (activeTab: TaskStatus, onEditTask: (task: Task) => void) => React.ReactNode;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  onTabChange?: (activeTab: TaskStatus) => void;
  onAddTask: (input: CreateTaskInput) => Promise<void>;
  onUpdateTask?: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  children,
  totalTasks,
  activeTasks,
  completedTasks,
  onTabChange,
  onAddTask,
  onUpdateTask,
}) => {
  const [activeTab, setActiveTab] = useState<TaskStatus>('all');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [editTaskVisible, setEditTaskVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { colors, typography: themedTypography } = useTheme();
  const styles = getStyles(colors, themedTypography);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskVisible(true);
  };

  const tabs: Tab[] = [
    {
      id: 'all',
      label: 'All Tasks',
      badge: totalTasks,
    },
    {
      id: 'active',
      label: 'Active',
      badge: activeTasks,
    },
    {
      id: 'completed',
      label: 'Completed',
      badge: completedTasks,
    },
  ];

  const renderTab = (tab: Tab) => {
    const isActive = activeTab === tab.id;
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={[styles.tab, isActive && styles.tabActive]}
        onPress={() => {
          setActiveTab(tab.id);
          onTabChange?.(tab.id);
        }}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {tab.label}
        </Text>
        {tab.badge !== undefined && tab.badge > 0 && (
          <View style={[styles.badge, isActive && styles.badgeActive]}>
            <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
              {tab.badge}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Taskify</Text>
            <Text style={styles.subtitle}>
              {totalTasks === 0
                ? 'Your Personal Task Manager'
                : `${activeTasks} active, ${completedTasks} completed`}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map(renderTab)}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children(activeTab, handleEditTask)}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddTaskVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      {/* Settings Bottom Sheet */}
      <SettingsBottomSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Add Task Bottom Sheet */}
      <AddTaskBottomSheet
        visible={addTaskVisible}
        onClose={() => setAddTaskVisible(false)}
        onTaskAdded={onAddTask}
      />

      {/* Edit Task Bottom Sheet */}
      <EditTaskBottomSheet
        visible={editTaskVisible}
        task={editingTask}
        onClose={() => {
          setEditTaskVisible(false);
          setEditingTask(null);
        }}
        onTaskUpdated={async (updatedTask) => {
          if (onUpdateTask) {
            await onUpdateTask(updatedTask.id, updatedTask);
          }
          setEditTaskVisible(false);
          setEditingTask(null);
        }}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any, themedTypography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  settingsButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  title: {
    ...themedTypography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...themedTypography.body2,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...themedTypography.subtitle2,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  badge: {
    backgroundColor: colors.textMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginLeft: spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: colors.white,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});