import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Member Management', icon: 'group', path: '/admin' },
    { name: 'Task Oversight', icon: 'assignment', path: '/admin/tasks' },
    { name: 'Expense Tracking', icon: 'payments', path: '/admin/expenses' },
    { name: 'AI Usage Analytics', icon: 'analytics', path: '/admin/report' },
  ];

  return (
    <View className="flex-1 flex-row bg-background">
      {/* SideNavBar (Fixed width 64 units = 256px) */}
      <View className="w-64 bg-surface border-r border-outline-variant flex-col py-6 px-4">
        {/* Brand */}
        <View className="px-4 mb-8">
          <Text className="text-[20px] leading-[28px] font-black text-primary">Admin Central</Text>
          <Text className="text-[12px] leading-[16px] font-semibold tracking-wider text-secondary">General Affairs Div.</Text>
        </View>

        {/* Navigation */}
        <View className="flex-1 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Pressable
                key={item.name}
                onPress={() => router.push(item.path as any)}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive ? 'bg-secondary-container' : 'hover:bg-surface-container-high'
                }`}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? '#54647a' : '#505f76'}
                />
                <Text
                  className={`text-[14px] leading-[20px] ${
                    isActive ? 'text-on-secondary-container font-bold' : 'text-secondary'
                  }`}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Actions */}
        <View className="border-t border-outline-variant pt-4 gap-1">
          <Pressable className="w-full mb-4 bg-primary rounded-lg py-3 flex-row items-center justify-center gap-2">
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text className="text-on-primary font-bold">New Request</Text>
          </Pressable>
          <Pressable className="flex-row items-center gap-3 px-4 py-3 hover:bg-surface-container-high rounded-lg">
            <MaterialIcons name="help" size={24} color="#505f76" />
            <Text className="text-[14px] text-secondary">Help Center</Text>
          </Pressable>
          <Pressable
            onPress={signOut}
            className="flex-row items-center gap-3 px-4 py-3 hover:bg-error-container/10 rounded-lg"
          >
            <MaterialIcons name="logout" size={24} color="#ba1a1a" />
            <Text className="text-[14px] text-error">Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 flex-col">
        {/* TopNavBar */}
        <View className="h-16 bg-surface-container-lowest border-b border-outline-variant flex-row items-center justify-between px-8">
          <View className="flex-row items-center gap-8">
            <Text className="text-[24px] font-bold text-primary">GA Manager</Text>
            
            {/* Search Bar */}
            <View className="flex-row items-center bg-surface-container-low px-4 py-2 rounded-full w-80">
              <MaterialIcons name="search" size={20} color="#757682" />
              <TextInput
                className="flex-1 ml-2 text-[14px] text-on-surface"
                placeholder="Search..."
                placeholderTextColor="#757682"
              />
            </View>
          </View>

          {/* Top Right Profile & Actions */}
          <View className="flex-row items-center gap-4">
            <Pressable className="w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-low relative">
              <MaterialIcons name="notifications" size={24} color="#54647a" />
              <View className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </Pressable>
            <Pressable className="w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-low">
              <MaterialIcons name="settings" size={24} color="#54647a" />
            </Pressable>
            <View className="h-8 w-px bg-outline-variant mx-2" />
            <View className="flex-row items-center gap-3">
              <View className="items-end hidden sm:flex">
                <Text className="text-[12px] font-bold text-on-surface">{profile?.full_name || 'Admin'}</Text>
                <Text className="text-[10px] text-secondary">Global Administrator</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center">
                <Text className="text-on-primary font-bold">
                  {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'AD'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Page Content */}
        <View className="flex-1 bg-background">
          <Slot />
        </View>
      </View>
    </View>
  );
}
