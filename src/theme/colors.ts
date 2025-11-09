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
  primary: '#007a57',        
  primaryLight: '#4FE5B4',   
  primaryDark: '#004b38',    
  secondary: '#C49A2A',      
  background: '#F4F7F6',     
  surface: '#FFFFFF',        
  card: '#FCFEFD',           
  text: '#05251F',           
  textSecondary: '#2E6B5F',  
  textMuted: '#6B6F6B',      
  border: '#E6F0EC',         
  success: '#00C985',        
  warning: '#F5B942',        
  error: '#D1433E',          
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const darkColors: Colors = {
  primary: '#06A57B',        
  primaryLight: '#5EEAC7',   
  primaryDark: '#037354',    
  secondary: '#D4AF37',      
  background: '#03100E',     
  surface: '#07231F',        
  card: '#0E2E28',           
  text: '#E9F7F4',           
  textSecondary: '#BFECE1',  
  textMuted: '#8AA9A0',      
  border: '#0B3E37',         
  success: '#34D399',        
  warning: '#FBBF24',        
  error: '#FF6B6B',          
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorTheme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';