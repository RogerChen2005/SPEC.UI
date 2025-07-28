export type ThemePreference = 'dark' | 'light' | 'system';

export interface LayoutArea {
    id: number;
    title: string;
    description: string;
    x: number; 
    y: number; 
    width: number;
    height: number; 
}