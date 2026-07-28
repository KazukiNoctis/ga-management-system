import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { pickImage, takePhoto, uploadImage } from '@/lib/image-utils';

export default function AddExpenseScreen() {
  const { session, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
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
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please enter a title and amount');
      return;
    }
    
    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!profile?.branch_id || !session?.user?.id) {
      Alert.alert('Error', 'User profile information is missing');
      return;
    }

    setLoading(true);
    try {
      let uploadedUrl = null;

      if (imageUri) {
        const fileName = `receipt-${Date.now()}.jpg`;
        const path = `${session.user.id}/${fileName}`;
        uploadedUrl = await uploadImage(imageUri, 'receipts', path);
      }

      const { error } = await supabase.from('expenses').insert({
        user_id: session.user.id,
        branch_id: profile.branch_id,
        title: title.trim(),
        amount: parsedAmount,
        description: description.trim() || null,
        image_url: uploadedUrl,
      });

      if (error) throw error;

      Alert.alert('Success', 'Expense submitted successfully!');
      setTitle('');
      setAmount('');
      setDescription('');
      setImageUri(null);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Submission Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-950 p-4">
      <View className="mb-4">
        <Text className="text-gray-300 font-medium mb-2">Expense Title</Text>
        <TextInput
          className="bg-gray-900 border border-gray-800 text-white rounded-xl p-4 text-base"
          placeholder="E.g., Office Supplies"
          placeholderTextColor="#6b7280"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 font-medium mb-2">Amount (Rp)</Text>
        <TextInput
          className="bg-gray-900 border border-gray-800 text-white rounded-xl p-4 text-base"
          placeholder="0"
          placeholderTextColor="#6b7280"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-300 font-medium mb-2">Description (Optional)</Text>
        <TextInput
          className="bg-gray-900 border border-gray-800 text-white rounded-xl p-4 text-base h-24"
          placeholder="Additional details..."
          placeholderTextColor="#6b7280"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View className="mb-8">
        <Text className="text-gray-300 font-medium mb-2">Receipt Photo</Text>
        
        {imageUri ? (
          <View className="relative mb-4">
            <Image 
              source={{ uri: imageUri }} 
              className="w-full h-48 rounded-xl bg-gray-800" 
              resizeMode="cover" 
            />
            <Pressable 
              className="absolute top-2 right-2 bg-red-500/80 p-2 rounded-full"
              onPress={() => setImageUri(null)}
            >
              <Text className="text-white text-xs font-bold">Remove</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="flex-row gap-4">
          <Pressable 
            onPress={handleTakePhoto}
            className="flex-1 bg-gray-800 border border-gray-700 py-3 rounded-xl items-center"
          >
            <Text className="text-gray-300 font-medium">📷 Take Photo</Text>
          </Pressable>
          <Pressable 
            onPress={handlePickImage}
            className="flex-1 bg-gray-800 border border-gray-700 py-3 rounded-xl items-center"
          >
            <Text className="text-gray-300 font-medium">🖼️ Pick Image</Text>
          </Pressable>
        </View>
      </View>

      <Pressable 
        onPress={handleSubmit}
        disabled={loading}
        className={`bg-green-600 rounded-xl p-4 items-center mb-10 ${loading ? 'opacity-70' : 'opacity-100'}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Submit Expense</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
