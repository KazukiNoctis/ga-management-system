import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReportAnalytics() {
  // Mock data for the activity feed
  const activityFeed: any[] = [];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1440px] mx-auto w-full p-8">
        
        {/* Header Section */}
        <View className="flex-row items-end justify-between mb-8 gap-4">
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-[12px] font-bold text-secondary">Analytics</Text>
              <MaterialIcons name="chevron-right" size={14} color="#505f76" />
              <Text className="text-primary font-bold text-[12px]">AI Usage Analytics</Text>
            </View>
            <Text className="text-[32px] font-bold text-primary">AI Report Refiner Metrics</Text>
            <Text className="text-[16px] text-secondary mt-1">Deep dive into enterprise-wide AI utilization and processing trends.</Text>
          </View>
          
          <View className="flex-row items-center gap-2 bg-white p-1 rounded-lg border border-outline-variant shadow-sm">
            <Pressable className="px-4 py-2 rounded-md bg-secondary-container">
              <Text className="text-on-secondary-container font-bold text-[12px]">Last 7 Days</Text>
            </Pressable>
            <Pressable className="px-4 py-2 rounded-md hover:bg-surface-container-low">
              <Text className="text-secondary font-medium text-[12px]">Last 30 Days</Text>
            </Pressable>
            <Pressable className="px-4 py-2 rounded-md hover:bg-surface-container-low">
              <Text className="text-secondary font-medium text-[12px]">Custom Range</Text>
            </Pressable>
          </View>
        </View>

        {/* Metrics Bento Grid */}
        <View className="flex-row flex-wrap gap-6 mb-8">
          <View className="flex-1 min-w-[200px] bg-white border border-outline-variant p-6 rounded-xl shadow-sm justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-primary-container rounded-lg">
                <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
              </View>
              <View className="bg-surface-container px-2 py-1 rounded flex-row items-center gap-1">
                <Text className="text-[10px] font-bold text-secondary">No Data</Text>
              </View>
            </View>
            <View>
              <Text className="text-[12px] text-secondary uppercase tracking-wider">Total AI Refinements</Text>
              <Text className="text-[24px] font-bold text-primary mt-1">0</Text>
              <View className="mt-4 h-1 w-full bg-surface-container-low rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
              </View>
            </View>
          </View>

          <View className="flex-1 min-w-[200px] bg-white border border-outline-variant p-6 rounded-xl shadow-sm justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-secondary-container rounded-lg">
                <MaterialIcons name="translate" size={20} color="#0b1c30" />
              </View>
              <View className="bg-surface-container px-2 py-1 rounded flex-row items-center gap-1">
                <Text className="text-[10px] font-bold text-secondary">No Data</Text>
              </View>
            </View>
            <View>
              <Text className="text-[12px] text-secondary uppercase tracking-wider">Languages Supported</Text>
              <Text className="text-[24px] font-bold text-primary mt-1">0</Text>
              <Text className="text-[12px] text-secondary mt-2">Active in 0 regions</Text>
            </View>
          </View>

          <View className="flex-1 min-w-[200px] bg-white border border-outline-variant p-6 rounded-xl shadow-sm justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-[#004a31] rounded-lg">
                <MaterialIcons name="timer" size={20} color="#6ffbbe" />
              </View>
              <View className="bg-surface-container px-2 py-1 rounded flex-row items-center gap-1">
                <Text className="text-[10px] font-bold text-secondary">No Data</Text>
              </View>
            </View>
            <View>
              <Text className="text-[12px] text-secondary uppercase tracking-wider">Avg. Processing Time</Text>
              <Text className="text-[24px] font-bold text-primary mt-1">0.0s</Text>
              <Text className="text-[12px] text-secondary mt-2">Insufficient data</Text>
            </View>
          </View>

          <View className="flex-1 min-w-[200px] bg-white border border-outline-variant p-6 rounded-xl shadow-sm justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <View className="p-2 bg-surface-container-highest rounded-lg">
                <MaterialIcons name="token" size={20} color="#444651" />
              </View>
              <View className="bg-surface-container px-2 py-1 rounded flex-row items-center gap-1">
                <Text className="text-[10px] font-bold text-secondary">No Data</Text>
              </View>
            </View>
            <View>
              <Text className="text-[12px] text-secondary uppercase tracking-wider">Token Efficiency</Text>
              <Text className="text-[24px] font-bold text-primary mt-1">0%</Text>
              <View className="mt-4 h-1 w-full bg-surface-container-low rounded-full overflow-hidden">
                <View className="h-full bg-[#27c38a] rounded-full" style={{ width: '0%' }} />
              </View>
            </View>
          </View>
        </View>

        {/* Asymmetric Layout: Charts and Table */}
        <View className="flex-col lg:flex-row gap-6 mb-8">
          {/* Usage Trend Chart */}
          <View className="lg:flex-[2] bg-white border border-outline-variant rounded-xl shadow-sm p-6 justify-between min-h-[400px]">
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-[20px] font-bold text-primary">Daily Refinement Trends</Text>
                <Text className="text-[14px] text-secondary">Weekly volume distribution</Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface-container-low">
                  <MaterialIcons name="download" size={18} color="#505f76" />
                </Pressable>
                <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface-container-low">
                  <MaterialIcons name="more-vert" size={18} color="#505f76" />
                </Pressable>
              </View>
            </View>
            
            <View className="flex-1 flex-row items-end justify-between gap-4 px-4 pb-6">
              {[
                { day: 'MON', height: '0%', val: 0, color: 'bg-primary-container/20' },
                { day: 'TUE', height: '0%', val: 0, color: 'bg-primary-container/20' },
                { day: 'WED', height: '0%', val: 0, color: 'bg-primary' },
                { day: 'THU', height: '0%', val: 0, color: 'bg-primary-container/20' },
                { day: 'FRI', height: '0%', val: 0, color: 'bg-primary-container/20' },
                { day: 'SAT', height: '0%', val: 0, color: 'bg-surface-container-high' },
                { day: 'SUN', height: '0%', val: 0, color: 'bg-surface-container-high' }
              ].map((item, i) => (
                <View key={i} className="flex-1 items-center">
                  <View className={`w-full rounded-t-lg ${item.color}`} style={{ height: item.height }} />
                  <Text className={`text-[10px] mt-3 ${item.day === 'WED' ? 'text-primary font-black' : 'text-secondary font-bold'}`}>{item.day}</Text>
                </View>
              ))}
            </View>
            
            <View className="border-t border-outline-variant pt-6 flex-row items-center justify-around">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-primary" />
                <Text className="text-[12px] font-bold text-secondary">Peak Usage</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-primary-container/30" />
                <Text className="text-[12px] font-bold text-secondary">Average Flow</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-surface-container-high" />
                <Text className="text-[12px] font-bold text-secondary">Low Activity</Text>
              </View>
            </View>
          </View>

          {/* Side Distribution */}
          <View className="lg:flex-[1] bg-white border border-outline-variant rounded-xl shadow-sm p-6 justify-between min-h-[400px]">
            <View>
              <Text className="text-[20px] font-bold text-primary mb-6">Language Distribution</Text>
              <View className="gap-6">
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-bold text-[12px] text-on-surface">English (US/UK)</Text>
                    <Text className="text-[12px] text-secondary">0%</Text>
                  </View>
                  <View className="h-2 w-full bg-surface-container-low rounded-full">
                    <View className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                  </View>
                </View>
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-bold text-[12px] text-on-surface">Japanese</Text>
                    <Text className="text-[12px] text-secondary">0%</Text>
                  </View>
                  <View className="h-2 w-full bg-surface-container-low rounded-full">
                    <View className="h-full bg-[#27c38a] rounded-full" style={{ width: '0%' }} />
                  </View>
                </View>
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-bold text-[12px] text-on-surface">German</Text>
                    <Text className="text-[12px] text-secondary">0%</Text>
                  </View>
                  <View className="h-2 w-full bg-surface-container-low rounded-full">
                    <View className="h-full bg-[#505f76] rounded-full" style={{ width: '0%' }} />
                  </View>
                </View>
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-bold text-[12px] text-on-surface">Mandarin</Text>
                    <Text className="text-[12px] text-secondary">0%</Text>
                  </View>
                  <View className="h-2 w-full bg-surface-container-low rounded-full">
                    <View className="h-full bg-secondary-container rounded-full" style={{ width: '0%' }} />
                  </View>
                </View>
              </View>
            </View>
            
            <View className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <Text className="text-[12px] text-primary italic">"Insufficient data to aggregate refinement scores for this period."</Text>
            </View>
          </View>
        </View>

        {/* Usage List/Table */}
        <View className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-8">
          <View className="px-6 py-6 border-b border-outline-variant flex-row items-center justify-between">
            <Text className="text-[20px] font-bold text-primary">Recent Activity Feed</Text>
            <View className="flex-row items-center gap-4">
              <View className="border border-outline-variant rounded px-2 py-1 flex-row items-center gap-1 bg-surface-container-low">
                <MaterialIcons name="filter-list" size={16} color="#505f76" />
                <Text className="text-[12px] text-secondary font-bold">All Users</Text>
              </View>
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-primary font-bold text-[12px]">View Full History</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#00236f" />
              </Pressable>
            </View>
          </View>

          {/* Table Header */}
          <View className="flex-row bg-surface-container-low/50 px-6 py-4">
            <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase tracking-wider">User Name</Text>
            <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase tracking-wider">Department</Text>
            <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase tracking-wider">Date/Time</Text>
            <Text className="flex-[1.5] text-[12px] font-bold text-secondary uppercase tracking-wider">Source Language</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase tracking-wider text-right">Status</Text>
          </View>

          {/* Table Rows */}
          {activityFeed.length === 0 ? (
            <View className="py-8 items-center justify-center border-b border-outline-variant">
              <Text className="text-secondary text-[14px]">No recent activity found</Text>
            </View>
          ) : (
            activityFeed.map((row, i) => (
              <View key={row.id} className={`flex-row items-center px-6 py-4 hover:bg-surface-container-low ${i !== activityFeed.length - 1 ? 'border-b border-outline-variant' : ''}`}>
                <View className="flex-[2] flex-row items-center gap-3 pr-4">
                  <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center">
                    <Text className="text-[10px] font-bold text-on-secondary-container">{row.initials}</Text>
                  </View>
                  <Text className="text-[14px] font-bold text-on-surface">{row.name}</Text>
                </View>
                
                <View className="flex-[2] pr-4">
                  <Text className="text-[14px] text-secondary">{row.dept}</Text>
                </View>
                
                <View className="flex-[2] pr-4">
                  <Text className="text-[14px] text-on-surface font-medium">{row.time}</Text>
                </View>
                
                <View className="flex-[1.5] pr-4">
                  <View className="self-start px-2 py-1 bg-surface-container-high rounded">
                    <Text className="text-[11px] font-bold text-secondary">{row.lang}</Text>
                  </View>
                </View>
                
                <View className="flex-[1] items-end">
                  <View className={`px-3 py-1 rounded-full ${row.color}`}>
                    <Text className="text-[10px] font-bold uppercase">{row.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Footer */}
          <View className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant flex-row items-center justify-between">
            <Text className="text-[12px] text-secondary">Showing {activityFeed.length} active refinement tasks</Text>
            <View className="flex-row gap-2">
              <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface">
                <MaterialIcons name="chevron-left" size={16} color="#505f76" />
              </Pressable>
              <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded bg-white shadow-sm">
                <Text className="text-primary font-bold text-[12px]">1</Text>
              </Pressable>
              <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface">
                <Text className="text-secondary text-[12px]">2</Text>
              </Pressable>
              <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface">
                <Text className="text-secondary text-[12px]">3</Text>
              </Pressable>
              <Pressable className="w-8 h-8 items-center justify-center border border-outline-variant rounded hover:bg-surface">
                <MaterialIcons name="chevron-right" size={16} color="#505f76" />
              </Pressable>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
