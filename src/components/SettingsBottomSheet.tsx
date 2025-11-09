import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { BottomSheet } from './BottomSheet';
import { useTheme, FontSize } from '../theme';
import { TaskService } from '../features/tasks';

interface SettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, isDark, fontSize, setFontSize, setTheme } = useTheme();

  const handleThemeToggle = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const fontSizeOptions: { label: string; value: FontSize }[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const performClearData = () => {
    (async () => {
      try {
        await TaskService.clearAll();
        onClose();
        // Small delay to ensure modal is closed
        setTimeout(() => {
          Alert.alert('Success', 'All tasks have been cleared.');
        }, 200);
      } catch (error) {
        console.error('Failed to clear tasks:', error);
        Alert.alert('Error', 'Failed to clear tasks. Please try again.');
      }
    })().catch(console.error);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: performClearData,
        },
      ]
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height="60%">
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }, typography.h3]}>
          Settings
        </Text>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }, typography.subtitle1]}>
            Appearance
          </Text>
          
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }, typography.body1]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Font Size Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }, typography.subtitle1]}>
            Font Size
          </Text>
          
          <View style={styles.fontSizeContainer}>
            {fontSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.fontSizeOption,
                  {
                    backgroundColor: fontSize === option.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFontSize(option.value)}
              >
                <Text
                  style={[
                    styles.fontSizeLabel,
                    {
                      color: fontSize === option.value ? colors.white : colors.text,
                    },
                    typography.body2,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }, typography.subtitle1]}>
            Data Management
          </Text>
          
          <TouchableOpacity
            style={[
              styles.dangerButton,
              { backgroundColor: colors.error, borderColor: colors.error }
            ]}
            onPress={handleClearData}
          >
            <Text style={[styles.dangerButtonText, { color: colors.white }, typography.button]}>
              Clear All Tasks
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }, typography.caption]}>
            Taskify v1.0.0
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLabel: {
    flex: 1,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontSizeLabel: {
    textAlign: 'center',
  },
  dangerButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});