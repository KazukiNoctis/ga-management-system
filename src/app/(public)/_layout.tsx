import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F9FA' }
      }}
    >
      <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
