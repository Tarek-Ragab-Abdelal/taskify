import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomSheet } from './BottomSheet';
import { useTheme } from '../theme/ThemeContext';
import { CreateTaskInput } from '../features/tasks/types/Task';
import DateTimePickerComponent from './DateTimePickerComponent';

interface AddTaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onTaskAdded: (input: CreateTaskInput) => Promise<void>;
}

interface TaskForm {
  title: string;
  description: string;
  dueDate: Date | null;
  tags: string[];
}

const PRESET_TAGS = [
  'Work',
  'Personal',
  'Urgent',
  'Important',
  'Shopping',
  'Health',
  'Finance',
  'Study',
];

export const AddTaskBottomSheet: React.FC<AddTaskBottomSheetProps> = ({
  visible,
  onClose,
  onTaskAdded,
}) => {
  const { colors, typography } = useTheme();
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    dueDate: null,
    tags: [],
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const newTask: CreateTaskInput = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate || undefined,
        tags: form.tags.length > 0 ? form.tags.map(tagName => ({
          id: tagName.toLowerCase().split(/\s+/).join('-'),
          name: tagName,
          color: '#007AFF',
        })) : undefined,
      };
      
      await onTaskAdded(newTask);
      
      // Show success message BEFORE closing to avoid Alert after unmount
      Alert.alert('Success', 'Task created successfully!', [
        {
          text: 'OK',
          onPress: () => handleClose(),
        }
      ]);
    } catch (error) {
      console.error('Failed to create task:', error);
      Alert.alert('Error', `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      dueDate: null,
      tags: [],
    });
    onClose();
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const removeDueDate = () => {
    setForm(prev => ({ ...prev, dueDate: null }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // iOS fires 'set' on every scroll; just update the form
    if (event?.type === 'set' && selectedDate) {
      setForm(prev => ({ ...prev, dueDate: selectedDate }));
    }
    // Do NOT close here for iOS. For Android, closing is handled by onComplete below.
    if (event?.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const styles = getStyles(colors, typography);

  return (
    <BottomSheet visible={visible} onClose={handleClose} height="85%">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                placeholderTextColor={colors.textSecondary}
                value={form.title}
                onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
                multiline={false}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter task description (optional)"
                placeholderTextColor={colors.textSecondary}
                value={form.description}
                onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              {form.dueDate ? (
                <View style={styles.dueDateContainer}>
                  <Text style={styles.dueDateText}>
                    {form.dueDate.toLocaleDateString()} at {form.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <TouchableOpacity onPress={removeDueDate} style={styles.removeDateButton}>
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={showDatePicker}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={styles.dateButtonText}>Set due date</Text>
                </TouchableOpacity>
              )}
              {isDatePickerVisible && (
                <View style={{ marginTop: 12 }}>
                  <DateTimePickerComponent
                    value={form.dueDate || new Date()}
                    mode="datetime"
                    onChange={handleDateChange}
                    onComplete={() => {
                      // Safe to close on Android after time is picked
                      if (Platform.OS === 'android') {
                        setIsDatePickerVisible(false);
                      }
                    }}
                  />
                  {Platform.OS === 'ios' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                      <TouchableOpacity
                        onPress={() => setIsDatePickerVisible(false)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: colors.primary
                        }}
                      >
                        <Text style={{ ...typography.button, color: colors.surface }}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Tags */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tags</Text>
              <View style={styles.tagsContainer}>
                {PRESET_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      form.tags.includes(tag) && styles.selectedTag,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        form.tags.includes(tag) && styles.selectedTagText,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheet>
  );
};

const getStyles = (colors: any, typography: any) => ({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...typography.subtitle1,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600' as const,
  },
  input: {
    ...typography.body1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
  },
  dueDateContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dueDateText: {
    ...typography.body1,
    color: colors.text,
  },
  removeDateButton: {
    padding: 4,
  },
  dateButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    ...typography.body1,
    color: colors.primary,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTag: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedTagText: {
    color: colors.surface,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});