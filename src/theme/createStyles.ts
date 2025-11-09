import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { Colors } from './colors';
import { typography, spacing, borderRadius } from './typography';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const createStyles = <T extends NamedStyles<T>>(
  stylesFactory: (colors: Colors) => T
) => {
  return (colors: Colors): T => StyleSheet.create(stylesFactory(colors));
};

// Common style mixins
export const commonStyles = (colors: Colors) => StyleSheet.create({
  // Layout
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerVertical: {
    justifyContent: 'center',
  },
  centerHorizontal: {
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50, // Manual safe area for now
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Text styles
  heading: {
    ...typography.h2,
    color: colors.text,
  },
  subheading: {
    ...typography.h4,
    color: colors.text,
  },
  body: {
    ...typography.body1,
    color: colors.text,
  },
  bodySecondary: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  
  // Buttons
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonSecondaryText: {
    ...typography.button,
    color: colors.primary,
  },
  
  // Form elements
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...typography.body1,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
  },
  
  // Spacing helpers
  marginXs: { margin: spacing.xs },
  marginSm: { margin: spacing.sm },
  marginMd: { margin: spacing.md },
  marginLg: { margin: spacing.lg },
  marginXl: { margin: spacing.xl },
  
  paddingXs: { padding: spacing.xs },
  paddingSm: { padding: spacing.sm },
  paddingMd: { padding: spacing.md },
  paddingLg: { padding: spacing.lg },
  paddingXl: { padding: spacing.xl },
  
  // Margins
  marginTopXs: { marginTop: spacing.xs },
  marginTopSm: { marginTop: spacing.sm },
  marginTopMd: { marginTop: spacing.md },
  marginTopLg: { marginTop: spacing.lg },
  
  marginBottomXs: { marginBottom: spacing.xs },
  marginBottomSm: { marginBottom: spacing.sm },
  marginBottomMd: { marginBottom: spacing.md },
  marginBottomLg: { marginBottom: spacing.lg },
  
  // Borders
  border: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  // Radius
  radiusXs: { borderRadius: borderRadius.xs },
  radiusSm: { borderRadius: borderRadius.sm },
  radiusMd: { borderRadius: borderRadius.md },
  radiusLg: { borderRadius: borderRadius.lg },
  radiusFull: { borderRadius: borderRadius.full },
});