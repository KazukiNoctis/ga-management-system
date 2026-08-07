import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';
import { pickImage, takePhoto, uploadImage } from '@/lib/image-utils';
import { useRouter } from 'expo-router';

export default function AddTaskScreen() {
  const router = useRouter();
  const { session, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterDivision, setSubmitterDivision] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'Critical'>('Medium');
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill for authenticated GA members
  useEffect(() => {
    if (session?.user && profile) {
      setSubmitterName(profile.full_name || '');
      setSubmitterDivision('General Affairs');
    }
  }, [session, profile]);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setImageUri(uri);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please provide a task title.');
      return;
    }
    if (!submitterName.trim()) {
      Alert.alert('Validation', 'Please provide your Name.');
      return;
    }
    if (!submitterDivision.trim()) {
      Alert.alert('Validation', 'Please provide your Division.');
      return;
    }

    setLoading(true);
    try {
      let uploadedUrl = null;

      if (imageUri) {
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const path = `${fileName}`;

        // Upload to tasks_media
        uploadedUrl = await uploadImage(imageUri, 'tasks_media', path);
      }

      const { error } = await supabase.from('tasks').insert({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        submitter_name: submitterName.trim(),
        submitter_division: submitterDivision.trim(),
        image_url: uploadedUrl,
        user_id: session?.user?.id || null, // null for unauthenticated users
        status: 'Pending'
      });

      if (error) throw error;

      Alert.alert('Success', 'Task has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }
        }
      ]);
    } catch (error: any) {
      console.error('Submit Error:', error);
      Alert.alert('Submission Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="bg-surface flex-row items-center justify-between px-4 h-14 border-b border-outline-variant">
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="close" size={24} color="#191c1e" />
        </Pressable>
        <Text className="text-lg font-bold text-on-surface">Submit New Task</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-5" contentContainerClassName="pb-10">
        
        {/* Submitter Info */}
        <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="person" size={20} color="#00236f" />
            <Text className="text-sm font-bold text-secondary uppercase tracking-wider">Contact Info</Text>
          </View>
          
          <Text className="text-sm font-bold text-on-surface mb-2">Full Name <Text className="text-error">*</Text></Text>
          <TextInput
            className="bg-background border border-outline-variant p-3 rounded-lg text-on-surface mb-4"
            placeholder="e.g. John Doe"
            placeholderTextColor="#757682"
            value={submitterName}
            onChangeText={setSubmitterName}
            editable={!session?.user} // Prevent GA from changing it manually if desired, but user didn't specify. Left editable just in case, wait, I will make it read-only for GA
          />

          <Text className="text-sm font-bold text-on-surface mb-2">Division <Text className="text-error">*</Text></Text>
          <TextInput
            className="bg-background border border-outline-variant p-3 rounded-lg text-on-surface"
            placeholder="e.g. Operations"
            placeholderTextColor="#757682"
            value={submitterDivision}
            onChangeText={setSubmitterDivision}
          />
        </View>

        {/* Task Details */}
        <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="assignment" size={20} color="#00236f" />
            <Text className="text-sm font-bold text-secondary uppercase tracking-wider">Task Details</Text>
          </View>

          <Text className="text-sm font-bold text-on-surface mb-2">Title <Text className="text-error">*</Text></Text>
          <TextInput
            className="bg-background border border-outline-variant p-3 rounded-lg text-on-surface mb-4"
            placeholder="Briefly describe the issue"
            placeholderTextColor="#757682"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-sm font-bold text-on-surface mb-2">Description</Text>
          <TextInput
            className="bg-background border border-outline-variant p-3 rounded-lg text-on-surface mb-4"
            placeholder="Add any extra details, location, etc."
            placeholderTextColor="#757682"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text className="text-sm font-bold text-on-surface mb-2">Priority</Text>
          <View className="flex-row gap-2">
            {(['Low', 'Medium', 'Critical'] as const).map(p => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                className={`flex-1 py-2.5 rounded-lg border items-center ${
                  priority === p 
                    ? (p === 'Critical' ? 'bg-error border-error' : 'bg-primary border-primary') 
                    : 'bg-background border-outline-variant'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  priority === p ? 'text-white' : 'text-secondary'
                }`}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Photo Upload */}
        <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="camera-alt" size={20} color="#00236f" />
            <Text className="text-sm font-bold text-secondary uppercase tracking-wider">Evidence (Optional)</Text>
          </View>

          {imageUri ? (
            <View className="relative mb-4">
              <Image 
                source={{ uri: imageUri }} 
                className="w-full h-48 rounded-lg bg-surface-container"
                resizeMode="cover"
              />
              <Pressable 
                onPress={() => setImageUri(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-error rounded-full items-center justify-center shadow-lg"
              >
                <MaterialIcons name="close" size={16} color="#ffffff" />
              </Pressable>
            </View>
          ) : null}

          <View className="flex-row gap-3">
            <Pressable 
              onPress={handleTakePhoto}
              className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-high"
            >
              <MaterialIcons name="photo-camera" size={20} color="#191c1e" />
              <Text className="text-sm font-bold text-on-surface">Take Photo</Text>
            </Pressable>
            
            <Pressable 
              onPress={handlePickImage}
              className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-high"
            >
              <MaterialIcons name="photo-library" size={20} color="#191c1e" />
              <Text className="text-sm font-bold text-on-surface">Gallery</Text>
            </Pressable>
          </View>
        </View>

        <Pressable 
          onPress={handleSubmit}
          disabled={loading}
          className={`py-4 rounded-xl items-center justify-center shadow-sm ${loading ? 'bg-primary/70' : 'bg-primary'}`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base tracking-wider">Submit Task</Text>
          )}
        </Pressable>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
