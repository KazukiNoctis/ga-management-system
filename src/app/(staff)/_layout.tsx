import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth-context';

export default function StaffLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#030712', // bg-gray-950
          borderBottomWidth: 1,
          borderBottomColor: '#1f2937', // border-gray-800
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#030712', // bg-gray-950
          borderTopWidth: 1,
          borderTopColor: '#1f2937', // border-gray-800
        },
        tabBarActiveTintColor: '#3b82f6', // text-blue-500
        tabBarInactiveTintColor: '#6b7280', // text-gray-500
        headerRight: () => (
          <Pressable onPress={signOut} className="mr-4 px-3 py-1 bg-red-900/50 rounded-full border border-red-800">
            <Text className="text-red-400 font-medium">Sign Out</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="checking-form"
        options={{
          title: 'Check',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: 'Add Rp',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
    </Tabs>
  );
}
