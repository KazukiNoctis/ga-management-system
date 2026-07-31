import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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
    <View className="flex-1 bg-background">
      {/* TopAppBar */}
      <View className="bg-surface flex-row items-center justify-between px-4 h-16 border-b border-outline-variant z-40">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant items-center justify-center overflow-hidden">
            <MaterialIcons name="person" size={20} color="#54647a" />
          </View>
          <Text className="text-xl font-bold tracking-tight text-primary">GA Manager</Text>
        </View>
        <Pressable 
          onPress={handleSignOut}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="logout" size={24} color="#ba1a1a" />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4 md:p-8 max-w-[1440px] mx-auto w-full flex-col gap-6">
        
        {/* Greeting Section */}
        <View className="flex-col gap-1 pt-4">
          <Text className="text-[32px] leading-[40px] font-bold text-on-surface tracking-tight">Good Day, {profile?.full_name?.split(' ')[0] || 'Admin'}.</Text>
          <Text className="text-base text-on-surface-variant">Here is your branch overview for today.</Text>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#00236f" />
          </View>
        ) : (
          <View className="flex-col gap-4">
            
            <View className="flex-row gap-4">
              {/* Total Branches */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-primary-container/20 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="business" size={24} color="#00236f" />
                    <View className="bg-primary-container/10 px-2 py-0.5 rounded-full">
                      <Text className="text-xs font-semibold text-primary">All</Text>
                    </View>
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.branches}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Total Branches</Text>
                </View>
              </View>

              {/* Branch Staff */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-secondary-container/20 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="people" size={24} color="#505f76" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.staff}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Branch Staff</Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-4">
              {/* Branch Expenses */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-error-container/20 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="payments" size={24} color="#ba1a1a" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.expenses}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Expense Reports</Text>
                </View>
              </View>

              {/* Checking Forms */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary-container/10 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="fact-check" size={24} color="#004a31" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.checkingForms}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Checking Forms</Text>
                </View>
              </View>
            </View>

          </View>
        )}
      </ScrollView>
    </View>
  );
}
