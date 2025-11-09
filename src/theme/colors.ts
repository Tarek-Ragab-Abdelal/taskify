export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  white: string;
  black: string;
  transparent: string;
}

export const lightColors: Colors = {
  primary: '#006b47ff',        // Light emerald for dark mode
  primaryLight: '#34D399',   // Light emerald
  primaryDark: '#003725ff',    // Dark emerald
  secondary: '#D4AF37',      // Gold
  background: '#FAFAF9',     // Warm off-white
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1C1917',           // Rich black
  textSecondary: '#44403C',  // Warm gray
  textMuted: '#78716C',      // Muted warm gray
  border: '#E7E5E4',         // Subtle warm border
  success: '#10B981',        // Emerald
  warning: '#F59E0B',        // Amber/gold tone
  error: '#ac0000ff',          // Bright red
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const darkColors: Colors = {
  primary: '#006b47ff',        // Light emerald for dark mode
  primaryLight: '#6EE7B7',   // Lighter emerald
  primaryDark: '#003725ff',    // Standard emerald
  secondary: '#FBBF24',      // Bright gold
  background: '#0C0A09',     // Rich black
  surface: '#1C1917',        // Dark warm surface
  card: '#292524',           // Elevated dark surface
  text: '#FAFAF9',           // Off-white
  textSecondary: '#E7E5E4',  // Light warm gray
  textMuted: '#A8A29E',      // Muted warm gray
  border: '#44403C',         // Dark warm border
  success: '#34D399',        // Light emerald
  warning: '#FBBF24',        // Bright gold
  error: '#ac0000ff',          // Bright red
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorTheme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';