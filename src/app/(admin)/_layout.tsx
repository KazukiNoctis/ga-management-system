import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="branches"
        options={{
          title: 'Branches',
          tabBarIcon: ({ color }) => <MaterialIcons name="business" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <MaterialIcons name="payments" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Staff',
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'AI Logs',
          tabBarIcon: ({ color }) => <MaterialIcons name="smart-toy" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
