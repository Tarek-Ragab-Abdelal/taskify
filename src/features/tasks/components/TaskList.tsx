import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../theme';
import { Task, Tag } from '../types/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  refreshing = false,
  onRefresh,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  emptyMessage = 'No tasks yet. Add one above!',
}) => {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tagMap = new Map<string, Tag>();
    for (const task of tasks) {
      // Defensive check: ensure tags exists and is an array
      if (task.tags && Array.isArray(task.tags)) {
        for (const tag of task.tags) {
          if (tag?.id) {
            tagMap.set(tag.id, tag);
          }
        }
      }
    }
    return Array.from(tagMap.values());
  }, [tasks]);

  // Filter tasks based on selected tags
  const filteredTasks = useMemo(() => {
    if (selectedTags.length === 0) return tasks;
    return tasks.filter(task => 
      task.tags && Array.isArray(task.tags) && task.tags.some(tag => selectedTags.includes(tag.id))
    );
  }, [tasks, selectedTags]);

  const toggleTagFilter = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
  };
  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
      onEdit={onEditTask}
    />
  );

  const renderTagFilter = () => {
    if (allTags.length === 0) return null;

    return (
      <View style={styles.tagFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScrollContainer}
        >
          <TouchableOpacity
            style={[
              styles.tagChip,
              { borderColor: colors.border, backgroundColor: selectedTags.length === 0 ? colors.primary : colors.surface }
            ]}
            onPress={clearAllFilters}
          >
            <Text style={[
              styles.tagChipText,
              { color: selectedTags.length === 0 ? colors.white : colors.textSecondary }
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {allTags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagChip,
                { borderColor: tag.color },
                selectedTags.includes(tag.id) && [

                  { backgroundColor: tag.color }
                ]
              ]}
              onPress={() => toggleTagFilter(tag.id)}
            >
              <Text style={[
                styles.tagChipText,
                { color: selectedTags.includes(tag.id) ? colors.white : colors.textSecondary }
              ]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading tasks...</Text>
    </View>
  );

  if (loading && tasks.length === 0) {
    return renderLoadingState();
  }

  return (
    <View style={styles.container}>
      {renderTagFilter()}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.contentContainer,
          filteredTasks.length === 0 && styles.emptyContentContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />
    </View>
  );
};

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  tagFilterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tagScrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 24,
  },
  tagChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  tagChipText: {
    ...typography.caption,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    includeFontPadding: false,
    textAlignVertical: 'center' as const,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContentContainer: {
    justifyContent: 'center' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center' as const,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
    color: colors.textSecondary,
  },
});
