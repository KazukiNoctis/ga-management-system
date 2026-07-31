import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Profile, Branch } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

type ProfileWithBranch = Profile & { branches?: { name: string } | null };

export default function MembersScreen() {
  const [members, setMembers] = useState<ProfileWithBranch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBranchId, setEditBranchId] = useState<string>('');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch branches for edit dropdown
      const { data: bData } = await supabase.from('branches').select('*');
      if (bData) setBranches(bData as Branch[]);
      
      // Fetch members
      const { data, error } = await supabase
        .from('profiles')
        .select('*, branches(name)')
        .eq('role', 'staff')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setMembers(data as any);
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

  const startEdit = (member: ProfileWithBranch) => {
    setEditingId(member.id);
    setEditName(member.full_name);
    setEditBranchId(member.branch_id || '');
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
          branch_id: editBranchId || null
        })
        .eq('id', editingId);
        
      if (error) throw error;
      setEditingId(null);
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const renderItem = ({ item }: { item: ProfileWithBranch }) => {
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
          <Text className="text-xs text-on-surface-variant mb-1">Select Branch:</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            <Pressable
              onPress={() => setEditBranchId('')}
              className={`px-3 py-1.5 rounded-full border ${
                !editBranchId ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant'
              }`}
            >
              <Text className={`text-xs ${!editBranchId ? 'text-on-primary font-bold' : 'text-on-surface'}`}>None</Text>
            </Pressable>
            {branches.map(b => (
              <Pressable
                key={b.id}
                onPress={() => setEditBranchId(b.id)}
                className={`px-3 py-1.5 rounded-full border ${
                  editBranchId === b.id ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant'
                }`}
              >
                <Text className={`text-xs ${editBranchId === b.id ? 'text-on-primary font-bold' : 'text-on-surface'}`}>{b.name}</Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row gap-2 justify-end">
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
            <Text className="text-on-surface-variant mt-1">
              🏢 {item.branches?.name || 'No Branch Assigned'}
            </Text>
            <Text className="text-outline text-xs mt-2">
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
