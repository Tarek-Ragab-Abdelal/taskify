import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Task } from '../types/Task';
import { formatRelativeTime } from '../../../utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

/**
 * Improved swipe UX:
 * - Actions (Delete / Edit) are fully hidden when not swiped.
 * - Action buttons animate/slide in smoothly, with opacity driven by swipe.
 * - Main content translates with the gesture using native driver where possible.
 * - Tapping the item will close the actions (if open).
 *
 * Notes / next steps:
 * - For even better touch handling (and fewer edge-cases), consider migrating
 *   to react-native-gesture-handler's Swipeable component. This implementation
 *   intentionally avoids adding deps and keeps PanResponder.
 * - If you want "only one row open at a time", we should lift an "openRowId"
 *   state to the parent (TaskList) and close other rows when a new one opens.
 */
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { colors } = useTheme();

  // Animated values (useRef to avoid re-creating on re-renders)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;

  const [isOpen, setIsOpen] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const actionWidth = 84; // width of each action area

  // Interpolations for the left (delete) action
  const deleteTranslate = swipeAnim.interpolate({
    inputRange: [0, actionWidth],
    outputRange: [-actionWidth, 0],
    extrapolate: 'clamp',
  });
  const deleteOpacity = swipeAnim.interpolate({
    inputRange: [0, actionWidth * 0.25, actionWidth],
    outputRange: [0, 0.6, 1],
    extrapolate: 'clamp',
  });

  // Interpolations for the right (edit) action
  const editTranslate = swipeAnim.interpolate({
    inputRange: [-actionWidth, 0],
    outputRange: [0, actionWidth],
    extrapolate: 'clamp',
  });
  const editOpacity = swipeAnim.interpolate({
    inputRange: [-actionWidth, -actionWidth * 0.25, 0],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  // PanResponder to capture horizontal swipes only
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // horizontal swipe threshold & minimal vertical movement
        return Math.abs(gestureState.dx) > 6 && Math.abs(gestureState.dy) < 12;
      },
      onPanResponderGrant: () => {
        // stop any running animations
        swipeAnim.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        // clamp the value to actionWidth bounds
        let newValue = gestureState.dx;
        if (newValue > actionWidth) newValue = actionWidth;
        if (newValue < -actionWidth) newValue = -actionWidth;
        swipeAnim.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Decide where to snap: left open (edit) / right open (delete) / closed
        if (gestureState.dx <= -actionWidth / 2) {
          // snap left (show edit)
          Animated.timing(swipeAnim, {
            toValue: -actionWidth,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => setIsOpen(true));
        } else if (gestureState.dx >= actionWidth / 2) {
          // snap right (show delete)
          Animated.timing(swipeAnim, {
            toValue: actionWidth,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => setIsOpen(true));
        } else {
          // snap closed
          Animated.timing(swipeAnim, {
            toValue: 0,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => setIsOpen(false));
        }
      },
      onPanResponderTerminate: () => {
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => setIsOpen(false));
      },
    })
  ).current;

  const handleToggle = () => {
    // subtle scale feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(task.id);
  };

  const closeActions = (animate = true) => {
    if (animate) {
      Animated.timing(swipeAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      swipeAnim.setValue(0);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    closeActions();
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  const handleEdit = () => {
    closeActions();
    onEdit && onEdit(task);
  };

  // When user taps the main content: if actions are open, close them; otherwise do nothing (or could toggle complete)
  const onPressContent = () => {
    if (isOpen) {
      closeActions();
    } else {
      // No close needed; keep tap area small for toggling/checking
    }
  };

  return (
    <View style={[styles.swipeContainer, { overflow: 'hidden' }]}>
      {/* Left (Delete) action - revealed by swiping right (positive translateX) */}
      <Animated.View
        style={[
          styles.hiddenActionsLeft,
          {
            width: actionWidth,
            transform: [{ translateX: deleteTranslate }],
            opacity: deleteOpacity,
            backgroundColor: colors.error,
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity style={styles.swipeAction} onPress={handleDelete}>
          <Ionicons name="trash" size={22} color={colors.white} />
          <Text style={[styles.actionText, { color: colors.white }]}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Right (Edit) action - revealed by swiping left (negative translateX) */}
      {onEdit && (
        <Animated.View
          style={[
            styles.hiddenActionsRight,
            {
              width: actionWidth,
              transform: [{ translateX: editTranslate }],
              opacity: editOpacity,
              backgroundColor: colors.primary,
            },
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity style={styles.swipeAction} onPress={handleEdit}>
            <Ionicons name="pencil" size={22} color={colors.white} />
            <Text style={[styles.actionText, { color: colors.white }]}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Main content: translates horizontally with swipeAnim */}
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.black,
            transform: [
              { scale: scaleAnim },
              { translateX: swipeAnim }, // use native driver compatible transform
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.85}
          onPress={onPressContent}
        >
          {/* Checkbox */}
          <TouchableOpacity onPress={handleToggle}>
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.border, backgroundColor: colors.white },
                task.completed && [styles.checkboxCompleted, { backgroundColor: colors.success, borderColor: colors.success }],
              ]}
            >
              {task.completed && <Text style={[styles.checkmark, { color: colors.white }]}>✓</Text>}
            </View>
          </TouchableOpacity>

          {/* Task Content */}
          <View style={styles.taskContent}>
            <Text
              style={[
                styles.title,
                { color: task.completed ? colors.textMuted : colors.text },
                task.completed && styles.titleCompleted,
              ]}
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text
                style={[
                  styles.description,
                  { color: task.completed ? colors.textMuted : colors.textSecondary },
                  task.completed && styles.descriptionCompleted,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {task.description}
              </Text>
            ) : null}

            <Text style={[styles.timestamp, { color: colors.textMuted }]}>
              {formatRelativeTime(task.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  checkboxCompleted: {
    // dynamic color applied inline
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
    flexShrink: 1,
  },
  descriptionCompleted: {},
  timestamp: {
    fontSize: 12,
  },
  swipeContainer: {
    position: 'relative',
  },
  hiddenActionsLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    marginVertical: 6,
    marginLeft: 24,
  },
  hiddenActionsRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    marginVertical: 6,
    marginRight: 24,
  },
  swipeAction: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  editAction: {},
  deleteAction: {},
});