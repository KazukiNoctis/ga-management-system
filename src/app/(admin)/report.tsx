import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface AILog {
  id: string;
  created_at: string;
  generated_report: string;
  profiles: {
    full_name: string;
    branch_id: string;
  } | null;
}

export default function AILogsScreen() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!profile?.branch_id) return;
      
      try {
        const { data, error } = await supabase
          .from('ai_report_logs')
          .select(`
            id,
            created_at,
            generated_report,
            profiles!inner(
              full_name,
              branch_id
            )
          `)
          .eq('profiles.branch_id', profile.branch_id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setLogs(data as any as AILog[]);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [profile]);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-4">
        <Text className="text-on-surface text-2xl font-bold">AI Usage Logs</Text>
        <Text className="text-on-surface-variant mt-1">
          History of AI generated reports for your branch.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {logs.length === 0 ? (
          <View className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm items-center mt-4">
            <Text className="text-on-surface-variant text-center">No AI logs found for this branch.</Text>
          </View>
        ) : (
          logs.map((log) => {
            const isExpanded = expandedId === log.id;
            const logDate = new Date(log.created_at).toLocaleString();
            const staffName = log.profiles?.full_name || 'Unknown Staff';
            const reportContent = log.generated_report || 'No content';
            const snippet = reportContent.length > 100 ? reportContent.substring(0, 100) + '...' : reportContent;

            return (
              <Pressable 
                key={log.id} 
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm mb-3"
                onPress={() => setExpandedId(isExpanded ? null : log.id)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-2">
                    <Text className="text-on-surface font-bold text-base">{staffName}</Text>
                    <Text className="text-outline text-xs mt-1">{logDate}</Text>
                  </View>
                  <View className="bg-secondary-container px-2 py-1 rounded border border-outline-variant">
                    <Text className="text-on-secondary-container text-xs font-semibold">AI Generated</Text>
                  </View>
                </View>

                <View className="bg-surface-container p-3 rounded-lg mt-2">
                  <Text className="text-on-surface-variant text-sm leading-5">
                    {isExpanded ? reportContent : snippet}
                  </Text>
                </View>
                
                <Text className="text-primary text-xs font-semibold mt-3 text-right">
                  {isExpanded ? 'Show Less' : 'Read Full Report'}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
