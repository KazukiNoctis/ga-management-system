import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#f7f9fb' }, // background
        headerTintColor: '#191c1e',
        tabBarStyle: {
          backgroundColor: '#f7f9fb', // background
          borderTopWidth: 1,
          borderTopColor: '#c5c5d3',
        },
        tabBarActiveTintColor: '#1e3a8a', // primary-container
        tabBarInactiveTintColor: '#757682', // outline
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
          title: 'AI Logs',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🤖</Text>,
        }}
      />
    </Tabs>
  );
}
