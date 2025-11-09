import { TextStyle } from 'react-native';
import { FontSize } from './colors';

export interface Typography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  caption: TextStyle;
  button: TextStyle;
  overline: TextStyle;
}

const fontScaleMap: Record<FontSize, number> = {
  small: 0.85,
  medium: 1,
  large: 1.15,
};

export const createTypography = (fontSize: FontSize = 'medium'): Typography => {
  const scale = fontScaleMap[fontSize];
  
  return {
    h1: {
      fontSize: Math.round(32 * scale),
      fontWeight: '700',
      lineHeight: Math.round(40 * scale),
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: Math.round(28 * scale),
      fontWeight: '600',
      lineHeight: Math.round(36 * scale),
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: Math.round(24 * scale),
      fontWeight: '600',
      lineHeight: Math.round(32 * scale),
      letterSpacing: 0,
    },
    h4: {
      fontSize: Math.round(20 * scale),
      fontWeight: '600',
      lineHeight: Math.round(28 * scale),
      letterSpacing: 0.15,
    },
    body1: {
      fontSize: Math.round(16 * scale),
      fontWeight: '400',
      lineHeight: Math.round(24 * scale),
      letterSpacing: 0.15,
    },
    body2: {
      fontSize: Math.round(14 * scale),
      fontWeight: '400',
      lineHeight: Math.round(20 * scale),
      letterSpacing: 0.25,
    },
    subtitle1: {
      fontSize: Math.round(16 * scale),
      fontWeight: '600',
      lineHeight: Math.round(24 * scale),
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: Math.round(14 * scale),
      fontWeight: '600',
      lineHeight: Math.round(20 * scale),
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: Math.round(12 * scale),
      fontWeight: '400',
      lineHeight: Math.round(16 * scale),
      letterSpacing: 0.4,
    },
    button: {
      fontSize: Math.round(16 * scale),
      fontWeight: '600',
      lineHeight: Math.round(24 * scale),
      letterSpacing: 0.1,
      textTransform: 'uppercase',
    },
    overline: {
      fontSize: Math.round(10 * scale),
      fontWeight: '600',
      lineHeight: Math.round(16 * scale),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
  };
};

// Default typography for backward compatibility
export const typography: Typography = createTypography('medium');

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;