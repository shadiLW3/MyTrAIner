import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExerciseSettings {
  restTime: number; // in seconds
  lastUsed: Date;
}

export class ExerciseSettingsService {
  private static readonly STORAGE_KEY = 'exercise_settings';

  // Get rest time for a specific exercise
  static async getExerciseRestTime(exerciseId: string): Promise<number> {
    try {
      const settings = await this.getAllExerciseSettings();
      return settings[exerciseId]?.restTime || 90; // Default 90 seconds
    } catch (error) {
      console.error('Error getting exercise rest time:', error);
      return 90; // Default fallback
    }
  }

  // Set rest time for a specific exercise
  static async setExerciseRestTime(exerciseId: string, restTime: number): Promise<void> {
    try {
      const settings = await this.getAllExerciseSettings();
      settings[exerciseId] = {
        restTime,
        lastUsed: new Date()
      };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error setting exercise rest time:', error);
    }
  }

  // Get all exercise settings
  static async getAllExerciseSettings(): Promise<{ [exerciseId: string]: ExerciseSettings }> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        // Convert date strings back to Date objects
        Object.keys(settings).forEach(key => {
          settings[key].lastUsed = new Date(settings[key].lastUsed);
        });
        return settings;
      }
      return {};
    } catch (error) {
      console.error('Error getting all exercise settings:', error);
      return {};
    }
  }

  // Get recommended rest times based on exercise type
  static getDefaultRestTime(exerciseCategory: string, equipment: string): number {
    // Strength training rest times based on exercise type
    if (equipment === 'barbell' || exerciseCategory === 'legs') {
      return 180; // 3 minutes for compound movements
    } else if (equipment === 'dumbbell') {
      return 120; // 2 minutes for dumbbell exercises
    } else if (equipment === 'bodyweight') {
      return 90; // 1.5 minutes for bodyweight
    } else if (equipment === 'cable' || exerciseCategory === 'arms') {
      return 75; // 1 minute 15 seconds for isolation
    } else {
      return 90; // Default 1.5 minutes
    }
  }

  // Update rest time when user adjusts it during workout
  static async updateRestTimeFromAdjustment(
    exerciseId: string, 
    newRestTime: number, 
    shouldRemember: boolean = true
  ): Promise<void> {
    if (shouldRemember && newRestTime > 0) {
      await this.setExerciseRestTime(exerciseId, newRestTime);
    }
  }

  // Get exercise statistics (for future analytics)
  static async getExerciseStats(exerciseId: string): Promise<{
    totalUses: number;
    averageRestTime: number;
    lastUsed: Date | null;
  }> {
    try {
      const settings = await this.getAllExerciseSettings();
      const exerciseSettings = settings[exerciseId];
      
      if (!exerciseSettings) {
        return {
          totalUses: 0,
          averageRestTime: 90,
          lastUsed: null
        };
      }

      return {
        totalUses: 1, // For now, just track if it exists
        averageRestTime: exerciseSettings.restTime,
        lastUsed: exerciseSettings.lastUsed
      };
    } catch (error) {
      console.error('Error getting exercise stats:', error);
      return {
        totalUses: 0,
        averageRestTime: 90,
        lastUsed: null
      };
    }
  }

  // Clear all exercise settings (for testing/reset)
  static async clearAllSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing exercise settings:', error);
    }
  }
}