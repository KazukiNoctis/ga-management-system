import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#111827' }, // gray-900
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#111827', // gray-900
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#3b82f6', // blue-500
        tabBarInactiveTintColor: '#6b7280', // gray-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="branches"
        options={{
          title: 'Branches',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏢</Text>,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💳</Text>,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'AI Report',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🤖</Text>,
        }}
      />
    </Tabs>
  );
}
