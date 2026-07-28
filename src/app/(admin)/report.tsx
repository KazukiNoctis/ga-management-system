import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { generateGASummary } from '@/lib/openai';
import { CheckingForm } from '@/types';

export default function ReportScreen() {
  const { profile } = useAuth();
  const [forms, setForms] = useState<CheckingForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      if (!profile?.branch_id) return;
      
      try {
        const { data, error } = await supabase
          .from('checking_forms')
          .select('*')
          .eq('branch_id', profile.branch_id);
          
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
    if (report) {
      Clipboard.setString(report);
      Alert.alert('Success', 'Report copied to clipboard!');
    }
  };

  return (
    <View className="flex-1 bg-gray-950 p-4">
      <View className="bg-gray-900 p-6 rounded-2xl border border-gray-700 mb-6 items-center">
        <Text className="text-4xl mb-2">🤖</Text>
        <Text className="text-white text-xl font-bold mb-1">AI Assistant</Text>
        <Text className="text-gray-400 text-center mb-4">
          Generate an AI-powered summary of {forms.length} checking forms from your branch.
        </Text>
        
        <Pressable 
          className="bg-purple-600 w-full p-4 rounded-xl items-center flex-row justify-center"
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
        <View className="flex-1 bg-gray-800 rounded-2xl border border-purple-500/30 overflow-hidden">
          <View className="bg-gray-900 p-3 border-b border-gray-700 flex-row justify-between items-center">
            <Text className="text-purple-400 font-bold">Generated Report</Text>
            <Pressable onPress={copyToClipboard} className="bg-gray-700 px-3 py-1 rounded">
              <Text className="text-gray-300 text-sm">Copy</Text>
            </Pressable>
          </View>
          <ScrollView className="p-4">
            <Text className="text-gray-200 text-base leading-6 pb-6">
              {report}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
