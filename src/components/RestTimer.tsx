import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';

interface RestTimerProps {
  visible: boolean;
  duration: number; // in seconds
  onClose: () => void;
  onAdjust: (newDuration: number) => void;
}

export default function RestTimer({ visible, duration, onClose, onAdjust }: RestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration);
      setIsActive(true);
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0 && visible) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            // Timer finished - could add sound/vibration here
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, visible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (adjustment: number) => {
    const newTime = Math.max(0, timeRemaining + adjustment);
    setTimeRemaining(newTime);
    onAdjust(newTime);
  };

  const skip = () => {
    setIsActive(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.content}>
            <View style={styles.timeContainer}>
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustTime(-15)}
              >
                <Text style={styles.adjustButtonText}>-15</Text>
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={[
                  styles.timeText,
                  timeRemaining === 0 && styles.timeTextFinished
                ]}>
                  {formatTime(timeRemaining)}
                </Text>
                {timeRemaining === 0 && (
                  <Text style={styles.finishedText}>Rest Complete!</Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustTime(15)}
              >
                <Text style={styles.adjustButtonText}>+15</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.skipButton} onPress={skip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34, // Safe area for home indicator
  },
  content: {
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adjustButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  timeTextFinished: {
    color: '#10B981',
  },
  finishedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  skipButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});