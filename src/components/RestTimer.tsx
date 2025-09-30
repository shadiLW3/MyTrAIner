import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface RestTimerProps {
  visible: boolean;
  duration: number; // in seconds
  exerciseName: string;
  onClose: () => void;
  onAdjust: (newDuration: number) => void;
}

export default function RestTimer({ visible, duration, exerciseName, onClose, onAdjust }: RestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-200));
  const [notificationId, setNotificationId] = useState<string | null>(null);

  // Reset timer when visibility or duration changes
  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration);
      setIsActive(true);
      requestNotificationPermissions();
      
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
      
      // Schedule notification for the full duration
      scheduleNotification(duration);
    } else {
      // Cancel any pending notification
      if (notificationId) {
        Notifications.cancelScheduledNotificationAsync(notificationId);
        setNotificationId(null);
      }
      setIsActive(false);
      
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
    }
  };

  const scheduleNotification = async (seconds: number) => {
    try {
      // Cancel any existing notification
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }

      // Only schedule if there's time remaining
      if (seconds > 0) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Rest Complete! 💪',
            body: `Time for your next set of ${exerciseName}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { seconds },
        });
        
        setNotificationId(id);
      }
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0 && visible) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            // Timer complete
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => onClose(), 1000); // Auto-close after 1 second
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, visible, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = async (adjustment: number) => {
    const newTime = Math.max(0, timeRemaining + adjustment);
    setTimeRemaining(newTime);
    onAdjust(newTime);
    
    // Reschedule notification with new time
    await scheduleNotification(newTime);
    
    // Light haptic feedback for adjustments
    Haptics.selectionAsync();
  };

  const togglePause = () => {
    setIsActive(!isActive);
    if (!isActive && timeRemaining > 0) {
      // Resuming - reschedule notification
      scheduleNotification(timeRemaining);
    } else if (isActive && notificationId) {
      // Pausing - cancel notification
      Notifications.cancelScheduledNotificationAsync(notificationId);
      setNotificationId(null);
    }
  };

  const skip = async () => {
    setIsActive(false);
    // Cancel notification
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.restLabel}>REST</Text>
        <TouchableOpacity onPress={skip} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.exerciseTitle}>{exerciseName}</Text>
      
      <Text style={[
        styles.timeText,
        timeRemaining === 0 && styles.timeTextFinished
      ]}>
        {formatTime(timeRemaining)}
      </Text>
      
      {timeRemaining === 0 ? (
        <Text style={styles.finishedText}>Complete!</Text>
      ) : (
        <View style={styles.controls}>
          <View style={styles.adjustControls}>
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustTime(-15)}
            >
              <Text style={styles.adjustButtonText}>-15</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.pauseButton}
              onPress={togglePause}
            >
              <Text style={styles.pauseButtonText}>
                {isActive ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => adjustTime(15)}
            >
              <Text style={styles.adjustButtonText}>+15</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restLabel: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 2,
  },
  closeButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseTitle: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    fontVariant: ['tabular-nums'],
  },
  timeTextFinished: {
    color: '#10B981',
  },
  finishedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    marginTop: 8,
  },
  adjustControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pauseButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});