// src/services/progressionService.ts
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ExerciseHistory, PersonalRecord, ProgressionStats, VolumeData } from '../types';
import { AuthService } from './authService';
import { Workout } from '../types';

export class ProgressionService {
  private static readonly HISTORY_COLLECTION = 'exerciseHistory';
  private static readonly PR_COLLECTION = 'personalRecords';

  // === EXERCISE HISTORY ===

  // Log exercise performance (called after workout completion)
  static async logExerciseHistory(
    workoutId: string,
    exerciseId: string,
    exerciseName: string,
    sets: any[],
    date: Date
  ): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Calculate stats for this exercise session
      const completedSets = sets.filter(s => s.completed);
      const maxWeight = Math.max(...completedSets.map(s => s.weight || 0));
      const totalVolume = completedSets.reduce((sum, s) => 
        sum + ((s.weight || 0) * (s.reps || 0)), 0
      );
      const totalReps = completedSets.reduce((sum, s) => sum + (s.reps || 0), 0);
      const avgReps = totalReps / completedSets.length || 0;

      const history: Omit<ExerciseHistory, 'id'> = {
        userId: user.id,
        exerciseId,
        exerciseName,
        workoutId,
        date,
        sets: completedSets,
        maxWeight,
        totalVolume,
        totalReps,
        avgReps,
        notes: null
      };

      await addDoc(collection(db, this.HISTORY_COLLECTION), history);

