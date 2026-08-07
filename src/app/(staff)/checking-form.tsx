import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { pickImage, takePhoto, uploadImage } from '@/lib/image-utils';

export default function CheckingFormScreen() {
  const { session, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    if (!session?.user?.id) {
      Alert.alert('Error', 'You are not logged in. Please sign in and try again.');
      return;
    }

    setLoading(true);
    try {
      let uploadedUrl = null;

      if (imageUri) {
        const fileName = `checking-${Date.now()}.jpg`;
        const path = `${session.user.id}/${fileName}`;
        uploadedUrl = await uploadImage(imageUri, 'checking-forms', path);
      }

      const { error } = await supabase.from('checking_forms').insert({
        user_id: session.user.id,
        title: title.trim(),
        note: note.trim() || null,
        image_url: uploadedUrl,
      });

      if (error) throw error;

      Alert.alert('Success', 'Checking form submitted successfully!');
      setTitle('');
      setNote('');
      setImageUri(null);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Submission Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="mb-6">
        <Text className="text-on-surface font-semibold mb-2">Title</Text>
        <TextInput
          className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg p-4 text-base"
          placeholder="E.g., Morning AC Check"
          placeholderTextColor="#757682"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mb-6">
        <Text className="text-on-surface font-semibold mb-2">Notes</Text>
        <TextInput
          className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg p-4 text-base h-32"
          placeholder="Describe the condition..."
          placeholderTextColor="#757682"
          multiline
          textAlignVertical="top"
          value={note}
          onChangeText={setNote}
        />
      </View>

      <View className="mb-8">
        <Text className="text-on-surface font-semibold mb-2">Photo Proof</Text>
        
        {imageUri ? (
          <View className="relative mb-4">
            <Image 
              source={{ uri: imageUri }} 
              className="w-full h-48 rounded-xl bg-surface-container" 
              resizeMode="cover" 
            />
            <Pressable 
              className="absolute top-2 right-2 bg-error/80 p-2 rounded-full"
              onPress={() => setImageUri(null)}
            >
              <Text className="text-white text-xs font-bold">Remove</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="flex-row gap-4">
          <Pressable 
            onPress={handleTakePhoto}
            className="flex-1 bg-surface-container border border-outline-variant py-3 rounded-xl items-center"
          >
            <Text className="text-on-surface-variant font-medium">📷 Take Photo</Text>
          </Pressable>
          <Pressable 
            onPress={handlePickImage}
            className="flex-1 bg-surface-container border border-outline-variant py-3 rounded-xl items-center"
          >
            <Text className="text-on-surface-variant font-medium">🖼️ Pick Image</Text>
          </Pressable>
        </View>
      </View>

      <View className="mb-6 items-center">
        <Text className="text-outline text-sm">
          Auto-timestamp: {new Date().toLocaleString()}
        </Text>
      </View>

      <Pressable 
        onPress={handleSubmit}
        disabled={loading}
        className={`bg-primary-container rounded-lg p-4 items-center mb-10 ${loading ? 'opacity-70' : 'opacity-100'}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Submit Checking Form</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
