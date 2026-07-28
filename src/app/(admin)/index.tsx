import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    branches: 0,
    staff: 0,
    expenses: 0,
    checkingForms: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      if (!profile?.branch_id) return;
      
      try {
        setLoading(true);
        // Total Branches
        const { count: branchesCount } = await supabase
          .from('branches')
          .select('*', { count: 'exact', head: true });
          
        // Total Staff in branch
        const { count: staffCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('branch_id', profile.branch_id);
          
        // Total Expenses in branch
        const { count: expensesCount } = await supabase
          .from('expenses')
          .select('*', { count: 'exact', head: true })
          .eq('branch_id', profile.branch_id);
          
        // Total Checking Forms in branch
        const { count: formsCount } = await supabase
          .from('checking_forms')
          .select('*', { count: 'exact', head: true })
          .eq('branch_id', profile.branch_id);
          
        setStats({
          branches: branchesCount || 0,
          staff: staffCount || 0,
          expenses: expensesCount || 0,
          checkingForms: formsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <ScrollView className="flex-1 bg-gray-950 p-4">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-bold">Welcome, {profile?.full_name}</Text>
          <View className="bg-purple-600 self-start px-2 py-1 rounded mt-1">
            <Text className="text-white text-xs font-bold uppercase">Admin</Text>
          </View>
        </View>
        <Pressable 
          onPress={handleSignOut}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Sign Out</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" />
      ) : (
        <View className="flex-row flex-wrap justify-between">
          <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 w-[48%] mb-4">
            <Text className="text-gray-400 text-sm mb-1">Total Branches</Text>
            <Text className="text-white text-3xl font-bold">{stats.branches}</Text>
          </View>
          
          <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 w-[48%] mb-4">
            <Text className="text-gray-400 text-sm mb-1">Branch Staff</Text>
            <Text className="text-white text-3xl font-bold">{stats.staff}</Text>
          </View>
          
          <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 w-[48%] mb-4">
            <Text className="text-gray-400 text-sm mb-1">Branch Expenses</Text>
            <Text className="text-white text-3xl font-bold">{stats.expenses}</Text>
          </View>
          
          <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 w-[48%] mb-4">
            <Text className="text-gray-400 text-sm mb-1">Checking Forms</Text>
            <Text className="text-white text-3xl font-bold">{stats.checkingForms}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
