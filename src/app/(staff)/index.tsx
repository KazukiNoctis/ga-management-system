import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { CheckingForm } from '@/types';

export default function StaffHome() {
  const { session, profile } = useAuth();
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
    >
      <View className="p-4">
        {/* Welcome Header */}
        <View className="mb-6">
          <Text className="text-on-surface-variant text-lg">Welcome back,</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-on-surface text-2xl font-bold mr-3">{profile?.full_name}</Text>
            <View className="bg-secondary-container px-2 py-1 rounded border border-outline-variant">
              <Text className="text-on-secondary-container text-xs font-medium uppercase tracking-wider">{profile?.role}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-surface-container-lowest rounded-xl p-4 mr-2 border border-outline-variant shadow-sm">
            <Text className="text-on-surface-variant text-sm mb-1">Checkings</Text>
            <Text className="text-on-surface text-2xl font-bold">{stats.checkingCount}</Text>
          </View>
          <View className="flex-1 bg-surface-container-lowest rounded-xl p-4 ml-2 border border-outline-variant shadow-sm">
            <Text className="text-on-surface-variant text-sm mb-1">Expenses</Text>
            <Text className="text-on-surface text-2xl font-bold">{stats.expensesCount}</Text>
          </View>
        </View>

        {/* Total Expense */}
        <View className="bg-primary-container rounded-2xl p-5 mb-8 border border-primary-container">
          <Text className="text-on-primary-container text-sm mb-1">Total Expense Volume</Text>
          <Text className="text-on-primary text-3xl font-bold">{formatIDR(stats.expensesTotal)}</Text>
        </View>

        {/* Recent Activity */}
        <View>
          <Text className="text-on-surface text-lg font-semibold mb-4">Recent Checkings</Text>
          {recentForms.length > 0 ? (
            recentForms.map((form) => (
              <View key={form.id} className="bg-surface-container-lowest rounded-xl p-4 mb-3 border border-outline-variant shadow-sm flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-on-surface font-medium text-base mb-1" numberOfLines={1}>{form.title}</Text>
                  <Text className="text-on-surface-variant text-sm">{new Date(form.created_at).toLocaleDateString()}</Text>
                </View>
                <Text className="text-2xl">📋</Text>
              </View>
            ))
          ) : (
            <Text className="text-outline italic text-center py-4">No recent activity found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
