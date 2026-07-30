import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth-context';

export default function StaffLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f7f9fb', // bg-surface
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5d3', // border-outline-variant
        },
        headerTintColor: '#191c1e',
        tabBarStyle: {
          backgroundColor: '#f7f9fb',
          borderTopWidth: 1,
          borderTopColor: '#c5c5d3',
        },
        tabBarActiveTintColor: '#1e3a8a', // text-primary-container
        tabBarInactiveTintColor: '#757682', // text-outline
        headerRight: () => (
          <Pressable onPress={signOut} className="mr-4 px-3 py-1 bg-error-container rounded-full border border-error">
            <Text className="text-error font-medium">Sign Out</Text>
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
      <Tabs.Screen
        name="report"
        options={{
          title: 'AI Refiner',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✨</Text>,
        }}
      />
    </Tabs>
  );
}
