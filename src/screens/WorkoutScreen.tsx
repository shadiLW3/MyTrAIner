import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Exercise, WorkoutExercise, Set } from '../types/index';
import ExerciseSelector from '../components/ExerciseSelector';
import TimeInput from '../components/TimeInput';
import RestTimer from '../components/RestTimer';
import FullScreenTimer from '../components/FullScreenTimer';
import { ExerciseSettingsService } from '../services/exerciseSettingsService';

export default function WorkoutScreen() {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerEnabled, setRestTimerEnabled] = useState(false); // User preference for rest timer
  const [showFullScreenTimer, setShowFullScreenTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(90); // Default 1:30
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(-1);

  // Update current time every second for duration calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate workout stats
  const workoutDuration = Math.floor((currentTime.getTime() - workoutStartTime.getTime()) / 1000);
  const totalVolume = workoutExercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exerciseTotal, set) => {
      if (set.completed && set.weight && set.reps) {
        return exerciseTotal + (set.weight * set.reps);
      }
      return exerciseTotal;
    }, 0);
  }, 0);
  const completedSets = workoutExercises.reduce((total, exercise) => {
    return total + exercise.sets.filter(set => set.completed).length;
  }, 0);

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'duration', value: string | number) => {
    const newExercises = [...workoutExercises];
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    newExercises[exerciseIndex].sets[setIndex][field] = numValue;
    setWorkoutExercises(newExercises);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...workoutExercises];
    const wasCompleted = newExercises[exerciseIndex].sets[setIndex].completed;
    newExercises[exerciseIndex].sets[setIndex].completed = !wasCompleted;
    setWorkoutExercises(newExercises);

    // Only start rest timer if it's enabled AND set was just completed
    if (!wasCompleted && restTimerEnabled) {
      setActiveExerciseIndex(exerciseIndex);
      setRestDuration(newExercises[exerciseIndex].restTime || 90);
      setShowRestTimer(true);
    }
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...workoutExercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      duration: lastSet?.duration || 0,
      completed: false
    });
    setWorkoutExercises(newExercises);
  };

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...workoutExercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      setWorkoutExercises(newExercises);
    }
  };

  const addExercise = (exercise: Exercise) => {
    // Set default trackingType if not provided
    const exerciseWithTracking = {
      ...exercise,
      trackingType: exercise.trackingType || getDefaultTrackingType(exercise)
    };

    const newExercise: WorkoutExercise = {
      exercise: exerciseWithTracking,
      sets: [{
        reps: exerciseWithTracking.trackingType === 'time' ? 0 : 10,
        weight: exerciseWithTracking.trackingType === 'weight_reps' ? 135 : 0,
        duration: exerciseWithTracking.trackingType === 'time' ? 30 : 0,
        completed: false
      }],
      restTime: 90 // Default rest time
    };
    setWorkoutExercises([...workoutExercises, newExercise]);
  };

  // Helper function to determine default tracking type
  const getDefaultTrackingType = (exercise: Exercise): 'weight_reps' | 'time' | 'reps_only' => {
    // Time-based exercises
    if (exercise.name.toLowerCase().includes('plank') || 
        exercise.name.toLowerCase().includes('hold') ||
        exercise.name.toLowerCase().includes('wall sit')) {
      return 'time';
    }
    
    // Bodyweight exercises that are typically reps-only
    if (exercise.equipment === 'bodyweight' && 
        (exercise.name.toLowerCase().includes('push-up') ||
         exercise.name.toLowerCase().includes('pull-up') ||
         exercise.name.toLowerCase().includes('chin-up'))) {
      return 'reps_only';
    }
    
    // Default to weight_reps for most exercises
    return 'weight_reps';
  };

  const deleteExercise = (exerciseIndex: number) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const newExercises = [...workoutExercises];
            newExercises.splice(exerciseIndex, 1);
            setWorkoutExercises(newExercises);
          }
        }
      ]
    );
  };

  const finishWorkout = async () => {
    if (workoutExercises.length === 0) {
      Alert.alert("No Exercises", "Add some exercises before finishing your workout.");
      return;
    }

    Alert.alert(
      "Finish Workout",
      `Save this workout?\n\n• Duration: ${formatDuration(workoutDuration)}\n• Volume: ${totalVolume.toLocaleString()} lbs\n• Sets: ${completedSets}`,
      [
        { text: "Continue", style: "cancel" },
        { 
          text: "Finish", 
          onPress: async () => {
            try {
              // Import the service at the top of the file
              const { WorkoutService } = await import('../services/workoutService');
              
              const endTime = new Date();
              const workoutName = generateWorkoutName(workoutExercises);
              
              // For now, use a mock user ID - we'll add auth later
              const mockUserId = "user123";
              
              const workoutData = WorkoutService.createWorkoutFromSession(
                mockUserId,
                workoutName,
                workoutExercises,
                workoutStartTime,
                endTime
              );
              
              const workoutId = await WorkoutService.saveWorkout(workoutData);
              
              Alert.alert(
                "Workout Saved! 💪",
                "Great job! Your workout has been saved.",
                [
                  {
                    text: "Done",
                    onPress: () => {
                      // Reset workout state
                      setWorkoutExercises([]);
                      setWorkoutStartTime(new Date());
                      setShowRestTimer(false);
                    }
                  }
                ]
              );
            } catch (error) {
              console.error("Error saving workout:", error);
              Alert.alert(
                "Save Failed",
                "Couldn't save your workout. Please try again.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const generateWorkoutName = (exercises: WorkoutExercise[]): string => {
    if (exercises.length === 0) return "Quick Workout";
    
    const categories = exercises.map(e => e.exercise.category);
    const uniqueCategories = [...new Set(categories)];
    
    if (uniqueCategories.includes('chest') && uniqueCategories.includes('shoulders')) {
      return "Push Workout";
    } else if (uniqueCategories.includes('back')) {
      return "Pull Workout";  
    } else if (uniqueCategories.includes('legs')) {
      return "Leg Workout";
    } else if (uniqueCategories.length === 1) {
      return `${uniqueCategories[0].charAt(0).toUpperCase() + uniqueCategories[0].slice(1)} Workout`;
    } else {
      return "Full Body Workout";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWeight = (weight: number) => {
    return weight > 0 ? weight.toString() : '';
  };

  const formatReps = (reps: number) => {
    return reps > 0 ? reps.toString() : '';
  };

  const handleRestTimerAdjust = (newDuration: number) => {
    setRestDuration(newDuration);
    // Optionally update the exercise's rest time as well
    if (activeExerciseIndex >= 0) {
      const newExercises = [...workoutExercises];
      newExercises[activeExerciseIndex].restTime = newDuration;
      setWorkoutExercises(newExercises);
    }
  };

  const toggleRestTimer = () => {
    setRestTimerEnabled(!restTimerEnabled);
    // If disabling, also hide the timer
    if (restTimerEnabled) {
      setShowRestTimer(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Text style={styles.headerButton}>⌄</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Workout</Text>
          <View style={styles.headerActions}>
            {/* Rest Timer Toggle Button */}
            <TouchableOpacity 
              style={[styles.restTimerToggle, restTimerEnabled && styles.restTimerToggleActive]}
              onPress={toggleRestTimer}
            >
              <Text style={[styles.restTimerIcon, restTimerEnabled && styles.restTimerIconActive]}>
                ⏱
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timerButton}
              onPress={() => setShowFullScreenTimer(true)}
            >
              <Text style={styles.timerIcon}>🕐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={finishWorkout}>
              <Text style={styles.finishButton}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(workoutDuration)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{totalVolume.toLocaleString()} lbs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sets</Text>
            <Text style={styles.statValue}>{completedSets}</Text>
          </View>
          <View style={styles.statIcons}>
            <Text style={styles.bodyIcon}>🏃‍♂️</Text>
            <Text style={styles.bodyIcon}>💪</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {workoutExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyTitle}>Get started</Text>
            <Text style={styles.emptySubtitle}>Add an exercise to start your workout</Text>
            <TouchableOpacity style={styles.addExerciseButtonLarge} onPress={() => setShowExerciseSelector(true)}>
              <Text style={styles.addExerciseTextLarge}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {workoutExercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseInfo}>
                    <View style={styles.exerciseIcon}>
                      <Text style={styles.exerciseIconText}>💪</Text>
                    </View>
                    <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteExercise(exerciseIndex)}>
                    <Text style={styles.exerciseMenu}>⋯</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.notesPlaceholder}>Add notes here...</Text>
                
                <View style={styles.setHeader}>
                  <Text style={styles.setHeaderText}>SET</Text>
                  <Text style={styles.setHeaderText}>PREVIOUS</Text>
                  {exercise.exercise.trackingType === 'weight_reps' && (
                    <>
                      <Text style={styles.setHeaderText}>LBS</Text>
                      <Text style={styles.setHeaderText}>REPS</Text>
                    </>
                  )}
                  {exercise.exercise.trackingType === 'time' && (
                    <Text style={[styles.setHeaderText, {width: 100}]}>TIME</Text>
                  )}
                  {exercise.exercise.trackingType === 'reps_only' && (
                    <Text style={styles.setHeaderText}>REPS</Text>
                  )}
                  <Text style={styles.setHeaderText}>✓</Text>
                </View>

                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={[
                    styles.setRow,
                    set.completed && styles.setRowCompleted
                  ]}>
                    <Text style={styles.setNumber}>{setIndex + 1}</Text>
                    <Text style={styles.previousText}>-</Text>
                    
                    {exercise.exercise.trackingType === 'weight_reps' && (
                      <>
                        <TextInput
                          style={styles.input}
                          value={formatWeight(set.weight || 0)}
                          onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'weight', value)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                        <TextInput
                          style={styles.input}
                          value={formatReps(set.reps || 0)}
                          onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', value)}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </>
                    )}
                    
                    {exercise.exercise.trackingType === 'time' && (
                      <TimeInput
                        value={set.duration || 0}
                        onChange={(seconds) => updateSet(exerciseIndex, setIndex, 'duration', seconds)}
                      />
                    )}
                    
                    {exercise.exercise.trackingType === 'reps_only' && (
                      <TextInput
                        style={styles.input}
                        value={formatReps(set.reps || 0)}
                        onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', value)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    )}
                    
                    <TouchableOpacity
                      style={[styles.checkBox, set.completed && styles.checkBoxCompleted]}
                      onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
                    >
                      {set.completed && <Text style={styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => deleteSet(exerciseIndex, setIndex)}>
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity 
                  style={styles.addSetButton}
                  onPress={() => addSet(exerciseIndex)}
                >
                  <Text style={styles.addSetText}>+ Add Set</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addExerciseButton} onPress={() => setShowExerciseSelector(true)}>
              <Text style={styles.addExerciseText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      
      <ExerciseSelector
        visible={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelectExercise={addExercise}
      />

      <FullScreenTimer
        visible={showFullScreenTimer}
        onClose={() => setShowFullScreenTimer(false)}
      />
      
      {/* Rest Timer - Now renders as overlay, not modal */}
      {showRestTimer && (
        <RestTimer
          visible={showRestTimer}
          duration={restDuration}
          exerciseName={activeExerciseIndex >= 0 ? workoutExercises[activeExerciseIndex]?.exercise.name || 'Exercise' : 'Exercise'}
          onClose={() => setShowRestTimer(false)}
          onAdjust={handleRestTimerAdjust}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restTimerToggle: {
    backgroundColor: '#333333',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTimerToggleActive: {
    backgroundColor: '#1E90FF',
  },
  restTimerIcon: {
    fontSize: 20,
    color: '#999999',
  },
  restTimerIconActive: {
    color: '#FFFFFF',
  },
  timerButton: {
    backgroundColor: '#333333',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerIcon: {
    fontSize: 18,
  },
  finishButton: {
    backgroundColor: '#1E90FF',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: '#999999',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '600',
  },
  statIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  bodyIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  addExerciseButtonLarge: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addExerciseTextLarge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseIconText: {
    fontSize: 16,
  },
  exerciseName: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  exerciseMenu: {
    color: '#999999',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notesPlaceholder: {
    color: '#666666',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    width: 50,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  setRowCompleted: {
    backgroundColor: '#0D4F3C',
  },
  setNumber: {
    width: 50,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previousText: {
    width: 50,
    textAlign: 'center',
    color: '#999',
  },
  input: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
  },
  checkBox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#666666',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  checkBoxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#FF4444',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 10,
  },
  addSetButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  addSetText: {
    color: '#999999',
    fontWeight: '600',
  },
  addExerciseButton: {
    backgroundColor: '#1E90FF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addExerciseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});