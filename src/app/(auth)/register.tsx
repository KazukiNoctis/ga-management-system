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
      className="flex-1 bg-gray-900"
    >
      <ScrollView contentContainerClassName="flex-grow px-6 py-12 justify-center">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
          <Text className="text-gray-400 text-base">Join the GA Management system</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-gray-300 font-medium mb-2 ml-1">Full Name</Text>
            <TextInput
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700 focus:border-indigo-500"
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-300 font-medium mb-2 ml-1">Email</Text>
            <TextInput
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700 focus:border-indigo-500"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-300 font-medium mb-2 ml-1">Password</Text>
            <TextInput
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700 focus:border-indigo-500"
              placeholder="Create a password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View className="mt-4">
            <Text className="text-gray-300 font-medium mb-2 ml-1">Select Branch</Text>
            {fetchingBranches ? (
              <ActivityIndicator size="small" color="#4F46E5" className="py-4" />
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {branches.map((branch) => (
                  <Pressable
                    key={branch.id}
                    onPress={() => setSelectedBranch(branch.id)}
                    className={`px-4 py-3 rounded-lg border ${
                      selectedBranch === branch.id 
                        ? 'bg-indigo-600/20 border-indigo-500' 
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  >
                    <Text className={`${
                      selectedBranch === branch.id ? 'text-indigo-400 font-semibold' : 'text-gray-300'
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
          className={`w-full bg-indigo-600 rounded-xl py-4 items-center mt-4 ${loading ? 'opacity-70' : 'opacity-100'}`}
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
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-indigo-400 font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
