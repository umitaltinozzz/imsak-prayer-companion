import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { OneSignal } from 'react-native-onesignal';
import TabNavigator from './src/navigation/TabNavigator';
import ErrorBoundary from './src/shared/ErrorBoundary';

export default function App() {
  useEffect(() => {
    const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
    if (appId) {
      OneSignal.initialize(appId);
      OneSignal.Notifications.requestPermission(true);
    }
  }, []);

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}
