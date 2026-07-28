import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/types';

export default function ExpensesScreen() {
  const { session } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchExpenses = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [session?.user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses().then(() => setRefreshing(false));
  }, [session?.user?.id]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedTotal = expenses
    .filter(e => selectedIds.has(e.id))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const renderItem = ({ item }: { item: Expense }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <Pressable 
        onPress={() => toggleSelection(item.id)}
        className={`bg-gray-900 rounded-xl p-4 mb-3 border ${isSelected ? 'border-blue-500 bg-blue-900/10' : 'border-gray-800'}`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 flex-row items-center">
            <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
              {isSelected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-lg" numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
          <Text className="text-blue-400 font-bold ml-2">{formatIDR(Number(item.amount))}</Text>
        </View>
        <View className="ml-8">
          <Text className="text-gray-400 text-sm mb-1">{new Date(item.created_at).toLocaleString()}</Text>
          {item.description ? (
            <Text className="text-gray-500 text-sm" numberOfLines={2}>{item.description}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-950">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-950">
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No expenses found.</Text>
        }
      />

      {/* Bottom Summary Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 pb-8 flex-row justify-between items-center">
        <Text className="text-gray-300 font-medium">
          Selected: <Text className="text-white font-bold">{selectedIds.size}</Text>
        </Text>
        <View className="items-end">
          <Text className="text-gray-400 text-xs">Subtotal</Text>
          <Text className="text-blue-400 font-bold text-lg">{formatIDR(selectedTotal)}</Text>
        </View>
      </View>
    </View>
  );
}
