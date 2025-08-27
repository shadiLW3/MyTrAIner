// User and Profile Types
export interface User {
    id: string;
    email: string;
    createdAt: Date;
    onboardingComplete: boolean;
  }
  
  export interface UserProfile {
    userId: string;
    // Basic info
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female' | 'other';
    
    // Training info
    experience: 'beginner' | 'intermediate' | 'advanced';
    mode: 'lifter' | 'runner' | 'hybrid';
    goals: string; // Free text initially
    equipment: Equipment[];
    
    // Availability
    daysPerWeek: number;
    minutesPerSession: number;
    preferredDays?: string[];
    
    // Preferences
    intensityPreference: 'relaxed' | 'moderate' | 'aggressive';
  }
  
  // Exercise and Workout Types
  export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'bodyweight' | 'machine' | 'kettlebell' | 'bands';
  export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'glutes';
  
  export interface Exercise {
    id: string;
    name: string;
    category: MuscleGroup;
    equipment: Equipment;
    primaryMuscles: MuscleGroup[];
    secondaryMuscles?: MuscleGroup[];
  }
  
  export interface Set {
    reps: number;
    weight: number;
    completed: boolean;
    rpe?: number; // Rate of Perceived Exertion (1-10)
  }
  
  export interface WorkoutExercise {
    exercise: Exercise;
    sets: Set[];
    notes?: string;
    restTime?: number; // in seconds
  }
  
  export interface Workout {
    id: string;
    userId: string;
    name: string;
    date: Date;
    exercises: WorkoutExercise[];
    duration?: number; // in minutes
    completed: boolean;
    
    // AI feedback fields
    difficulty?: 'easy' | 'just_right' | 'hard';
    soreness?: {
      upper: number; // 0-3
      lower: number; // 0-3
      systemic: number; // 0-3
    };
    notes?: string;
  }
  
  // Program and Planning Types
  export interface Program {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    weeks: Week[];
    aiGenerated: boolean;
  }
  
  export interface Week {
    weekNumber: number;
    startDate: Date;
    workouts: PlannedWorkout[];
  }
  
  export interface PlannedWorkout {
    dayOfWeek: number; // 0-6 (Sun-Sat)
    name: string;
    exercises: PlannedExercise[];
    targetDuration: number;
    rationale?: string; // AI explanation
  }
  
  export interface PlannedExercise {
    exercise: Exercise;
    sets: number;
    reps: string; // Can be range like "8-12"
    intensity?: string; // Like "70% 1RM" or "RPE 7"
    restTime?: number;
  }
  
  // AI Adaptation Types
  export interface AdaptationEvent {
    userId: string;
    timestamp: Date;
    workoutId: string;
    changes: {
      what: string;
      from: any;
      to: any;
      reason: string;
    }[];
  }
  
  export interface TrainingLog {
    userId: string;
    date: Date;
    workoutId: string;
    completion: 'done' | 'skipped' | 'partial';
    difficulty: 'easy' | 'just_right' | 'hard';
    soreness: {
      upper: number;
      lower: number;
      systemic: number;
    };
    notes?: string;
  }