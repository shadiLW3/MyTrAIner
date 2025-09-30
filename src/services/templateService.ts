// src/services/templateService.ts
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WorkoutTemplate, WorkoutProgram, ProgramDay, WorkoutExercise } from '../types';
import { AuthService } from './authService';

export class TemplateService {
  private static readonly TEMPLATES_COLLECTION = 'workoutTemplates';
  private static readonly PROGRAMS_COLLECTION = 'workoutPrograms';

  // === WORKOUT TEMPLATES ===
  
  // Save workout as template
  static async saveAsTemplate(
    name: string,
    description: string,
    exercises: WorkoutExercise[],
    tags: string[] = []
  ): Promise<string> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const template: Omit<WorkoutTemplate, 'id'> = {
        userId: user.id,
        name,
        description,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          sets: ex.sets.length,
          repsRange: this.calculateRepsRange(ex.sets),
          notes: ex.notes,
          restTime: ex.restTime
        })),
        tags,
        isPublic: false,
        createdAt: new Date(),
        lastUsed: null,
        useCount: 0
      };

      const docRef = await addDoc(collection(db, this.TEMPLATES_COLLECTION), template);
      return docRef.id;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }

  // Get user's templates
  static async getUserTemplates(): Promise<WorkoutTemplate[]> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const q = query(
        collection(db, this.TEMPLATES_COLLECTION),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const templates: WorkoutTemplate[] = [];

      querySnapshot.forEach((doc) => {
        templates.push({
          id: doc.id,
          ...doc.data()
        } as WorkoutTemplate);
      });

      return templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Use a template (increment use count, update last used)
  static async useTemplate(templateId: string): Promise<WorkoutTemplate> {
    try {
      const templateRef = doc(db, this.TEMPLATES_COLLECTION, templateId);
      const templateDoc = await getDoc(templateRef);
      
      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }

      const template = { id: templateId, ...templateDoc.data() } as WorkoutTemplate;
      
      // Update usage stats
      await updateDoc(templateRef, {
        lastUsed: new Date(),
        useCount: (template.useCount || 0) + 1
      });

      return template;
    } catch (error) {
      console.error('Error using template:', error);
      throw error;
    }
  }

  // Delete template
  static async deleteTemplate(templateId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.TEMPLATES_COLLECTION, templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // === WORKOUT PROGRAMS ===
  
  // Create a new program
  static async createProgram(
    name: string,
    description: string,
    durationWeeks: number,
    daysPerWeek: number,
    goal: 'strength' | 'muscle' | 'endurance' | 'general'
  ): Promise<string> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const program: Omit<WorkoutProgram, 'id'> = {
        userId: user.id,
        name,
        description,
        durationWeeks,
        daysPerWeek,
        goal,
        days: [],
        isActive: false,
        createdAt: new Date(),
        startDate: null,
        currentWeek: 0,
        currentDay: 0,
        completedWorkouts: 0,
        totalWorkouts: durationWeeks * daysPerWeek
      };

      const docRef = await addDoc(collection(db, this.PROGRAMS_COLLECTION), program);
      return docRef.id;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  }

  // Add day to program
  static async addDayToProgram(
    programId: string,
    day: ProgramDay
  ): Promise<void> {
    try {
      const programRef = doc(db, this.PROGRAMS_COLLECTION, programId);
      const programDoc = await getDoc(programRef);
      
      if (!programDoc.exists()) {
        throw new Error('Program not found');
      }

      const program = programDoc.data() as WorkoutProgram;
      const days = [...(program.days || []), day];

      await updateDoc(programRef, { days });
    } catch (error) {
      console.error('Error adding day to program:', error);
      throw error;
    }
  }

  // Get user's programs
  static async getUserPrograms(): Promise<WorkoutProgram[]> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const q = query(
        collection(db, this.PROGRAMS_COLLECTION),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const programs: WorkoutProgram[] = [];

      querySnapshot.forEach((doc) => {
        programs.push({
          id: doc.id,
          ...doc.data()
        } as WorkoutProgram);
      });

      return programs;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  // Get active program
  static async getActiveProgram(): Promise<WorkoutProgram | null> {
    const user = AuthService.getCurrentUser();
    if (!user) return null;

    try {
      const q = query(
        collection(db, this.PROGRAMS_COLLECTION),
        where('userId', '==', user.id),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as WorkoutProgram;
    } catch (error) {
      console.error('Error fetching active program:', error);
      return null;
    }
  }

  // Start a program
  static async startProgram(programId: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Deactivate any current active programs
      const activeProgram = await this.getActiveProgram();
      if (activeProgram) {
        await updateDoc(doc(db, this.PROGRAMS_COLLECTION, activeProgram.id), {
          isActive: false
        });
      }

      // Activate the new program
      await updateDoc(doc(db, this.PROGRAMS_COLLECTION, programId), {
        isActive: true,
        startDate: new Date(),
        currentWeek: 1,
        currentDay: 1
      });
    } catch (error) {
      console.error('Error starting program:', error);
      throw error;
    }
  }

  // Update program progress
  static async updateProgramProgress(programId: string): Promise<void> {
    try {
      const programRef = doc(db, this.PROGRAMS_COLLECTION, programId);
      const programDoc = await getDoc(programRef);
      
      if (!programDoc.exists()) {
        throw new Error('Program not found');
      }

      const program = programDoc.data() as WorkoutProgram;
      const completedWorkouts = (program.completedWorkouts || 0) + 1;
      let { currentDay, currentWeek, daysPerWeek, durationWeeks } = program;

      // Calculate next day and week
      currentDay++;
      if (currentDay > daysPerWeek) {
        currentDay = 1;
        currentWeek++;
      }

      // Check if program is complete
      const isComplete = currentWeek > durationWeeks;

      await updateDoc(programRef, {
        completedWorkouts,
        currentDay,
        currentWeek,
        isActive: !isComplete,
        completedAt: isComplete ? new Date() : null
      });
    } catch (error) {
      console.error('Error updating program progress:', error);
      throw error;
    }
  }

  // === HELPER METHODS ===

  private static calculateRepsRange(sets: any[]): string {
    if (sets.length === 0) return '0';
    
    const reps = sets.map(s => s.reps).filter(r => r);
    if (reps.length === 0) return '0';
    
    const min = Math.min(...reps);
    const max = Math.max(...reps);
    
    return min === max ? `${min}` : `${min}-${max}`;
  }

  // Get popular public templates
  static async getPopularTemplates(limit: number = 10): Promise<WorkoutTemplate[]> {
    try {
      const q = query(
        collection(db, this.TEMPLATES_COLLECTION),
        where('isPublic', '==', true),
        orderBy('useCount', 'desc'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const templates: WorkoutTemplate[] = [];
      let count = 0;

      querySnapshot.forEach((doc) => {
        if (count < limit) {
          templates.push({
            id: doc.id,
            ...doc.data()
          } as WorkoutTemplate);
          count++;
        }
      });

      return templates;
    } catch (error) {
      console.error('Error fetching popular templates:', error);
      return [];
    }
  }
}