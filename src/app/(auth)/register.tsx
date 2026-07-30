import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

type Branch = {
  id: string;
  name: string;
};

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingBranches, setFetchingBranches] = useState(true);
  const { signUp } = useAuth();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase.from('branches').select('id, name');
      if (error) throw error;
      if (data) setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setFetchingBranches(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !selectedBranch) {
      Alert.alert('Error', 'Please fill in all fields and select a branch');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName, selectedBranch);
      
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
      <ScrollView contentContainerClassName="flex-grow px-6 py-12 justify-center">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
          <Text className="text-on-surface-variant text-base">Join the GA Management system</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-on-surface font-semibold mb-2 ml-1">Full Name</Text>
            <TextInput
              className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-4 py-4 border border-outline-variant focus:border-primary-container"
              placeholder="Enter your full name"
              placeholderTextColor="#757682"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mt-4">
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
              placeholder="Create a password"
              placeholderTextColor="#757682"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View className="mt-4">
            <Text className="text-on-surface font-semibold mb-2 ml-1">Select Branch</Text>
            {fetchingBranches ? (
              <ActivityIndicator size="small" color="#1e3a8a" className="py-4" />
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {branches.map((branch) => (
                  <Pressable
                    key={branch.id}
                    onPress={() => setSelectedBranch(branch.id)}
                    className={`px-4 py-3 rounded-lg border ${
                      selectedBranch === branch.id 
                        ? 'bg-primary-container/10 border-primary-container' 
                        : 'bg-surface-container-lowest border-outline-variant'
                    }`}
                  >
                    <Text className={`${
                      selectedBranch === branch.id ? 'text-primary font-semibold' : 'text-on-surface'
                    }`}>
                      {branch.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <Pressable
          className={`w-full bg-primary-container rounded-lg py-4 items-center mt-4 ${loading ? 'opacity-70' : 'opacity-100'}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Account</Text>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-8 pb-8">
          <Text className="text-on-surface-variant">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-primary font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
