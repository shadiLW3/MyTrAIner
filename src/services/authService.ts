// src/services/authService.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    User as FirebaseUser,
    updateProfile,
    sendPasswordResetEmail
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  import { User, UserProfile } from '../types';
  
  export class AuthService {
    private static currentUser: User | null = null;
  
    // Listen to auth state changes
    static subscribeToAuthChanges(callback: (user: User | null) => void) {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await this.getUserData(firebaseUser.uid);
          this.currentUser = userData;
          callback(userData);
        } else {
          this.currentUser = null;
          callback(null);
        }
      });
    }
  
    // Sign up new user
    static async signUp(email: string, password: string, displayName: string): Promise<User> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user: firebaseUser } = userCredential;
        
        // Update display name
        await updateProfile(firebaseUser, { displayName });
        
        // Create user document in Firestore
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName,
          createdAt: new Date(),
          onboardingComplete: false,
          preferences: {
            units: 'imperial',
            restTimerEnabled: true,
            defaultRestTime: 90,
            autoStartTimer: false,
            soundEnabled: true,
            vibrationEnabled: true,
          }
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        
        this.currentUser = userData;
        return userData;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Sign in existing user
    static async signIn(email: string, password: string): Promise<User> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await this.getUserData(userCredential.user.uid);
        this.currentUser = userData;
        return userData;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Sign out
    static async signOut(): Promise<void> {
      try {
        await signOut(auth);
        this.currentUser = null;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Reset password
    static async resetPassword(email: string): Promise<void> {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Get user data from Firestore
    private static async getUserData(uid: string): Promise<User> {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      return { id: uid, ...userDoc.data() } as User;
    }
  
    // Update user profile
    static async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
      if (!this.currentUser) throw new Error('No user logged in');
      
      try {
        await updateDoc(doc(db, 'userProfiles', this.currentUser.id), updates);
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Create or update full user profile (for onboarding)
    static async saveUserProfile(profile: Omit<UserProfile, 'userId'>): Promise<void> {
      if (!this.currentUser) throw new Error('No user logged in');
      
      try {
        const profileData: UserProfile = {
          ...profile,
          userId: this.currentUser.id,
          updatedAt: new Date(),
        };
        
        await setDoc(doc(db, 'userProfiles', this.currentUser.id), profileData);
        
        // Mark onboarding as complete
        await updateDoc(doc(db, 'users', this.currentUser.id), {
          onboardingComplete: true
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Get user profile
    static async getUserProfile(): Promise<UserProfile | null> {
      if (!this.currentUser) return null;
      
      try {
        const profileDoc = await getDoc(doc(db, 'userProfiles', this.currentUser.id));
        if (!profileDoc.exists()) return null;
        
        return { userId: this.currentUser.id, ...profileDoc.data() } as UserProfile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    }
  
    // Update user preferences
    static async updateUserPreferences(preferences: Partial<User['preferences']>): Promise<void> {
      if (!this.currentUser) throw new Error('No user logged in');
      
      try {
        await updateDoc(doc(db, 'users', this.currentUser.id), {
          preferences: { ...this.currentUser.preferences, ...preferences }
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    // Get current user
    static getCurrentUser(): User | null {
      return this.currentUser;
    }
  
    // Check if user is logged in
    static isAuthenticated(): boolean {
      return auth.currentUser !== null;
    }
  }