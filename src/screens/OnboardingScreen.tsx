import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  const [goals, setGoals] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>What are your fitness goals?</Text>
        <Text style={styles.subtitle}>Tell me about your experience, goals, and what you want to achieve</Text>
        <TextInput
          style={styles.input}
          placeholder="I want to build muscle and improve my 5k time. I've been training for 2 years..."
          placeholderTextColor="#888"
          value={goals}
          onChangeText={setGoals}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    padding: 16,
    borderRadius: 12,
    height: 150,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#1E40AF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});