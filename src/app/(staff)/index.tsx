import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { CheckingForm } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StaffHome() {
  const { session, profile, signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    checkingCount: 0,
    expensesCount: 0,
    expensesTotal: 0,
  });
  const [recentForms, setRecentForms] = useState<CheckingForm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Fetch checking forms count
      const { count: checkingCount } = await supabase
        .from('checking_forms')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // Fetch expenses stats
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', session.user.id);

      const expensesTotal = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // Fetch recent forms
      const { data: recent } = await supabase
        .from('checking_forms')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        checkingCount: checkingCount || 0,
        expensesCount: expenses?.length || 0,
        expensesTotal,
      });
      setRecentForms(recent || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session?.user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

      <ScrollView 
        contentContainerClassName="p-4 md:p-8 max-w-[1440px] mx-auto w-full flex-col gap-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00236f" />}
      >
        
        {/* Greeting Section */}
        <View className="flex-col gap-1 pt-2">
          <Text className="text-[32px] leading-[40px] font-bold text-on-surface tracking-tight">Good Day, {profile?.full_name?.split(' ')[0] || 'Staff'}.</Text>
          <Text className="text-base text-on-surface-variant">Here is your general affairs overview for today.</Text>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#00236f" />
          </View>
        ) : (
          <>
            {/* Quick Stats Bento */}
            <View className="flex-row flex-wrap gap-4">
              {/* Stat 1: Checkings */}
              <View className="flex-1 min-w-[45%] bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-secondary-container/30 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="assignment" size={24} color="#505f76" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.checkingCount}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Checkings</Text>
                </View>
              </View>

              {/* Stat 2: Expenses Count */}
              <View className="flex-1 min-w-[45%] bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-error-container/30 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="receipt-long" size={24} color="#ba1a1a" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{stats.expensesCount}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Expense Reports</Text>
                </View>
              </View>

              {/* Stat 3: Total Expenses Volume */}
              <View className="w-full bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden relative">
                <View className="absolute -right-4 -top-4 w-20 h-20 bg-primary-container/20 rounded-full" />
                <View className="flex-col gap-2 relative z-10">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="payments" size={24} color="#00236f" />
                  </View>
                  <Text className="text-[32px] leading-[40px] font-bold text-on-surface mt-2">{formatIDR(stats.expensesTotal)}</Text>
                  <Text className="text-xs font-medium text-on-surface-variant">Total Expense Volume</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="flex-col gap-4 mt-2">
              <Text className="text-xl font-semibold text-on-surface">Quick Actions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-2">
                
                <Pressable 
                  onPress={() => router.push('/(staff)/checking-form')}
                  className="w-40 h-32 bg-primary-container rounded-xl p-4 flex-col justify-between shadow-sm active:scale-95 transition-transform"
                >
                  <MaterialIcons name="add-task" size={32} color="#00164e" />
                  <Text className="text-sm font-semibold text-on-primary-container leading-tight">New Checking{'\n'}Form</Text>
                </Pressable>

                <Pressable 
                  onPress={() => router.push('/(staff)/add-expense')}
                  className="w-40 h-32 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex-col justify-between shadow-sm active:scale-95 transition-transform"
                >
                  <MaterialIcons name="post-add" size={32} color="#00236f" />
                  <Text className="text-sm font-semibold text-on-surface leading-tight">Submit{'\n'}Expense</Text>
                </Pressable>

              </ScrollView>
            </View>

            {/* Recent Activity */}
            <View className="flex-col gap-4 mt-2 mb-8">
              <Text className="text-xl font-semibold text-on-surface">Recent Checkings</Text>
              <View className="flex-col gap-3">
                {recentForms.length > 0 ? (
                  recentForms.map((form) => (
                    <Pressable 
                      key={form.id} 
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex-row gap-4 items-center shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                        <MaterialIcons name="fact-check" size={20} color="#0b1c30" />
                      </View>
                      <View className="flex-1 flex-col gap-1">
                        <View className="flex-row justify-between items-start">
                          <Text className="text-sm font-semibold text-on-surface leading-tight" numberOfLines={1}>{form.title}</Text>
                          <Text className="text-xs text-on-surface-variant">{new Date(form.created_at).toLocaleDateString()}</Text>
                        </View>
                        <View className="mt-1 flex-row">
                          <View className="bg-surface-container px-2 py-0.5 rounded-md flex-row items-center gap-1">
                            <View className="w-2 h-2 rounded-full bg-primary" />
                            <Text className="text-[10px] font-semibold text-on-surface-variant uppercase">Logged</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View className="py-6 items-center justify-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
                    <Text className="text-outline italic">No recent activity found.</Text>
                  </View>
                )}
              </View>
            </View>

          </>
        )}
      </ScrollView>
    </View>
  );
}
