// src/types/index.ts

// === USER & AUTH TYPES ===
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  onboardingComplete: boolean;
  preferences: {
    units: 'imperial' | 'metric';
    restTimerEnabled: boolean;
    defaultRestTime: number;
    autoStartTimer: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
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
  goals: string[];
  equipment: Equipment[];
  
  // Availability
  daysPerWeek: number;
  minutesPerSession: number;
  preferredDays?: string[];
  
  // Preferences
  intensityPreference: 'relaxed' | 'moderate' | 'aggressive';
  
  updatedAt?: Date;
}

// === EXERCISE TYPES ===
export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'bodyweight' | 'machine' | 'kettlebell' | 'bands';
export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'glutes';
export type ExerciseType = 'weight_reps' | 'time' | 'distance_time' | 'reps_only';

export type MuscleGroup = 
  // Upper body
  'chest' | 'lats' | 'rhomboids' | 'traps' | 'lower_back' | 
  'front_delts' | 'side_delts' | 'rear_delts' | 
  'biceps' | 'triceps' | 'forearms' |
  // Core
  'abs' | 'obliques' | 
  // Lower body  
  'quads' | 'hamstrings' | 'glutes' | 'calves' | 'hip_flexors' | 'adductors' | 'abductors';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  trackingType?: ExerciseType;
}

export interface Set {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completed: boolean;
  rpe?: number;
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

// === TEMPLATE & PROGRAM TYPES ===
export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    repsRange: string; // e.g., "8-12"
    notes?: string;
    restTime?: number;
  }[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  lastUsed: Date | null;
  useCount: number;
}

export interface ProgramDay {
  weekNumber: number;
  dayNumber: number;
  name: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    repsRange: string;
    intensityNote?: string; // e.g., "RPE 8" or "70% 1RM"
    restTime?: number;
  }[];
  notes?: string;
}

export interface WorkoutProgram {
  id: string;
  userId: string;
  name: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  goal: 'strength' | 'muscle' | 'endurance' | 'general';
  days: ProgramDay[];
  
  // Progress tracking
  isActive: boolean;
  startDate: Date | null;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: number;
  totalWorkouts: number;
  
  createdAt: Date;
  completedAt?: Date;
}

// === PROGRESSION & HISTORY TYPES ===
export interface ExerciseHistory {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  workoutId: string;
  date: Date;
  sets: Set[];
  
  // Calculated stats
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
  avgReps: number;
  
  notes: string | null;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  
  // Different PR types
  oneRepMax?: number;
  oneRepMaxDate?: Date;
  oneRepMaxActual?: Set; // Actual set that achieved this
  
  maxWeight?: number;
  maxWeightDate?: Date;
  
  maxReps?: number;
  maxRepsDate?: Date;
  maxRepsWeight?: number;
  
  maxVolumeSet?: number; // Single set with highest volume
  maxVolumeSetDate?: Date;
  maxVolumeSetDetails?: Set;
  
  lastUpdated: Date;
}

export interface ProgressionStats {
  exerciseId: string;
  periodDays: number;
  startDate: Date;
  endDate: Date;
  workoutCount: number;
  
  // Percentage improvements
  volumeIncrease: number;
  strengthIncrease: number;
  
  // Trend data for charts
  volumeTrend: VolumeData[];
  weightTrend: VolumeData[];
  repsTrend: VolumeData[];
}

export interface VolumeData {
  date: Date;
  value: number;
}

// === SOCIAL TYPES ===
export interface WorkoutShare {
  id: string;
  userId: string;
  workoutId: string;
  caption?: string;
  isPublic: boolean;
  likes: string[]; // User IDs who liked
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// === NOTIFICATION TYPES ===
export interface AppNotification {
  id: string;
  userId: string;
  type: 'workout_reminder' | 'rest_complete' | 'streak_milestone' | 'new_pr' | 'social';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// === ANALYTICS TYPES ===
export interface WorkoutAnalytics {
  userId: string;
  period: 'week' | 'month' | 'year' | 'all';
  startDate: Date;
  endDate: Date;
  
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalVolume: number;
  averageWorkoutDuration: number;
  averageWorkoutVolume: number;
  
  muscleGroupDistribution: {
    [key in MuscleGroup]?: number; // percentage
  };
  
  consistencyScore: number; // 0-100
  progressScore: number; // 0-100
  
  bestWorkout?: {
    date: Date;
    volume: number;
    prs: number;
  };
}