import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
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
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center p-4 md:p-8">
        <View className="w-full max-w-[440px] mx-auto flex-col gap-6">
          
          {/* Header Section */}
          <View className="items-center gap-2 mb-2">
            <View className="h-12 w-12 bg-primary-container rounded-lg items-center justify-center mb-2">
              <MaterialIcons name="business" size={28} color="#90a8ff" />
            </View>
            <Text className="text-[32px] leading-[40px] font-bold text-primary tracking-tight">GA Manager</Text>
            <Text className="text-base text-on-surface-variant">Sign in to your account</Text>
          </View>

          {/* Login Card */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <View className="flex-col gap-6">
              
              {/* Email Field */}
              <View className="flex-col gap-1">
                <Text className="text-xs font-bold text-on-surface mb-1">Email Address</Text>
                <View className="relative justify-center">
                  <View className="absolute left-3 z-10">
                    <MaterialIcons name="mail" size={20} color="#757682" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-3 py-3 rounded-md bg-surface-container-lowest text-on-surface text-sm border ${isFocusedEmail ? 'border-primary' : 'border-outline-variant'}`}
                    placeholder="name@company.com"
                    placeholderTextColor="#757682"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setIsFocusedEmail(true)}
                    onBlur={() => setIsFocusedEmail(false)}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View className="flex-col gap-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-bold text-on-surface">Password</Text>
                  <Text className="text-xs font-semibold text-primary">Forgot Password?</Text>
                </View>
                <View className="relative justify-center">
                  <View className="absolute left-3 z-10">
                    <MaterialIcons name="lock" size={20} color="#757682" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-3 py-3 rounded-md bg-surface-container-lowest text-on-surface text-sm border ${isFocusedPassword ? 'border-primary' : 'border-outline-variant'}`}
                    placeholder="••••••••"
                    placeholderTextColor="#757682"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onFocus={() => setIsFocusedPassword(true)}
                    onBlur={() => setIsFocusedPassword(false)}
                  />
                </View>
              </View>

              {/* Primary Action */}
              <Pressable
                className={`w-full mt-2 bg-primary-container rounded-lg py-3 flex-row items-center justify-center gap-2 ${loading ? 'opacity-70' : 'opacity-100 active:opacity-90'}`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#90a8ff" />
                ) : (
                  <>
                    <Text className="text-on-primary-container font-semibold text-sm">Login</Text>
                    <MaterialIcons name="login" size={18} color="#90a8ff" />
                  </>
                )}
              </Pressable>
            </View>
          </View>

          {/* Secondary Action */}
          <View className="items-center mt-2 pb-8">
            <View className="flex-row items-center">
              <Text className="text-sm text-on-surface-variant">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold text-primary">Register as new GA member</Text>
                </Pressable>
              </Link>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
