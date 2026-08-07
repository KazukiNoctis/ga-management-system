import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, ActivityIndicator,
  RefreshControl, Image, Alert, TextInput, Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '@/types';
import { useRouter } from 'expo-router';

export default function TasksScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Finished'>('All');

  // Detail view state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Resolution Modal State
  const [resolutionModalVisible, setResolutionModalVisible] = useState(false);
  const [resolutionType, setResolutionType] = useState<'Finished' | 'Aborted'>('Finished');
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchTasks = async () => {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'All') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data || []);
      
      // Update selected task if it's currently open
      if (selectedTask) {
        const updated = data?.find(t => t.id === selectedTask.id);
        if (updated) setSelectedTask(updated);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks().then(() => setRefreshing(false));
  }, [filter]);

  const handleResolveTask = async () => {
    if (!selectedTask) return;
    
    setResolving(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: resolutionType,
          resolution_note: resolutionNote.trim() || null
        })
        .eq('id', selectedTask.id);

      if (error) throw error;
      
      Alert.alert('Success', `Task marked as ${resolutionType}`);
      setResolutionModalVisible(false);
      setResolutionNote('');
      fetchTasks();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setResolving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return { bg: 'bg-error-container', text: 'text-error' };
      case 'Low': return { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' };
      default: return { bg: 'bg-primary-container', text: 'text-on-primary-container' };
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Finished': return { bg: 'bg-emerald-50', text: 'text-[#059669]', icon: 'check-circle' as const };
      case 'Aborted': return { bg: 'bg-error-container', text: 'text-error', icon: 'cancel' as const };
      default: return { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'pending' as const };
    }
  };

  // ─── DETAIL VIEW ───
  if (selectedTask) {
    const pColor = getPriorityColor(selectedTask.priority);
    const sColor = getStatusColor(selectedTask.status);
    
    return (
      <View className="flex-1 bg-background">
        {/* Detail Top Bar */}
        <View className="bg-surface flex-row items-center px-4 h-14 border-b border-outline-variant gap-3">
          <Pressable
            onPress={() => setSelectedTask(null)}
            className="w-10 h-10 rounded-full items-center justify-center hover:bg-surface-container"
          >
            <MaterialIcons name="arrow-back" size={24} color="#191c1e" />
          </Pressable>
          <Text className="text-lg font-bold text-on-surface flex-1" numberOfLines={1}>
            {selectedTask.title}
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="p-4 gap-5">
          {/* Status & Meta */}
          <View className="flex-row items-center gap-3">
            <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${sColor.bg}`}>
              <MaterialIcons name={sColor.icon} size={16} className={sColor.text} />
              <Text className={`font-bold text-xs ${sColor.text}`}>{selectedTask.status}</Text>
            </View>
            <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${pColor.bg}`}>
              <Text className={`font-bold text-xs ${pColor.text}`}>{selectedTask.priority} Priority</Text>
            </View>
            <Text className="text-xs text-on-surface-variant flex-1 text-right">
              {new Date(selectedTask.created_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>

          {/* Task Information Card */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 gap-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialIcons name="info-outline" size={20} color="#505f76" />
              <Text className="text-sm font-bold text-secondary uppercase tracking-wider">
                Task Details
              </Text>
            </View>

            <View className="gap-3">
              <View>
                <Text className="text-xs font-semibold text-on-surface-variant mb-1">Title</Text>
                <Text className="text-base font-semibold text-on-surface">{selectedTask.title}</Text>
              </View>

              <View>
                <Text className="text-xs font-semibold text-on-surface-variant mb-1">Description</Text>
                <Text className="text-sm text-on-surface leading-5">
                  {selectedTask.description || 'No description provided.'}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs font-semibold text-on-surface-variant mb-1">Submitted By</Text>
                  <Text className="text-sm font-semibold text-on-surface">{selectedTask.submitter_name}</Text>
                  <Text className="text-xs text-on-surface-variant">{selectedTask.submitter_division}</Text>
                </View>
                <View>
                  <Text className="text-xs font-semibold text-on-surface-variant mb-1">Reference</Text>
                  <Text className="text-xs text-outline font-mono">
                    #{selectedTask.id.substring(0, 8).toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Attached Image */}
          {selectedTask.image_url ? (
            <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 gap-3 shadow-sm">
              <View className="flex-row items-center gap-2 mb-1">
                <MaterialIcons name="photo-camera" size={20} color="#505f76" />
                <Text className="text-sm font-bold text-secondary uppercase tracking-wider">
                  Evidence Photo
                </Text>
              </View>
              <Image
                source={{ uri: selectedTask.image_url }}
                className="w-full h-56 rounded-lg bg-surface-container"
                resizeMode="cover"
              />
            </View>
          ) : null}

          {/* Resolution Details */}
          {selectedTask.status !== 'Pending' ? (
            <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 gap-3 shadow-sm">
              <View className="flex-row items-center gap-2 mb-1">
                <MaterialIcons name="assignment-turned-in" size={20} color="#505f76" />
                <Text className="text-sm font-bold text-secondary uppercase tracking-wider">
                  Resolution
                </Text>
              </View>
              <Text className="text-sm font-semibold text-on-surface">Marked as {selectedTask.status}</Text>
              <Text className="text-sm text-on-surface-variant mt-1">
                {selectedTask.resolution_note || 'No resolution notes provided.'}
              </Text>
            </View>
          ) : null}

          <View className="h-20" />
        </ScrollView>

        {/* Action Buttons for Pending Tasks */}
        {selectedTask.status === 'Pending' && (
          <View className="absolute bottom-0 w-full bg-surface border-t border-outline-variant p-4 flex-row gap-3">
            <Pressable 
              onPress={() => { setResolutionType('Aborted'); setResolutionModalVisible(true); }}
              className="flex-1 py-3.5 bg-error-container rounded-xl items-center"
            >
              <Text className="text-error font-bold">Abort Task</Text>
            </Pressable>
            <Pressable 
              onPress={() => { setResolutionType('Finished'); setResolutionModalVisible(true); }}
              className="flex-[2] py-3.5 bg-primary rounded-xl items-center"
            >
              <Text className="text-white font-bold tracking-wider">Mark as Finished</Text>
            </Pressable>
          </View>
        )}
        
        {/* Resolution Modal */}
        <Modal
          visible={resolutionModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setResolutionModalVisible(false)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-lg">
              <Text className="text-lg font-bold text-on-surface mb-2">
                Mark as {resolutionType}
              </Text>
              <Text className="text-sm text-on-surface-variant mb-4">
                Add an optional note explaining the resolution.
              </Text>
              
              <TextInput
                className="bg-background border border-outline-variant rounded-lg p-3 text-on-surface mb-6"
                placeholder="Resolution notes..."
                placeholderTextColor="#757682"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={resolutionNote}
                onChangeText={setResolutionNote}
              />
              
              <View className="flex-row gap-3">
                <Pressable 
                  onPress={() => setResolutionModalVisible(false)}
                  className="flex-1 py-3 bg-surface-container-high rounded-xl items-center"
                >
                  <Text className="text-on-surface font-bold">Cancel</Text>
                </Pressable>
                <Pressable 
                  onPress={handleResolveTask}
                  disabled={resolving}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    resolutionType === 'Finished' ? 'bg-primary' : 'bg-error'
                  } ${resolving ? 'opacity-70' : ''}`}
                >
                  {resolving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Confirm</Text>}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    );
  }

  // ─── LIST VIEW ───
  if (loading && tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00236f" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="p-4 gap-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00236f" />}
      >
        {/* Filter Tabs */}
        <View className="flex-row bg-surface-container rounded-xl p-1 gap-1">
          {(['All', 'Pending', 'Finished'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                filter === item ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === item ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Task Cards */}
        {tasks.length === 0 ? (
          <View className="py-16 items-center justify-center border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <MaterialIcons name="assignment" size={48} color="#c5c5d3" />
            <Text className="text-on-surface-variant font-semibold mt-4 text-base">
              No tasks found
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {tasks.map((task) => {
              const sColor = getStatusColor(task.status);
              const pColor = getPriorityColor(task.priority);
              
              return (
                <Pressable
                  key={task.id}
                  onPress={() => setSelectedTask(task)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex-row gap-4 items-center shadow-sm active:scale-[0.98]"
                >
                  {/* Icon */}
                  <View className={`w-11 h-11 rounded-xl items-center justify-center ${sColor.bg}`}>
                    <MaterialIcons
                      name={sColor.icon}
                      size={22}
                      className={sColor.text}
                    />
                  </View>

                  {/* Content */}
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-on-surface" numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Text className="text-xs text-on-surface-variant" numberOfLines={1}>
                      By {task.submitter_name} ({task.submitter_division})
                    </Text>
                    
                    <View className="flex-row items-center gap-2 mt-1">
                      <View className={`px-2 py-0.5 rounded-full ${pColor.bg}`}>
                        <Text className={`text-[10px] font-bold ${pColor.text}`}>{task.priority}</Text>
                      </View>
                      <Text className="text-[10px] text-outline">
                        {new Date(task.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* Arrow */}
                  <MaterialIcons name="chevron-right" size={20} color="#c5c5d3" />
                </Pressable>
              );
            })}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>

      {/* FAB — Add New Task */}
      <Pressable
        onPress={() => router.push('/(public)/add-task')}
        className="absolute bottom-6 right-5 w-14 h-14 bg-primary rounded-2xl items-center justify-center shadow-lg active:scale-95"
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
