import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

type Branch = {
  id: string;
  name: string;
};

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      
      Alert.alert('Success', 'Account created successfully', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
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
        <View className="w-full max-w-[480px] mx-auto">
          
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-sm">
            
            {/* Header Section */}
            <View className="items-center mb-6">
              <View className="w-12 h-12 bg-surface-container-low rounded-lg items-center justify-center mb-4 border border-outline-variant">
                <MaterialIcons name="business" size={28} color="#00236f" />
              </View>
              <Text className="text-[32px] leading-[40px] font-bold text-on-surface mb-2 tracking-tight">Join GA Team</Text>
              <Text className="text-sm text-on-surface-variant text-center">Create your account to manage facilities, assets, and procurement.</Text>
            </View>

            <View className="flex-col gap-4">
              
              {/* Full Name Field */}
              <View className="flex-col gap-1">
                <Text className="text-xs font-semibold text-on-surface mb-1">Full Name</Text>
                <View className="relative justify-center">
                  <View className="absolute left-3 z-10">
                    <MaterialIcons name="person" size={20} color="#757682" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-3 py-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border ${isFocusedName ? 'border-primary' : 'border-outline-variant'}`}
                    placeholder="e.g. Jane Doe"
                    placeholderTextColor="#757682"
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setIsFocusedName(true)}
                    onBlur={() => setIsFocusedName(false)}
                  />
                </View>
              </View>

              {/* Company Email Field */}
              <View className="flex-col gap-1">
                <Text className="text-xs font-semibold text-on-surface mb-1">Company Email</Text>
                <View className="relative justify-center">
                  <View className="absolute left-3 z-10">
                    <MaterialIcons name="mail" size={20} color="#757682" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-3 py-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border ${isFocusedEmail ? 'border-primary' : 'border-outline-variant'}`}
                    placeholder="jane.doe@company.com"
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
                <Text className="text-xs font-semibold text-on-surface mb-1">Password</Text>
                <View className="relative justify-center">
                  <View className="absolute left-3 z-10">
                    <MaterialIcons name="lock" size={20} color="#757682" />
                  </View>
                  <TextInput
                    className={`w-full pl-10 pr-10 py-3 rounded-lg bg-surface-container-lowest text-on-surface text-sm border ${isFocusedPassword ? 'border-primary' : 'border-outline-variant'}`}
                    placeholder="••••••••"
                    placeholderTextColor="#757682"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsFocusedPassword(true)}
                    onBlur={() => setIsFocusedPassword(false)}
                  />
                  <Pressable 
                    className="absolute right-3 z-10"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#757682" />
                  </Pressable>
                </View>
                <Text className="text-[12px] text-on-surface-variant mt-1">Must be at least 8 characters.</Text>
              </View>
              
              {/* Primary Action */}
              <View className="pt-4">
                <Pressable
                  className={`w-full bg-primary rounded-lg py-3 flex-row items-center justify-center gap-2 ${loading ? 'opacity-70' : 'opacity-100 active:opacity-90'}`}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text className="text-white font-semibold text-sm">Register</Text>
                      <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                    </>
                  )}
                </Pressable>
              </View>
              
              {/* Secondary Action */}
              <View className="mt-4 items-center">
                <View className="flex-row items-center">
                  <Text className="text-sm text-on-surface-variant">Already have an account? </Text>
                  <Link href="/(auth)/login" asChild>
                    <Pressable>
                      <Text className="text-sm font-semibold text-primary underline">Login</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>

            </View>
          </View>

          {/* Footer Info */}
          <View className="items-center mt-6 pb-8">
            <Text className="text-xs text-outline text-center">
              By registering, you agree to the <Text className="underline">Terms of Service</Text> and <Text className="underline">Privacy Policy</Text>.
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
