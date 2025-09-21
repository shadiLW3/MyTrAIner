import { useState, useEffect } from 'react';
import { Workout } from '../types';
import { WorkoutService } from '../services/workoutService';

export const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allWorkouts, recent] = await Promise.all([
        WorkoutService.getUserWorkouts(userId),
        WorkoutService.getRecentWorkouts(userId)
      ]);
      
      setWorkouts(allWorkouts);
      setRecentWorkouts(recent);
    } catch (err) {
      setError('Failed to fetch workouts');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWorkouts = () => {
    fetchWorkouts();
  };

  useEffect(() => {
    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);

  // Calculate stats from workouts
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, workout) => {
    return sum + workout.exercises.reduce((exerciseSum, exercise) => {
      return exerciseSum + exercise.sets.reduce((setSum, set) => {
        if (set.completed && set.weight && set.reps) {
          return setSum + (set.weight * set.reps);
        }
        return setSum;
      }, 0);
    }, 0);
  }, 0);

  // Calculate current streak (consecutive days with workouts)
  const calculateStreak = (): number => {
    if (workouts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedWorkouts = [...workouts].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  return {
    workouts,
    recentWorkouts,
    loading,
    error,
    refreshWorkouts,
    stats: {
      totalWorkouts,
      totalVolume,
      currentStreak,
    }
  };
};