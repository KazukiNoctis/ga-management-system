import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

export default function MembersScreen() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch members
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setMembers(data as Profile[]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Member', 'Are you sure you want to delete this staff member?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.rpc('delete_user', { target_user_id: id });
            if (error) throw error;
            setMembers(prev => prev.filter(m => m.id !== id));
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const startEdit = (member: Profile) => {
    setEditingId(member.id);
    setEditName(member.full_name);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editName,
        })
        .eq('id', editingId);
        
      if (error) throw error;
      setEditingId(null);
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const renderItem = ({ item }: { item: Profile }) => {
    if (editingId === item.id) {
      return (
        <View className="bg-surface-container-lowest p-4 rounded-xl border border-primary shadow-sm mb-4">
          <Text className="text-on-surface text-sm font-bold mb-2">Edit Member</Text>
          <TextInput
            className="bg-surface-container-lowest text-on-surface p-3 rounded-lg border border-outline-variant mb-3"
            placeholder="Full Name"
            placeholderTextColor="#757682"
            value={editName}
            onChangeText={setEditName}
          />
          <View className="flex-row gap-2 justify-end mt-4">
            <Pressable 
              className="bg-surface-container-high px-4 py-2 rounded-lg"
              onPress={() => setEditingId(null)}
            >
              <Text className="text-on-surface font-semibold">Cancel</Text>
            </Pressable>
            <Pressable 
              className="bg-primary px-4 py-2 rounded-lg"
              onPress={saveEdit}
            >
              <Text className="text-on-primary font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm mb-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-on-surface text-lg font-bold">{item.full_name}</Text>
            <Text className="text-outline text-xs mt-1">
              Joined: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable 
              className="w-10 h-10 bg-secondary-container rounded-full items-center justify-center"
              onPress={() => startEdit(item)}
            >
              <MaterialIcons name="edit" size={20} color="#1d192b" />
            </Pressable>
            <Pressable 
              className="w-10 h-10 bg-error-container rounded-full items-center justify-center"
              onPress={() => handleDelete(item.id)}
            >
              <MaterialIcons name="delete" size={20} color="#410002" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-on-surface text-xl font-bold mb-4">GA Staff Members</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" className="mt-10" />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-outline text-center mt-4">No staff members found</Text>
          }
        />
      )}
    </View>
  );
}
