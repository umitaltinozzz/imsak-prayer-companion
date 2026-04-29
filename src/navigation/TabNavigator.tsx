import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import PrayerScreen from '../features/prayer/PrayerScreen';
import QiblaScreen from '../features/qibla/QiblaScreen';
import QuranScreen from '../features/quran/QuranScreen';
import ToolsScreen from '../features/tools/ToolsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Vakitler: '🕌',
    Kible: '🧭',
    Kuran: '📖',
    Araçlar: '⚙️',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? '●'}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Vakitler" component={PrayerScreen} />
      <Tab.Screen name="Kible" component={QiblaScreen} />
      <Tab.Screen name="Kuran" component={QuranScreen} />
      <Tab.Screen name="Araçlar" component={ToolsScreen} />
    </Tab.Navigator>
  );
}
