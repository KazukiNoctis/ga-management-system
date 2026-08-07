import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExpensesScreen() {
  const { session } = useAuth();
  const router = useRouter();
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
        className={`bg-surface-container-lowest rounded-xl p-4 mb-3 border shadow-sm ${isSelected ? 'border-primary-container bg-primary-container/5' : 'border-outline-variant'}`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 flex-row items-center">
            <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${isSelected ? 'bg-primary-container border-primary-container' : 'border-outline'}`}>
              {isSelected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <View className="flex-1">
              <Text className="text-on-surface font-medium text-lg" numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
          <Text className="text-primary font-bold ml-2">{formatIDR(Number(item.amount))}</Text>
        </View>
        <View className="ml-8">
          <Text className="text-on-surface-variant text-sm mb-1">{new Date(item.created_at).toLocaleString()}</Text>
          {item.description ? (
            <Text className="text-outline text-sm" numberOfLines={2}>{item.description}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />
        }
        ListEmptyComponent={
          <Text className="text-outline text-center mt-10">No expenses found.</Text>
        }
      />

      {/* Bottom Summary Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant shadow-sm p-4 pb-8 flex-row justify-between items-center">
        <Text className="text-on-surface-variant font-medium">
          Selected: <Text className="text-on-surface font-bold">{selectedIds.size}</Text>
        </Text>
        <View className="items-end">
          <Text className="text-on-surface-variant text-xs">Subtotal</Text>
          <Text className="text-primary font-bold text-lg">{formatIDR(selectedTotal)}</Text>
        </View>
      </View>

      {/* FAB — Add Expense */}
      <Pressable
        onPress={() => router.push('/(staff)/add-expense')}
        className="absolute bottom-20 right-5 bg-primary rounded-2xl px-5 py-3.5 flex-row items-center gap-2 shadow-lg active:scale-95"
      >
        <MaterialIcons name="add" size={22} color="#ffffff" />
        <Text className="text-on-primary font-bold text-sm">Add Expense</Text>
      </Pressable>
    </View>
  );
}
