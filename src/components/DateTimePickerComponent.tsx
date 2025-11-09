import React, { useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../theme';

interface DateTimePickerComponentProps {
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  onComplete?: () => void;
}

const DateTimePickerComponent: React.FC<DateTimePickerComponentProps> = ({
  value,
  mode,
  onChange,
  minimumDate,
  maximumDate,
  onComplete,
}) => {
  const { colors } = useTheme();

  const [currentMode, setCurrentMode] = useState<'date' | 'time'>(
    mode === 'datetime' ? 'date' : mode
  );
  const [tempDate, setTempDate] = useState<Date>(value);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // On Android, datetime mode requires two pickers
      if (mode === 'datetime') {
        if (event.type === 'set' && selectedDate) {
          if (currentMode === 'date') {
            // User selected date, now show time picker
            setTempDate(selectedDate);
            setCurrentMode('time');
            return;
          } else {
            // User selected time, combine with date and close
            const combinedDate = new Date(tempDate);
            combinedDate.setHours(selectedDate.getHours());
            combinedDate.setMinutes(selectedDate.getMinutes());
            onChange(event, combinedDate);
            // let parent close visibility now that both parts are set
            onComplete?.();
            return;
          }
        } else if (event.type === 'dismissed') {
          // User cancelled
          onChange(event, undefined);
          return;
        }
      }
    }

    // iOS or non-datetime modes; fires continuously on iOS
    onChange(event, selectedDate);
  };

  // For iOS, datetime mode is supported natively. Use theme colors (textColor)
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.iosContainer, { backgroundColor: colors.surface }]}>
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          // textColor is supported on iOS spinner - apply theme text color
          // (available in recent versions of @react-native-community/datetimepicker)
          textColor={colors.text}
        />
      </View>
    );
  }

  // For Android, handle datetime mode with two pickers
  return (
    <DateTimePicker
      value={tempDate}
      mode={currentMode}
      display="default"
      onChange={handleChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
};

const styles = StyleSheet.create({
  iosContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default DateTimePickerComponent;