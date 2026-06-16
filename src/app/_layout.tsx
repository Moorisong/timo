import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import useSettings from '@/hooks/use-settings';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Prevent unhandled promise rejection in environments without splash screen support */
});

export default function Layout() {
  const { isLoaded } = useSettings();

  useEffect(() => {
    if (isLoaded) {
      // Hide the splash screen once the initial layout has mounted and settings are loaded
      SplashScreen.hideAsync().catch(() => {
        /* Prevent unhandled promise rejection */
      });
    }
  }, [isLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="preview" options={{ animation: 'fade' }} />
    </Stack>
  );
}