      // Check and update PRs
      await this.checkAndUpdatePRs(exerciseId, exerciseName, completedSets, date);
    } catch (error) {
      console.error('Error logging exercise history:', error);
      throw error;
    }
  }

  // Get exercise history
  static async getExerciseHistory(
    exerciseId: string,
    limitCount: number = 30
  ): Promise<ExerciseHistory[]> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const q = query(
        collection(db, this.HISTORY_COLLECTION),
        where('userId', '==', user.id),
        where('exerciseId', '==', exerciseId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const history: ExerciseHistory[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as ExerciseHistory);
      });

      return history;
    } catch (error) {
      console.error('Error fetching exercise history:', error);
      throw error;
    }
  }

  // Get last workout for exercise
  static async getLastExerciseWorkout(exerciseId: string): Promise<ExerciseHistory | null> {
    const history = await this.getExerciseHistory(exerciseId, 1);
    return history.length > 0 ? history[0] : null;
  }

  // === PERSONAL RECORDS ===

  // Check and update PRs
  private static async checkAndUpdatePRs(
    exerciseId: string,
    exerciseName: string,
    sets: any[],
    date: Date
  ): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    try {
      // Get current PRs for this exercise
      const prDoc = await getDoc(doc(db, this.PR_COLLECTION, `${user.id}_${exerciseId}`));
      const currentPRs = prDoc.exists() ? prDoc.data() as PersonalRecord : null;

      // Calculate potential new PRs
      const maxWeight = Math.max(...sets.map(s => s.weight || 0));
      const maxReps = Math.max(...sets.map(s => s.reps || 0));
      const maxVolume = Math.max(...sets.map(s => (s.weight || 0) * (s.reps || 0)));
      
      // Find best single set (weight x reps)
      const bestSet = sets.reduce((best, current) => {
        const currentTotal = (current.weight || 0) * (current.reps || 0);
        const bestTotal = (best.weight || 0) * (best.reps || 0);
        return currentTotal > bestTotal ? current : best;
      }, sets[0]);

      let updated = false;
      const updates: any = {
        exerciseId,
        exerciseName,
        userId: user.id,
        lastUpdated: date
      };

      // Check 1RM (estimated using Epley formula if reps > 1)
      if (maxWeight > 0) {
        const estimated1RM = bestSet.reps > 1 
          ? bestSet.weight * (1 + bestSet.reps / 30)
          : bestSet.weight;
        
        if (!currentPRs || estimated1RM > (currentPRs.oneRepMax || 0)) {
          updates.oneRepMax = estimated1RM;
          updates.oneRepMaxDate = date;
          updates.oneRepMaxActual = bestSet;
          updated = true;
        }
      }

      // Check max weight
      if (!currentPRs || maxWeight > (currentPRs.maxWeight || 0)) {
        updates.maxWeight = maxWeight;
        updates.maxWeightDate = date;
        updated = true;
      }

      // Check max reps at any weight
      if (!currentPRs || maxReps > (currentPRs.maxReps || 0)) {
        updates.maxReps = maxReps;
        updates.maxRepsDate = date;
        updates.maxRepsWeight = sets.find(s => s.reps === maxReps)?.weight || 0;
        updated = true;
      }

      // Check max volume in single set
      if (!currentPRs || maxVolume > (currentPRs.maxVolumeSet || 0)) {
        updates.maxVolumeSet = maxVolume;
        updates.maxVolumeSetDate = date;
        updates.maxVolumeSetDetails = sets.find(s => 
          (s.weight || 0) * (s.reps || 0) === maxVolume
        );
        updated = true;
      }

      if (updated) {
        if (prDoc.exists()) {
          await updateDoc(doc(db, this.PR_COLLECTION, `${user.id}_${exerciseId}`), updates);
        } else {
          await addDoc(collection(db, this.PR_COLLECTION), updates);
        }
      }
    } catch (error) {
      console.error('Error updating PRs:', error);
    }
  }

  // Get all PRs for user
  static async getUserPRs(): Promise<PersonalRecord[]> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const q = query(
        collection(db, this.PR_COLLECTION),
        where('userId', '==', user.id),
        orderBy('lastUpdated', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const prs: PersonalRecord[] = [];

      querySnapshot.forEach((doc) => {
        prs.push({
          id: doc.id,
          ...doc.data()
        } as PersonalRecord);
      });

      return prs;
    } catch (error) {
      console.error('Error fetching PRs:', error);
      return [];
    }
  }

  // Get PRs for specific exercise
  static async getExercisePR(exerciseId: string): Promise<PersonalRecord | null> {
    const user = AuthService.getCurrentUser();
    if (!user) return null;

    try {
      const prDoc = await getDoc(doc(db, this.PR_COLLECTION, `${user.id}_${exerciseId}`));
      if (!prDoc.exists()) return null;
      
      return {
        id: prDoc.id,
        ...prDoc.data()
      } as PersonalRecord;
    } catch (error) {
      console.error('Error fetching exercise PR:', error);
      return null;
    }
  }

  // === PROGRESSION STATS ===

  // Calculate progression stats for an exercise
  static async getProgressionStats(
    exerciseId: string,
    days: number = 30
  ): Promise<ProgressionStats> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, this.HISTORY_COLLECTION),
        where('userId', '==', user.id),
        where('exerciseId', '==', exerciseId),
        where('date', '>=', cutoffDate),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const history: ExerciseHistory[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as ExerciseHistory);
      });

      if (history.length < 2) {
        return {
          exerciseId,
          periodDays: days,
          startDate: cutoffDate,
          endDate: new Date(),
          workoutCount: history.length,
          volumeIncrease: 0,
          strengthIncrease: 0,
          volumeTrend: [],
          weightTrend: [],
          repsTrend: []
        };
      }

      // Calculate trends
      const volumeTrend = history.map(h => ({
        date: h.date,
        value: h.totalVolume
      }));

      const weightTrend = history.map(h => ({
        date: h.date,
        value: h.maxWeight
      }));

      const repsTrend = history.map(h => ({
        date: h.date,
        value: h.avgReps
      }));

      // Calculate improvements
      const firstVolume = history[0].totalVolume;
      const lastVolume = history[history.length - 1].totalVolume;
      const volumeIncrease = ((lastVolume - firstVolume) / firstVolume) * 100;

      const firstWeight = history[0].maxWeight;
      const lastWeight = history[history.length - 1].maxWeight;
      const strengthIncrease = ((lastWeight - firstWeight) / firstWeight) * 100;

      return {
        exerciseId,
        periodDays: days,
        startDate: history[0].date,
        endDate: history[history.length - 1].date,
        workoutCount: history.length,
        volumeIncrease,
        strengthIncrease,
        volumeTrend,
        weightTrend,
        repsTrend
      };
    } catch (error) {
      console.error('Error calculating progression stats:', error);
      throw error;
    }
  }

  // Get overall strength progress
  static async getOverallProgress(days: number = 90): Promise<{
    totalWorkouts: number;
    totalVolume: number;
    averageWorkoutVolume: number;
    mostImprovedExercises: Array<{
      exerciseName: string;
      improvement: number;
    }>;
    recentPRs: PersonalRecord[];
  }> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Get all workouts in period
      const workoutQuery = query(
        collection(db, 'workouts'),
        where('userId', '==', user.id),
        where('date', '>=', cutoffDate)
      );
      
      const workoutSnapshot = await getDocs(workoutQuery);
      const workouts: Workout[] = [];
      let totalVolume = 0;

      workoutSnapshot.forEach((doc) => {
        const workout = doc.data() as Workout;
        workouts.push(workout);
        
        // Calculate volume for this workout
        workout.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.completed && set.weight && set.reps) {
              totalVolume += set.weight * set.reps;
            }
          });
        });
      });

      // Get recent PRs
      const prQuery = query(
        collection(db, this.PR_COLLECTION),
        where('userId', '==', user.id),
        where('lastUpdated', '>=', cutoffDate),
        orderBy('lastUpdated', 'desc'),
        limit(5)
      );

      const prSnapshot = await getDocs(prQuery);
      const recentPRs: PersonalRecord[] = [];
      
      prSnapshot.forEach((doc) => {
        recentPRs.push({
          id: doc.id,
          ...doc.data()
        } as PersonalRecord);
      });

      return {
        totalWorkouts: workouts.length,
        totalVolume,
        averageWorkoutVolume: workouts.length > 0 ? totalVolume / workouts.length : 0,
        mostImprovedExercises: [], // Would need more complex calculation
        recentPRs
      };
    } catch (error) {
      console.error('Error getting overall progress:', error);
      throw error;
    }
  }
}