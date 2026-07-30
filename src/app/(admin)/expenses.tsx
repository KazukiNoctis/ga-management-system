import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Expense } from '@/types';

type ExpenseWithProfile = Expense & { profiles: { full_name: string } | null };

export default function ExpensesScreen() {
  const { profile } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchExpenses = async () => {
    if (!profile?.branch_id) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, profiles(full_name)')
        .eq('branch_id', profile.branch_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setExpenses(data as any);
        const total = data.reduce((sum, exp) => sum + Number(exp.amount), 0);
        setTotalAmount(total);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [profile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderItem = ({ item }: { item: ExpenseWithProfile }) => (
    <View className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-on-surface text-lg font-bold flex-1">{item.title}</Text>
        <Text className="text-error font-bold ml-2">{formatIDR(item.amount)}</Text>
      </View>
      <Text className="text-on-surface-variant mb-2">{item.description}</Text>
      <View className="flex-row justify-between items-center mt-2 border-t border-outline-variant pt-2">
        <Text className="text-on-surface-variant text-sm">👤 {item.profiles?.full_name || 'Unknown'}</Text>
        <Text className="text-outline text-xs">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <View className="bg-primary-container p-4 rounded-xl border border-primary-container mb-4 items-center">
        <Text className="text-on-primary-container text-sm mb-1">Total Branch Expenses</Text>
        <Text className="text-on-primary text-3xl font-bold">{formatIDR(totalAmount)}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" className="mt-10" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />
          }
          ListEmptyComponent={
            <Text className="text-outline text-center mt-10">No expenses found</Text>
          }
        />
      )}
    </View>
  );
}
