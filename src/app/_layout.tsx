import '@/global.css';
import { Stack, useSegments, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === 'admin';
    const inPublicGroup = segments[0] === '(public)';

    if (!session) {
      if (!inAuthGroup && !inPublicGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      const isAdmin = profile?.role === 'admin';
      
      // If trying to access admin pages but not an admin, redirect to staff
      if (inAdminGroup && !isAdmin) {
        router.replace('/(staff)');
        return;
      }
      
      // If user is authenticated and in the auth group, public group, or root, redirect them to the correct dashboard
      if (inAuthGroup || inPublicGroup || !segments.length) {
        if (isAdmin) {
          router.replace('/admin');
        } else {
          router.replace('/(staff)');
        }
      }
    }
  }, [session, profile, loading, segments, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(staff)" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
