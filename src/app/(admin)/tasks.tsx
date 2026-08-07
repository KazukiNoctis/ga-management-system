import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '@/types';

export default function TaskOversight() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
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

  const criticalTasks = tasks.filter(t => t.priority === 'Critical').length;
  const completedToday = tasks.filter(t => {
    const today = new Date();
    const created = new Date(t.created_at);
    return t.status === 'Finished' &&
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear();
  }).length;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1440px] mx-auto w-full p-8">
        
        {/* Header & Stats Bento Grid */}
        <View className="flex-col gap-6">
          <View className="flex-col md:flex-row md:items-center justify-between gap-4">
            <View>
              <Text className="text-[32px] font-bold text-primary tracking-tight">Task Oversight</Text>
              <Text className="text-[14px] text-secondary mt-1">Monitor and manage facility operations and submitted tasks.</Text>
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
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Total Tasks</Text>
              <View className="flex-row items-end justify-between">
                <Text className="text-[32px] font-bold text-primary">{tasks.length}</Text>
                <View className="bg-emerald-50 px-2 py-1 rounded-full">
                  <Text className="text-[12px] font-bold text-emerald-600">Active</Text>
                </View>
              </View>
            </View>
            <View className="flex-1 min-w-[200px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-32 justify-between">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Critical Priority</Text>
              <View className="flex-row items-end justify-between">
                <Text className={`text-[32px] font-bold ${criticalTasks > 0 ? 'text-error' : 'text-primary'}`}>
                  {criticalTasks}
                </Text>
                <View className={`${criticalTasks > 0 ? 'bg-red-50' : 'bg-surface-container'} px-2 py-1 rounded-full`}>
                  <Text className={`text-[12px] font-bold ${criticalTasks > 0 ? 'text-error' : 'text-secondary'}`}>
                    {criticalTasks > 0 ? 'Action Needed' : 'All Clear'}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-1 min-w-[200px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm h-32 justify-between">
              <Text className="text-[12px] font-bold text-secondary uppercase tracking-widest">Completed Today</Text>
              <View className="flex-row items-end justify-between">
                <Text className="text-[32px] font-bold text-[#27c38a]">{completedToday}</Text>
                <View className="bg-teal-50 px-2 py-1 rounded-full">
                  <Text className="text-[12px] font-bold text-[#4edea3]">Efficiency</Text>
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
                  <Text className="text-[12px] font-medium">Priority: All</Text>
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
              <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase tracking-wider">Task Title</Text>
              <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider">Priority</Text>
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

                  {/* Priority */}
                  <View className="flex-[1] pr-4 justify-center">
                    <View className={`self-start px-3 py-1 rounded-full ${
                      task.priority === 'Critical' ? 'bg-error-container' : 
                      task.priority === 'Medium' ? 'bg-primary-container' : 'bg-surface-container-high'
                    }`}>
                      <Text className={`font-bold text-[10px] uppercase tracking-wider ${
                        task.priority === 'Critical' ? 'text-error' : 
                        task.priority === 'Medium' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}>{task.priority}</Text>
                    </View>
                  </View>

                  {/* Status */}
                  <View className="flex-[1] pr-4 justify-center">
                    <View className={`self-start flex-row items-center gap-1 px-3 py-1 rounded-full ${
                      task.status === 'Finished' ? 'bg-emerald-50' :
                      task.status === 'Aborted' ? 'bg-error-container' : 'bg-amber-50'
                    }`}>
                      <MaterialIcons 
                        name={task.status === 'Finished' ? 'check-circle' : task.status === 'Aborted' ? 'cancel' : 'pending'} 
                        size={14} 
                        color={task.status === 'Finished' ? '#059669' : task.status === 'Aborted' ? '#ba1a1a' : '#d97706'} 
                      />
                      <Text className={`font-bold text-[12px] ${
                        task.status === 'Finished' ? 'text-[#059669]' : task.status === 'Aborted' ? 'text-error' : 'text-amber-700'
                      }`}>{task.status}</Text>
                    </View>
                  </View>

                  {/* Submitted By */}
                  <View className="flex-[1.5] flex-row items-center gap-2 pr-4">
                    <View className="w-6 h-6 rounded-full bg-secondary-container items-center justify-center">
                      <Text className="text-[10px] font-bold text-on-surface">
                        {task.submitter_name.substring(0,2).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-[12px] font-medium text-on-surface line-clamp-1">
                        {task.submitter_name}
                      </Text>
                      <Text className="text-[10px] text-secondary line-clamp-1">
                        {task.submitter_division}
                      </Text>
                    </View>
                  </View>

                  {/* Timestamp */}
                  <View className="flex-[1] justify-center">
                    <Text className="text-[12px] text-secondary">
                      {new Date(task.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}
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
        </View>
      </View>
    </ScrollView>
  );
}
