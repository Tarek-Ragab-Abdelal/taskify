import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tag } from '../types/Task';
import { generateId } from '../../../utils';

const TAGS_STORAGE_KEY = '@simpletask_tags';

// Predefined tag colors
const TAG_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9F43', // Orange
  '#8395A7', // Grey
  '#3D5A80', // Dark Blue
];

export class TagService {
  /**
   * Retrieves all tags from storage
   */
  static async getAllTags(): Promise<Tag[]> {
    try {
      const tagsJson = await AsyncStorage.getItem(TAGS_STORAGE_KEY);
      if (!tagsJson) {
        return [];
      }
      
      return JSON.parse(tagsJson);
    } catch (error) {
      console.error('Error retrieving tags:', error);
      return [];
    }
  }

  /**
   * Saves all tags to storage
   */
  static async saveTags(tags: Tag[]): Promise<void> {
    try {
      const tagsJson = JSON.stringify(tags);
      await AsyncStorage.setItem(TAGS_STORAGE_KEY, tagsJson);
    } catch (error) {
      console.error('Error saving tags:', error);
      throw error;
    }
  }

  /**
   * Creates a new tag or returns existing one with same name
   */
  static async createOrGetTag(name: string): Promise<Tag> {
    const normalizedName = name.trim().toLowerCase();
    const existingTags = await this.getAllTags();
    
    // Check if tag already exists (case-insensitive)
    const existingTag = existingTags.find(
      tag => tag.name.toLowerCase() === normalizedName
    );
    
    if (existingTag) {
      return existingTag;
    }

    // Create new tag
    const newTag: Tag = {
      id: generateId(),
      name: name.trim(),
      color: this.getNextColor(existingTags),
    };

    const updatedTags = [...existingTags, newTag];
    await this.saveTags(updatedTags);
    
    return newTag;
  }

  /**
   * Updates an existing tag
   */
  static async updateTag(tagId: string, updates: Partial<Omit<Tag, 'id'>>): Promise<Tag | null> {
    const tags = await this.getAllTags();
    const tagIndex = tags.findIndex(tag => tag.id === tagId);
    
    if (tagIndex === -1) {
      return null;
    }

    const updatedTag = {
      ...tags[tagIndex],
      ...updates,
    };

    tags[tagIndex] = updatedTag;
    await this.saveTags(tags);
    
    return updatedTag;
  }

  /**
   * Deletes a tag
   */
  static async deleteTag(tagId: string): Promise<boolean> {
    const tags = await this.getAllTags();
    const filteredTags = tags.filter(tag => tag.id !== tagId);
    
    if (filteredTags.length === tags.length) {
      return false; // Tag not found
    }

    await this.saveTags(filteredTags);
    return true;
  }

  /**
   * Gets the most frequently used tags
   */
  static async getPopularTags(limit: number = 10): Promise<Tag[]> {
    // This would require tracking tag usage in tasks
    // For now, return all tags sorted by name
    const tags = await this.getAllTags();
    const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
    return sortedTags.slice(0, limit);
  }

  /**
   * Gets the next available color for a new tag
   */
  private static getNextColor(existingTags: Tag[]): string {
    const usedColors = new Set(existingTags.map(tag => tag.color));
    const availableColors = TAG_COLORS.filter(color => !usedColors.has(color));
    
    if (availableColors.length > 0) {
      return availableColors[0];
    }
    
    // If all colors are used, cycle through them
    return TAG_COLORS[existingTags.length % TAG_COLORS.length];
  }

  /**
   * Validates tag input
   */
  static validateTagName(name: string): string[] {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Tag name is required');
    }
    
    if (name && name.trim().length > 20) {
      errors.push('Tag name must be 20 characters or less');
    }
    
    if (name && !/^[a-zA-Z0-9\s]+$/.test(name.trim())) {
      errors.push('Tag name can only contain letters, numbers, and spaces');
    }
    
    return errors;
  }
}