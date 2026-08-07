import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { Profile } from '@/types';
import { useRouter } from 'expo-router';

export default function MemberManagement() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  const staffCount = members.filter(m => m.role === 'staff').length;
  const adminCount = members.filter(m => m.role === 'admin').length;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1440px] mx-auto w-full p-8">
        
        {/* Page Header */}
        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-[32px] leading-[40px] font-bold text-primary tracking-tight">Member Management</Text>
            <Text className="text-[16px] text-secondary mt-1">Oversee and manage internal administrative access and roles.</Text>
          </View>
          <Pressable className="bg-primary-container px-6 py-3 rounded-lg flex-row items-center gap-2 hover:bg-primary shadow-sm">
            <MaterialIcons name="person-add" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-[14px]">Add New Member</Text>
          </Pressable>
        </View>

        {/* Dashboard Quick Metrics */}
        <View className="flex-row flex-wrap gap-6 mb-8">
          <View className="flex-1 min-w-[200px] bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-primary/10 rounded-lg">
                <MaterialIcons name="group" size={24} color="#00236f" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-[12px] font-bold text-[#10B981]">+4.2% </Text>
                <MaterialIcons name="trending-up" size={14} color="#10B981" />
              </View>
            </View>
            <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-1">Total Members</Text>
            <Text className="text-[24px] font-black text-on-surface">{members.length}</Text>
          </View>

          <View className="flex-1 min-w-[200px] bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-[#004a31]/20 rounded-lg">
                <MaterialIcons name="verified-user" size={24} color="#00311f" />
              </View>
            </View>
            <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-1">Staff</Text>
            <Text className="text-[24px] font-black text-on-surface">{staffCount}</Text>
          </View>

          <View className="flex-1 min-w-[200px] bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-[#d0e1fb]/30 rounded-lg">
                <MaterialIcons name="admin-panel-settings" size={24} color="#505f76" />
              </View>
            </View>
            <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-1">Admins</Text>
            <Text className="text-[24px] font-black text-on-surface">{adminCount}</Text>
          </View>
        </View>

        {/* Filters and Actions */}
        <View className="bg-surface-container-lowest border border-outline-variant rounded-t-xl p-4 flex-row justify-between items-center z-10">
          <View className="flex-row items-center gap-2">
            <Pressable className="px-4 py-2 bg-surface-container-low rounded-lg flex-row items-center gap-2 hover:bg-surface-container-high">
              <MaterialIcons name="filter-list" size={18} color="#191c1e" />
              <Text className="font-bold text-[12px] text-on-surface tracking-wider">Filter</Text>
            </Pressable>
            <Pressable className="px-4 py-2 bg-surface-container-low rounded-lg flex-row items-center gap-2 hover:bg-surface-container-high">
              <MaterialIcons name="download" size={18} color="#191c1e" />
              <Text className="font-bold text-[12px] text-on-surface tracking-wider">Export</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-[12px] text-secondary">Showing {members.length} members</Text>
          </View>
        </View>

        {/* Main Data Table */}
        <View className="bg-surface-container-lowest border border-t-0 border-outline-variant rounded-b-xl overflow-hidden shadow-sm">
          
          {/* Table Header */}
          <View className="flex-row bg-surface-container-low border-b border-outline-variant py-4 px-6">
            <View className="flex-[2] flex-row items-center gap-2">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-wider">Member Name</Text>
              <MaterialIcons name="arrow-downward" size={14} color="#505f76" />
            </View>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider px-2">Role</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider text-right">Actions</Text>
          </View>

          {/* Table Rows */}
          {members.length === 0 ? (
            <View className="py-8 items-center justify-center">
              <Text className="text-secondary text-[14px]">No members found</Text>
            </View>
          ) : (
            members.map((member, index) => (
              <View 
                key={member.id} 
                className={`flex-row items-center py-4 px-6 hover:bg-surface-container-low ${
                  index !== members.length - 1 ? 'border-b border-outline-variant' : ''
                }`}
              >
                <View className="flex-[2] flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-primary font-bold">
                      {member.full_name ? member.full_name.substring(0, 2).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-[14px] font-bold text-on-surface">{member.full_name || 'Unknown'}</Text>
                    <Text className="text-[12px] text-secondary">ID: {member.id.substring(0, 8)}...</Text>
                  </View>
                </View>
                
                <View className="flex-[1] px-2 justify-center">
                  <View className={`self-start px-3 py-1 rounded-full border ${
                    member.role === 'admin' 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-[#10B981]/10 border-[#10B981]/20'
                  }`}>
                    <Text className={`text-[12px] font-bold ${
                      member.role === 'admin' ? 'text-primary' : 'text-[#059669]'
                    }`}>
                      {member.role.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-[1] flex-row items-center justify-end gap-2">
                  <Pressable 
                    className="p-2 rounded-lg hover:bg-primary/10"
                    onPress={() => router.push(`/(admin)/member/${member.id}` as any)}
                  >
                    <MaterialIcons name="edit" size={20} color="#00236f" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Security Card */}
        <View className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6 flex-row gap-4 items-start mb-8">
          <View className="p-3 bg-primary rounded-lg shadow-lg">
            <MaterialIcons name="security" size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold text-primary mb-2">Role-Based Access Control</Text>
            <Text className="text-[14px] text-on-secondary-container leading-6">
              Administrators can define granular permissions for each role. Ensure that every member is assigned to the correct functional department to maintain data integrity and security protocols.
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
