import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme';
import { CreateTaskInput } from '../types/Task';

interface TaskInputProps {
  onAddTask: (input: CreateTaskInput) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  loading = false,
  error,
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      
      // Clear inputs after successful addition
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (err) {
      // Error is displayed via the error prop from the parent component
      console.warn('Task addition failed:', err);
    }
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      handleAddTask();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
          <Text style={[styles.errorText, { color: colors.white }]}>{error}</Text>
        </View>
      )}
      
      <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.white }]}>
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          onSubmitEditing={handleTitleSubmit}
          editable={!loading}
          multiline={false}
          maxLength={100}
        />
        
        <TouchableOpacity
          style={[styles.expandButton, { backgroundColor: colors.primary }]}
          onPress={toggleExpanded}
          disabled={loading}
        >
          <Text style={[styles.expandButtonText, { color: colors.white }]}>
            {isExpanded ? '−' : '+'}
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <TextInput
          style={[styles.descriptionInput, { borderColor: colors.border, backgroundColor: colors.white, color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add description (optional)"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!loading}
          maxLength={500}
        />
      )}

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: (loading || !title.trim()) ? colors.textMuted : colors.primary }
        ]}
        onPress={handleAddTask}
        disabled={loading || !title.trim()}
      >
        <Text style={[
          styles.addButtonText,
          { color: colors.white, opacity: (loading || !title.trim()) ? 0.7 : 1 }
        ]}>
          {loading ? 'Adding...' : 'Add Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
  },
  errorContainer: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    flex: 1,
    paddingVertical: 16,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  expandButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  descriptionInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 80,
  },
  addButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});