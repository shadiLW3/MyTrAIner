import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

interface FullScreenTimerProps {
  visible: boolean;
  onClose: () => void;
}

export default function FullScreenTimer({ visible, onClose }: FullScreenTimerProps) {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && visible) {
      interval = setInterval(() => {
        if (mode === 'timer' && timeRemaining > 0) {
          setTimeRemaining((time) => {
            if (time <= 1) {
              setIsActive(false);
              handleTimerComplete();
              return 0;
            }
            return time - 1;
          });
        } else if (mode === 'stopwatch') {
          setStopwatchTime((time) => time + 1);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, visible, mode, timeRemaining]);

  const handleTimerComplete = async () => {
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Show alert
    Alert.alert(
      'Timer Complete!',
      'Your timer has finished.',
      [{ text: 'OK', onPress: () => {} }]
    );

    // Schedule notification (in case app is backgrounded)
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Timer Complete!',
          body: 'Your workout timer has finished.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Immediate
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const startTimer = async () => {
    if (mode === 'timer') {
      const totalSeconds = timerMinutes * 60 + timerSeconds;
      if (totalSeconds === 0) {
        Alert.alert('Invalid Time', 'Please set a time greater than 0.');
        return;
      }
      setTimeRemaining(totalSeconds);
      
      // Schedule notification
      try {
        if (notificationId) {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        }
        
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Timer Complete!',
            body: `Your ${formatTime(totalSeconds)} timer has finished.`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { seconds: totalSeconds },
        });
        
        setNotificationId(id);
      } catch (error) {
        console.log('Error scheduling timer notification:', error);
      }
    }
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const reset = async () => {
    setIsActive(false);
    if (mode === 'timer') {
      setTimeRemaining(timerMinutes * 60 + timerSeconds);
    } else {
      setStopwatchTime(0);
    }
    
    // Cancel any pending notification
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setNotificationId(null);
    }
  };

  const handleClose = async () => {
    // Cancel any pending notification
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
    setIsActive(false);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatLongTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTimerTime = (type: 'minutes' | 'seconds', increment: boolean) => {
    if (type === 'minutes') {
      setTimerMinutes(Math.max(0, Math.min(99, timerMinutes + (increment ? 1 : -1))));
    } else {
      setTimerSeconds(Math.max(0, Math.min(59, timerSeconds + (increment ? 1 : -1))));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Timer</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'timer' && styles.modeButtonActive]}
            onPress={() => setMode('timer')}
          >
            <Text style={[styles.modeButtonText, mode === 'timer' && styles.modeButtonTextActive]}>
              Timer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'stopwatch' && styles.modeButtonActive]}
            onPress={() => setMode('stopwatch')}
          >
            <Text style={[styles.modeButtonText, mode === 'stopwatch' && styles.modeButtonTextActive]}>
              Stopwatch
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timer Display */}
        <View style={styles.displayContainer}>
          {mode === 'timer' ? (
            <View style={styles.timerContent}>
              {!isActive && timeRemaining === 0 ? (
                // Timer Setup
                <View style={styles.timerSetup}>
                  <Text style={styles.timerSetupLabel}>Set Timer</Text>
                  <View style={styles.timeInputContainer}>
                    <View style={styles.timeInput}>
                      <TouchableOpacity 
                        style={styles.timeAdjustButton}
                        onPress={() => adjustTimerTime('minutes', true)}
                      >
                        <Text style={styles.timeAdjustText}>+</Text>
                      </TouchableOpacity>
                      <Text style={styles.timeInputValue}>{timerMinutes.toString().padStart(2, '0')}</Text>
                      <TouchableOpacity 
                        style={styles.timeAdjustButton}
                        onPress={() => adjustTimerTime('minutes', false)}
                      >
                        <Text style={styles.timeAdjustText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.timeInputLabel}>min</Text>
                    </View>
                    
                    <Text style={styles.timeSeparator}>:</Text>
                    
                    <View style={styles.timeInput}>
                      <TouchableOpacity 
                        style={styles.timeAdjustButton}
                        onPress={() => adjustTimerTime('seconds', true)}
                      >
                        <Text style={styles.timeAdjustText}>+</Text>
                      </TouchableOpacity>
                      <Text style={styles.timeInputValue}>{timerSeconds.toString().padStart(2, '0')}</Text>
                      <TouchableOpacity 
                        style={styles.timeAdjustButton}
                        onPress={() => adjustTimerTime('seconds', false)}
                      >
                        <Text style={styles.timeAdjustText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.timeInputLabel}>sec</Text>
                    </View>
                  </View>
                </View>
              ) : (
                // Running Timer Display
                <Text style={[styles.timeDisplay, timeRemaining === 0 && styles.timeDisplayComplete]}>
                  {formatTime(timeRemaining)}
                </Text>
              )}
            </View>
          ) : (
            // Stopwatch Display
            <Text style={styles.timeDisplay}>
              {formatLongTime(stopwatchTime)}
            </Text>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {mode === 'timer' ? (
            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={reset}
              >
                <Text style={styles.controlButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.primaryButton]}
                onPress={isActive ? pauseResume : startTimer}
              >
                <Text style={[styles.controlButtonText, styles.primaryButtonText]}>
                  {isActive ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controlButtons}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={reset}
              >
                <Text style={styles.controlButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.primaryButton]}
                onPress={pauseResume}
              >
                <Text style={[styles.controlButtonText, styles.primaryButtonText]}>
                  {isActive ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    color: '#1E90FF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
  modeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#1E90FF',
  },
  modeButtonText: {
    color: '#999999',
    fontSize: 16,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerSetup: {
    alignItems: 'center',
  },
  timerSetupLabel: {
    color: '#999999',
    fontSize: 18,
    marginBottom: 40,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  timeAdjustButton: {
    backgroundColor: '#333333',
    width: 60,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timeAdjustText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  timeInputValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '300',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  timeInputLabel: {
    color: '#999999',
    fontSize: 14,
  },
  timeSeparator: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 10,
  },
  timeDisplay: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '300',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  timeDisplayComplete: {
    color: '#10B981',
  },
  controls: {
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});