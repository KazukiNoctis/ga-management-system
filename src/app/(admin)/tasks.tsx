import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckingForm } from '@/types';
import { format } from 'date-fns';

type TaskWithUser = CheckingForm & {
  profiles: { full_name: string } | null;
};

export default function TaskOversight() {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('checking_forms')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data as any || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1440px] mx-auto w-full p-8">
        
        {/* Header & Stats Bento Grid */}
        <View className="flex-col gap-6">
          <View className="flex-col md:flex-row md:items-center justify-between gap-4">
            <View>
              <Text className="text-[32px] font-bold text-primary tracking-tight">Task Oversight</Text>
              <Text className="text-[14px] text-secondary mt-1">Monitor and manage facility operations and procurement requests.</Text>
            </View>
            <View className="flex-row gap-2 bg-surface-container p-1 rounded-xl">
              <Pressable className="px-6 py-2 bg-white shadow-sm rounded-lg">
                <Text className="text-[12px] font-bold text-primary">All Tasks</Text>
              </Pressable>
              <Pressable className="px-6 py-2 hover:bg-surface-container-high rounded-lg">
                <Text className="text-[12px] font-medium text-secondary">Pending</Text>
              </Pressable>
              <Pressable className="px-6 py-2 hover:bg-surface-container-high rounded-lg">
                <Text className="text-[12px] font-medium text-secondary">Finished</Text>
              </Pressable>
            </View>
          </View>

          {/* Metrics */}
          <View className="flex-row flex-wrap gap-6 mb-8">
            <View className="flex-1 min-w-[200px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-32 justify-between">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Total Reports</Text>
              <View className="flex-row items-end justify-between">
                <Text className="text-[32px] font-bold text-primary">{tasks.length}</Text>
                <View className="bg-emerald-50 px-2 py-1 rounded-full">
                  <Text className="text-[12px] font-bold text-emerald-600">+12%</Text>
                </View>
              </View>
            </View>
            <View className="flex-1 min-w-[200px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-32 justify-between">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Critical Priority</Text>
              <View className="flex-row items-end justify-between">
                <Text className="text-[32px] font-bold text-error">0</Text>
                <View className="bg-red-50 px-2 py-1 rounded-full">
                  <Text className="text-[12px] font-bold text-error">-0%</Text>
                </View>
              </View>
            </View>
            <View className="flex-1 min-w-[200px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-32 justify-between">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Completed Today</Text>
              <View className="flex-row items-end justify-between">
                <Text className="text-[32px] font-bold text-[#27c38a]">{tasks.slice(0, 5).length}</Text>
                <View className="bg-teal-50 px-2 py-1 rounded-full">
                  <Text className="text-[12px] font-bold text-[#4edea3]">Peak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Task Table Section */}
          <View className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mb-6">
            <View className="px-6 py-5 border-b border-outline-variant flex-row items-center justify-between bg-surface-container-lowest">
              <View className="flex-row gap-4">
                <View className="px-4 py-2 border border-outline-variant rounded-lg flex-row items-center gap-2">
                  <Text className="text-[12px] font-medium">Sort by: Newest</Text>
                  <MaterialIcons name="expand-more" size={16} color="#757682" />
                </View>
                <View className="px-4 py-2 border border-outline-variant rounded-lg flex-row items-center gap-2">
                  <Text className="text-[12px] font-medium">Dept: All</Text>
                  <MaterialIcons name="filter-alt" size={16} color="#757682" />
                </View>
              </View>
              <Pressable className="flex-row items-center gap-2">
                <MaterialIcons name="file-download" size={16} color="#00236f" />
                <Text className="text-primary font-bold text-[12px] hover:underline">Export CSV</Text>
              </Pressable>
            </View>

            {/* Table Header */}
            <View className="flex-row bg-surface-container-low px-6 py-4">
              <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase tracking-wider">Task Name</Text>
              <Text className="flex-[1.5] text-[12px] font-bold text-secondary uppercase tracking-wider">Branch</Text>
              <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider">Status</Text>
              <Text className="flex-[1.5] text-[12px] font-bold text-secondary uppercase tracking-wider">Submitted By</Text>
              <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider">Timestamp</Text>
            </View>

            {/* Table Rows */}
            {tasks.length === 0 ? (
              <View className="py-8 items-center justify-center border-b border-outline-variant">
                <Text className="text-secondary text-[14px]">No tasks found</Text>
              </View>
            ) : (
              tasks.map((task, index) => (
                <View 
                  key={task.id} 
                  className={`flex-row items-center py-5 px-6 hover:bg-surface-container-low ${
                    index !== tasks.length - 1 ? 'border-b border-outline-variant' : ''
                  }`}
                >
                  {/* Task Name */}
                  <View className="flex-[2] flex-row items-center gap-3 pr-4">
                    <View className="w-10 h-10 rounded-lg bg-primary-container/10 items-center justify-center">
                      <MaterialIcons name="assignment" size={20} color="#00236f" />
                    </View>
                    <View>
                      <Text className="font-bold text-[14px] text-on-surface line-clamp-1">{task.title}</Text>
                      <Text className="text-[12px] text-secondary mt-0.5">Ref #{task.id.substring(0, 8).toUpperCase()}</Text>
                    </View>
                  </View>

                  {/* Branch */}
                  <View className="flex-[1.5] pr-4 justify-center">
                    <View className="self-start px-3 py-1 bg-slate-100 rounded-full">
                      <Text className="text-slate-600 font-bold text-[10px] uppercase tracking-wider">{task.branch_id}</Text>
                    </View>
                  </View>

                  {/* Status */}
                  <View className="flex-[1] pr-4 justify-center">
                    <View className="self-start flex-row items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                      <MaterialIcons name="check-circle" size={14} color="#059669" />
                      <Text className="text-[#059669] font-bold text-[12px]">Finished</Text>
                    </View>
                  </View>

                  {/* Submitted By */}
                  <View className="flex-[1.5] flex-row items-center gap-2 pr-4">
                    <View className="w-6 h-6 rounded-full bg-secondary-container items-center justify-center">
                      <Text className="text-[10px] font-bold text-on-surface">
                        {task.profiles?.full_name ? task.profiles.full_name.substring(0,2).toUpperCase() : 'U'}
                      </Text>
                    </View>
                    <Text className="text-[12px] font-medium text-on-surface line-clamp-1">
                      {task.profiles?.full_name || 'Unknown User'}
                    </Text>
                  </View>

                  {/* Timestamp */}
                  <View className="flex-[1] justify-center">
                    <Text className="text-[12px] text-secondary">
                      {format(new Date(task.created_at), 'MMM dd, hh:mm a')}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {/* Pagination Footer */}
            <View className="px-6 py-4 border-t border-outline-variant flex-row items-center justify-between bg-surface-container-low/50">
              <Text className="text-[12px] text-secondary">Showing {tasks.length} tasks</Text>
              <View className="flex-row items-center gap-2">
                <Pressable className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high">
                  <MaterialIcons name="chevron-left" size={16} color="#505f76" />
                </Pressable>
                <Pressable className="w-8 h-8 items-center justify-center bg-primary rounded-lg">
                  <Text className="text-white font-bold text-[12px]">1</Text>
                </Pressable>
                <Pressable className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high">
                  <MaterialIcons name="chevron-right" size={16} color="#505f76" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Department Distribution (Side Drawer Effect Simulation from Stitch) */}
          <View className="flex-col lg:flex-row gap-6 mb-8">
            <View className="lg:flex-[2] bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[20px] font-bold text-primary">Department Activity</Text>
                <Text className="text-[12px] text-secondary">Live Update</Text>
              </View>
              <View className="h-64 flex-row items-end justify-between gap-4 px-4">
                {/* Simulated Bar Chart via Flexbox */}
                {[
                  { label: 'Ops', height: '65%', color: 'bg-primary/20' },
                  { label: 'Admin', height: '40%', color: 'bg-primary/40' },
                  { label: 'Logistics', height: '85%', color: 'bg-primary' },
                  { label: 'HR', height: '55%', color: 'bg-primary/30' },
                  { label: 'Legal', height: '70%', color: 'bg-primary/70' }
                ].map((bar, i) => (
                  <View key={i} className="flex-1 items-center gap-2">
                    <View className={`w-full rounded-t-lg ${bar.color}`} style={{ height: bar.height }} />
                    <Text className="text-[10px] font-bold text-secondary uppercase tracking-wider">{bar.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Member Recognition */}
            <View className="lg:flex-[1] bg-primary rounded-xl p-6 shadow-md justify-between">
              <View>
                <Text className="text-[20px] font-bold text-white mb-2">Top Performers</Text>
                <Text className="text-[12px] text-blue-200 mb-6">High efficiency staff this month.</Text>
                
                <View className="gap-4">
                  <View className="flex-row items-center justify-between p-3 bg-white/10 rounded-lg">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full border-2 border-white/20 bg-[#00311f] items-center justify-center">
                        <Text className="font-bold text-[10px] text-white">AD</Text>
                      </View>
                      <View>
                        <Text className="font-bold text-[12px] text-white">Alice Doe</Text>
                        <Text className="text-[10px] text-blue-200">24 Tasks Finished</Text>
                      </View>
                    </View>
                    <MaterialIcons name="military-tech" size={20} color="#6ffbbe" />
                  </View>

                  <View className="flex-row items-center justify-between p-3 bg-white/10 rounded-lg">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full border-2 border-white/20 bg-secondary items-center justify-center">
                        <Text className="font-bold text-[10px] text-white">JD</Text>
                      </View>
                      <View>
                        <Text className="font-bold text-[12px] text-white">John Doe</Text>
                        <Text className="text-[10px] text-blue-200">18 Tasks Finished</Text>
                      </View>
                    </View>
                    <MaterialIcons name="military-tech" size={20} color="rgba(255,255,255,0.5)" />
                  </View>
                </View>
              </View>
              
              <Pressable className="w-full py-3 bg-white rounded-lg items-center justify-center mt-6">
                <Text className="font-bold text-[12px] text-primary">View All Members</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
