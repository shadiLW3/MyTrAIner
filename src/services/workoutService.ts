import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Workout, WorkoutExercise } from '../types';

export class WorkoutService {
  private static readonly COLLECTION_NAME = 'workouts';

  // Save a completed workout
  static async saveWorkout(workout: Omit<Workout, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...workout,
        date: workout.date,
        createdAt: new Date(),
      });
      
      console.log('Workout saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  }

  // Get user's workout history
  static async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const workouts: Workout[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(), // Convert Firestore timestamp to Date
        } as Workout);
      });
      
      return workouts;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }

  // Get recent workouts (last 10)
  static async getRecentWorkouts(userId: string): Promise<Workout[]> {
    try {
      const workouts = await this.getUserWorkouts(userId);
      return workouts.slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
      throw error;
    }
  }

  // Calculate workout statistics
  static calculateWorkoutStats(exercises: WorkoutExercise[]) {
    const completedSets = exercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(set => set.completed).length;
    }, 0);

    const totalVolume = exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        if (set.completed && set.weight && set.reps) {
          return exerciseTotal + (set.weight * set.reps);
        }
        return exerciseTotal;
      }, 0);
    }, 0);

    const totalSets = exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);

    return {
      completedSets,
      totalSets,
      totalVolume,
      exerciseCount: exercises.length,
    };
  }

  // Create workout object from current session
  static createWorkoutFromSession(
    userId: string,
    name: string,
    exercises: WorkoutExercise[],
    startTime: Date,
    endTime: Date
  ): Omit<Workout, 'id'> {
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // in minutes
    const stats = this.calculateWorkoutStats(exercises);

    return {
      userId,
      name,
      date: endTime,
      exercises,
      duration,
      completed: true,
      // Optional feedback fields - can be added later
      difficulty: undefined,
      soreness: undefined,
      notes: undefined,
    };
  }

  // Update workout with post-workout feedback
  static async updateWorkoutFeedback(
    workoutId: string,
    feedback: {
      difficulty?: 'easy' | 'just_right' | 'hard';
      soreness?: {
        upper: number;
        lower: number;
        systemic: number;
      };
      notes?: string;
    }
  ): Promise<void> {
    try {
      const workoutRef = doc(db, this.COLLECTION_NAME, workoutId);
      await updateDoc(workoutRef, feedback);
      console.log('Workout feedback updated');
    } catch (error) {
      console.error('Error updating workout feedback:', error);
      throw error;
    }
  }
}

// Utility functions for formatting
export const formatWorkoutDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k lbs`;
  }
  return `${volume.toLocaleString()} lbs`;
};

export const getWorkoutSummary = (workout: Workout): string => {
  const exerciseNames = workout.exercises.map(e => e.exercise.name);
  if (exerciseNames.length <= 3) {
    return exerciseNames.join(', ');
  }
  return `${exerciseNames.slice(0, 2).join(', ')}, +${exerciseNames.length - 2} more`;
};