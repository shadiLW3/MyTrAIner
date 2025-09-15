import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface TimeInputProps {
  value: number; // total seconds
  onChange: (seconds: number) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (text: string) => {
    const mins = parseInt(text) || 0;
    onChange(mins * 60 + seconds);
  };

  const handleSecondsChange = (text: string) => {
    const secs = parseInt(text) || 0;
    if (secs < 60) {
      onChange(minutes * 60 + secs);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={minutes > 0 ? minutes.toString() : ''}
        onChangeText={handleMinutesChange}
        keyboardType="numeric"
        placeholder="0"
        maxLength={2}
      />
      <Text style={styles.separator}>:</Text>
      <TextInput
        style={styles.input}
        value={seconds > 0 ? seconds.toString().padStart(2, '0') : ''}
        onChangeText={handleSecondsChange}
        keyboardType="numeric"
        placeholder="00"
        maxLength={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 35,
    height: 36,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: '#FFF',
  },
  separator: {
    marginHorizontal: 4,
    fontSize: 16,
    fontWeight: '600',
  },
});