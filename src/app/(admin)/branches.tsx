import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types';

export default function BranchesScreen() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setBranches(data as Branch[]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert('Validation', 'Name and location are required');
      return;
    }
    
    try {
      setAdding(true);
      const { error } = await supabase
        .from('branches')
        .insert({ name, location });
        
      if (error) throw error;
      
      setName('');
      setLocation('');
      fetchBranches();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setAdding(false);
    }
  };

  const renderItem = ({ item }: { item: Branch }) => (
    <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-4">
      <Text className="text-white text-lg font-bold">{item.name}</Text>
      <Text className="text-gray-300 mt-1">📍 {item.location}</Text>
      <Text className="text-gray-500 text-xs mt-2">
        Added: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-950 p-4">
      <View className="bg-gray-900 p-4 rounded-2xl border border-gray-700 mb-6">
        <Text className="text-white text-lg font-bold mb-3">Add New Branch</Text>
        <TextInput
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-3"
          placeholder="Branch Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-3"
          placeholder="Location"
          placeholderTextColor="#6b7280"
          value={location}
          onChangeText={setLocation}
        />
        <Pressable 
          className="bg-blue-600 p-3 rounded-lg items-center"
          onPress={handleAddBranch}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">Add Branch</Text>
          )}
        </Pressable>
      </View>

      <Text className="text-white text-xl font-bold mb-4">Branch List</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <FlatList
          data={branches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-4">No branches found</Text>
          }
        />
      )}
    </View>
  );
}
