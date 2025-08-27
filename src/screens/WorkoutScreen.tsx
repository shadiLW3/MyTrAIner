import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Exercise, WorkoutExercise, Set } from '../types';

export default function WorkoutScreen() {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([
    {
      exercise: { id: '1', name: 'Bench Press', category: 'chest', equipment: 'barbell' },
      sets: [
        { reps: 0, weight: 0, completed: false },
        { reps: 0, weight: 0, completed: false },
        { reps: 0, weight: 0, completed: false },
      ]
    }
  ]);

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
    const newExercises = [...workoutExercises];
    const numValue = parseInt(value) || 0;
    newExercises[exerciseIndex].sets[setIndex][field] = numValue;
    setWorkoutExercises(newExercises);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...workoutExercises];
    newExercises[exerciseIndex].sets[setIndex].completed = !newExercises[exerciseIndex].sets[setIndex].completed;
    setWorkoutExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...workoutExercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      completed: false
    });
    setWorkoutExercises(newExercises);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Workout</Text>
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {workoutExercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
            
            <View style={styles.setHeader}>
              <Text style={styles.setHeaderText}>SET</Text>
              <Text style={styles.setHeaderText}>PREVIOUS</Text>
              <Text style={styles.setHeaderText}>LBS</Text>
              <Text style={styles.setHeaderText}>REPS</Text>
              <Text style={styles.setHeaderText}>✓</Text>
            </View>

            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setNumber}>{setIndex + 1}</Text>
                <Text style={styles.previousText}>-</Text>
                
                <TextInput
                  style={styles.input}
                  value={set.weight ? set.weight.toString() : ''}
                  onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'weight', value)}
                  keyboardType="numeric"
                  placeholder="0"
                />
                
                <TextInput
                  style={styles.input}
                  value={set.reps ? set.reps.toString() : ''}
                  onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', value)}
                  keyboardType="numeric"
                  placeholder="0"
                />
                
                <TouchableOpacity
                  style={[styles.checkBox, set.completed && styles.checkBoxCompleted]}
                  onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
                >
                  {set.completed && <Text style={styles.checkMark}>✓</Text>}
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

        <TouchableOpacity style={styles.addExerciseButton}>
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    width: 50,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  setNumber: {
    width: 50,
    textAlign: 'center',
    fontWeight: '600',
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
    borderColor: '#DDD',
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: '#FFF',
  },
  checkBox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#DDD',
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
  addSetButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  addExerciseButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addExerciseText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
});