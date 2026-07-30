import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background justify-center px-6"
    >
      <View className="mb-10 mt-12 items-center">
        <Text className="text-4xl font-bold text-primary mb-2">GA Management 🏢</Text>
        <Text className="text-on-surface-variant text-base">Sign in to your account to continue</Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-on-surface font-semibold mb-2 ml-1">Email</Text>
          <TextInput
            className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-4 py-4 border border-outline-variant focus:border-primary-container"
            placeholder="Enter your email"
            placeholderTextColor="#757682"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mt-4">
          <Text className="text-on-surface font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-4 py-4 border border-outline-variant focus:border-primary-container"
            placeholder="Enter your password"
            placeholderTextColor="#757682"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <Pressable
        className={`w-full bg-primary-container rounded-lg py-4 items-center mt-2 ${loading ? 'opacity-70' : 'opacity-100'}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-lg">Sign In</Text>
        )}
      </Pressable>

      <View className="flex-row justify-center mt-8">
        <Text className="text-on-surface-variant">Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text className="text-primary font-semibold">Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
