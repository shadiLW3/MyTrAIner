import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useWorkouts } from '../hooks/useWorkouts';
import { formatWorkoutDuration, formatVolume, getWorkoutSummary } from '../services/workoutService';

export default function HomeScreen() {
  const navigation = useNavigation();
  
  // For now, use mock user ID - we'll add proper auth later
  const mockUserId = "user123";
  const { workouts, recentWorkouts, loading, error, refreshWorkouts, stats } = useWorkouts(mockUserId);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshWorkouts();
    }, [])
  );

  const navigateToWorkout = () => {
    navigation.navigate('Workout' as never);
  };

  const getTodaysWorkout = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return workouts.find(workout => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === today.getTime();
    });
  };

  const todaysWorkout = getTodaysWorkout();

  if (loading && workouts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Loading your workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshWorkouts} />
        }
      >
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
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}</Text>
          </View>
          
          {todaysWorkout ? (
            <View style={styles.todayWorkoutCard}>
              <Text style={styles.workoutTitle}>{todaysWorkout.name} ✅</Text>
              <Text style={styles.workoutSubtitle}>
                {getWorkoutSummary(todaysWorkout)}
              </Text>
              <View style={styles.workoutStats}>
                <Text style={styles.statText}>
                  {formatWorkoutDuration(todaysWorkout.duration || 0)} • {todaysWorkout.exercises.length} exercises
                </Text>
              </View>
              <TouchableOpacity style={styles.completedWorkoutButton}>
                <Text style={styles.completedWorkoutText}>Completed Today!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.todayWorkoutCard}>
              <Text style={styles.workoutTitle}>Ready to Train? 💪</Text>
              <Text style={styles.workoutSubtitle}>Start your workout for today</Text>
              <View style={styles.workoutStats}>
                <Text style={styles.statText}>No workout completed today</Text>
              </View>
              <TouchableOpacity style={styles.startWorkoutButton} onPress={navigateToWorkout}>
                <Text style={styles.startWorkoutText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Section */}
        {stats.totalWorkouts > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{formatVolume(stats.totalVolume)}</Text>
                <Text style={styles.statLabel}>Total Volume</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {recentWorkouts.slice(0, 5).map((workout, index) => (
              <View key={workout.id} style={styles.recentWorkoutItem}>
                <View style={styles.recentWorkoutInfo}>
                  <Text style={styles.recentWorkoutTitle}>{workout.name}</Text>
                  <Text style={styles.recentWorkoutDate}>
                    {workout.date.toLocaleDateString()} • {formatWorkoutDuration(workout.duration || 0)}
                  </Text>
                </View>
                <Text style={styles.recentWorkoutExercises}>
                  {workout.exercises.length} exercises
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* First Time User State */}
        {stats.totalWorkouts === 0 && !loading && (
          <View style={styles.section}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏋️‍♂️</Text>
              <Text style={styles.emptyTitle}>Welcome to MyTrainer!</Text>
              <Text style={styles.emptySubtitle}>
                Start your first workout to begin tracking your fitness journey
              </Text>
              <TouchableOpacity style={styles.startFirstWorkoutButton} onPress={navigateToWorkout}>
                <Text style={styles.startFirstWorkoutText}>Start First Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={refreshWorkouts} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  completedWorkoutButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  completedWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  startFirstWorkoutButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startFirstWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '500',
  },
});