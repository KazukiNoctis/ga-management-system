import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';

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
          <Pressable onPress={signOut} className="mr-4 w-10 h-10 rounded-full items-center justify-center bg-surface-container-highest">
            <MaterialIcons name="logout" size={20} color="#ba1a1a" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checking-form"
        options={{
          title: 'Check',
          tabBarIcon: ({ color }) => <MaterialIcons name="fact-check" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: 'Add Rp',
          tabBarIcon: ({ color }) => <MaterialIcons name="add-card" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'AI Refiner',
          tabBarIcon: ({ color }) => <MaterialIcons name="auto-awesome" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
