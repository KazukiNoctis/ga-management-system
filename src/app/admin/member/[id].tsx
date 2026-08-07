import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditMember() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'staff' | 'admin'>('staff');
  const [branchId, setBranchId] = useState('');

  useEffect(() => {
    if (id) {
      fetchMember(id as string);
    }
  }, [id]);

  const fetchMember = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFullName(data.full_name || '');
      setRole(data.role || 'staff');
      setBranchId(data.branch_id || '');
    } catch (error) {
      console.error('Error fetching member:', error);
      Alert.alert('Error', 'Could not load member details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role,
          branch_id: branchId || null
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      alert('Changes Saved Successfully');
      router.back();
    } catch (error) {
      console.error('Error updating member:', error);
      Alert.alert('Error', 'Could not update member details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1200px] mx-auto w-full p-8 lg:p-12">
        
        {/* Breadcrumbs */}
        <View className="flex-row items-center gap-2 mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-[12px] font-bold text-secondary hover:text-primary transition-colors">Member Management</Text>
          </Pressable>
          <MaterialIcons name="chevron-right" size={16} color="#505f76" />
          <Text className="text-[12px] font-bold text-primary">Edit Member</Text>
        </View>

        <View className="flex-col lg:flex-row gap-8 items-start">
          
          {/* Profile Picture Section (Bento Box Style) */}
          <View className="w-full lg:w-1/3 flex-col gap-6">
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 items-center text-center shadow-sm hover:shadow-md transition-shadow">
              
              <View className="relative mb-6">
                <View className="w-40 h-40 rounded-full bg-primary-container items-center justify-center border-4 border-surface-container-highest shadow-md overflow-hidden">
                   <Text className="text-[48px] font-bold text-primary">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
                   </Text>
                </View>
                <Pressable className="absolute bottom-2 right-2 bg-primary w-10 h-10 rounded-full items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <MaterialIcons name="photo-camera" size={20} color="#ffffff" />
                </Pressable>
              </View>

              <Text className="text-[20px] font-bold text-on-surface mb-1">{fullName || 'Unknown Member'}</Text>
              <Text className="text-[14px] text-secondary mb-6">{role.toUpperCase()} • ID: {profile.id.substring(0,6)}</Text>
              
              <Pressable className="w-full py-3 rounded-lg border border-primary items-center justify-center hover:bg-primary/5 active:bg-primary/10 transition-colors">
                <Text className="text-primary font-bold text-[14px]">Change Photo</Text>
              </Pressable>
            </View>

            {/* Member Stats */}
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-4">Member Activity</Text>
              <View className="gap-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] text-secondary">Joined Date</Text>
                  <Text className="text-[12px] font-bold text-on-surface">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] text-secondary">Permissions</Text>
                  <Text className="text-[12px] font-bold text-primary">
                    {role === 'admin' ? 'Global Administrator' : 'Standard User'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View className="w-full lg:flex-1">
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              <View className="p-8 border-b border-outline-variant bg-surface-container-low">
                <Text className="text-[24px] font-bold text-primary">Edit Member Details</Text>
                <Text className="text-[14px] text-secondary mt-1">Update personal information and organizational role.</Text>
              </View>

              <View className="p-8 gap-8">
                
                <View className="flex-row flex-wrap gap-6">
                  {/* Full Name */}
                  <View className="flex-1 min-w-[250px] gap-2">
                    <Text className="text-[12px] font-bold text-secondary">Full Name</Text>
                    <TextInput
                      className="w-full p-3 rounded-lg border border-outline-variant text-[14px] text-on-surface focus:border-primary focus:bg-primary/5"
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter full name"
                    />
                  </View>

                  {/* Branch ID */}
                  <View className="flex-1 min-w-[250px] gap-2">
                    <Text className="text-[12px] font-bold text-secondary">Branch ID</Text>
                    <TextInput
                      className="w-full p-3 rounded-lg border border-outline-variant text-[14px] text-on-surface focus:border-primary focus:bg-primary/5"
                      value={branchId}
                      onChangeText={setBranchId}
                      placeholder="e.g. BR-01"
                    />
                  </View>
                </View>

                {/* Role Dropdown Alternative (Buttons) */}
                <View className="gap-2 pt-2">
                  <Text className="text-[12px] font-bold text-secondary">Role</Text>
                  <View className="flex-row gap-4 mt-1">
                    <Pressable 
                      onPress={() => setRole('staff')}
                      className={`px-6 py-3 border rounded-lg flex-1 items-center justify-center ${
                        role === 'staff' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-lowest'
                      }`}
                    >
                      <Text className={`font-bold text-[14px] ${role === 'staff' ? 'text-primary' : 'text-on-surface'}`}>Staff</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => setRole('admin')}
                      className={`px-6 py-3 border rounded-lg flex-1 items-center justify-center ${
                        role === 'admin' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-lowest'
                      }`}
                    >
                      <Text className={`font-bold text-[14px] ${role === 'admin' ? 'text-primary' : 'text-on-surface'}`}>Admin</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Notification Preferences / Security */}
                <View className="pt-4 mt-2">
                  <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-4">System Access</Text>
                  <View className="flex-row items-center justify-between p-4 bg-background rounded-lg border border-outline-variant">
                    <View className="flex-row gap-3 items-center">
                      <View className="p-2 bg-secondary-container rounded-lg">
                        <MaterialIcons name="security" size={20} color="#00236f" />
                      </View>
                      <View>
                        <Text className="text-[14px] font-bold text-on-surface">Account Status</Text>
                        <Text className="text-[12px] text-secondary">Active and in good standing</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Form Actions */}
                <View className="pt-8 flex-row items-center justify-end gap-4 border-t border-outline-variant mt-4">
                  <Pressable 
                    onPress={() => router.back()}
                    className="px-8 py-3 rounded-lg hover:bg-surface-container-high"
                  >
                    <Text className="text-[14px] font-bold text-secondary">Cancel</Text>
                  </Pressable>
                  <Pressable 
                    onPress={handleSave}
                    disabled={saving}
                    className="px-10 py-3 rounded-lg bg-primary items-center justify-center hover:bg-primary-container shadow-md"
                  >
                    {saving ? (
                       <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                       <Text className="text-[14px] font-bold text-on-primary">Save Changes</Text>
                    )}
                  </Pressable>
                </View>

              </View>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
