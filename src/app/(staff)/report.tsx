import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { generateGASummary } from '@/lib/openai';
import { CheckingForm } from '@/types';

export default function StaffReportScreen() {
  const { profile } = useAuth();
  const [forms, setForms] = useState<CheckingForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      if (!profile?.branch_id || !profile?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('checking_forms')
          .select('*')
          .eq('branch_id', profile.branch_id)
          .eq('user_id', profile.id);
          
        if (error) throw error;
        if (data) setForms(data as CheckingForm[]);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [profile]);

  const handleGenerateReport = async () => {
    if (forms.length === 0) {
      Alert.alert('No Data', 'There are no checking forms to analyze.');
      return;
    }

    try {
      setGenerating(true);
      const generatedReport = await generateGASummary(forms);
      setReport(generatedReport);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    // Clipboard removed for compatibility, typically use expo-clipboard here
    Alert.alert('Copy feature', 'To copy, select the text directly.');
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm mb-6 items-center">
        <Text className="text-on-surface text-4xl mb-2">🤖</Text>
        <Text className="text-on-surface text-xl font-bold mb-1">AI Assistant</Text>
        <Text className="text-on-surface-variant text-center mb-4">
          Generate an AI-powered summary of your {forms.length} checking forms.
        </Text>
        
        <Pressable 
          className="bg-primary-container w-full p-4 rounded-xl items-center flex-row justify-center"
          onPress={handleGenerateReport}
          disabled={generating || loading}
        >
          {generating ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-lg">
            {generating ? 'Generating...' : 'Generate AI Summary'}
          </Text>
        </Pressable>
      </View>

      {report && (
        <View className="flex-1 bg-surface-container-lowest rounded-xl border border-primary-container/30 shadow-sm overflow-hidden">
          <View className="bg-surface-container p-3 border-b border-outline-variant flex-row justify-between items-center">
            <Text className="text-primary font-bold">Generated Report</Text>
            <Pressable onPress={copyToClipboard} className="bg-surface-container-high px-3 py-1 rounded">
              <Text className="text-on-surface-variant text-sm">Copy</Text>
            </Pressable>
          </View>
          <ScrollView className="p-4">
            <Text className="text-on-surface text-base leading-6 pb-6">
              {report}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
