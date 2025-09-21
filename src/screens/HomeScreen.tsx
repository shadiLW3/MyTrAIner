import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const navigateToWorkout = () => {
    navigation.navigate('Workout' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Quick Start Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity style={styles.quickStartButton} onPress={navigateToWorkout}>
            <Text style={styles.quickStartText}>+ Start Empty Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Workout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}</Text>
          </View>
          
          <View style={styles.todayWorkoutCard}>
            <Text style={styles.workoutTitle}>Push Day 💪</Text>
            <Text style={styles.workoutSubtitle}>Chest, Shoulders, Triceps</Text>
            <View style={styles.workoutStats}>
              <Text style={styles.statText}>45 min • 6 exercises</Text>
            </View>
            <TouchableOpacity style={styles.startWorkoutButton} onPress={navigateToWorkout}>
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Programs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Programs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.programCard}>
            <Text style={styles.programTitle}>5-Day Split</Text>
            <Text style={styles.programSubtitle}>Intermediate • 5 days/week</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressText}>Week 3 of 8</Text>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          
          <View style={styles.recentWorkoutItem}>
            <View style={styles.recentWorkoutInfo}>
              <Text style={styles.recentWorkoutTitle}>Pull Day</Text>
              <Text style={styles.recentWorkoutDate}>Yesterday • 42 min</Text>
            </View>
            <Text style={styles.recentWorkoutExercises}>6 exercises</Text>
          </View>
          
          <View style={styles.recentWorkoutItem}>
            <View style={styles.recentWorkoutInfo}>
              <Text style={styles.recentWorkoutTitle}>Leg Day</Text>
              <Text style={styles.recentWorkoutDate}>2 days ago • 51 min</Text>
            </View>
            <Text style={styles.recentWorkoutExercises}>7 exercises</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  quickStartButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickStartText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
  todayWorkoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  workoutStats: {
    marginBottom: 16,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  startWorkoutButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  startWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  programSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentWorkoutItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  recentWorkoutDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentWorkoutExercises: {
    fontSize: 12,
    color: '#6B7280',
  },
});