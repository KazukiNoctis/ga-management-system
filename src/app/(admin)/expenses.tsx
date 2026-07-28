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
    <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white text-lg font-bold flex-1">{item.title}</Text>
        <Text className="text-red-400 font-bold ml-2">{formatIDR(item.amount)}</Text>
      </View>
      <Text className="text-gray-300 mb-2">{item.description}</Text>
      <View className="flex-row justify-between items-center mt-2 border-t border-gray-700 pt-2">
        <Text className="text-gray-400 text-sm">👤 {item.profiles?.full_name || 'Unknown'}</Text>
        <Text className="text-gray-500 text-xs">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-950 p-4">
      <View className="bg-gray-900 p-4 rounded-2xl border border-gray-700 mb-4 items-center">
        <Text className="text-gray-400 text-sm mb-1">Total Branch Expenses</Text>
        <Text className="text-white text-3xl font-bold text-red-400">{formatIDR(totalAmount)}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
          }
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-10">No expenses found</Text>
          }
        />
      )}
    </View>
  );
}
