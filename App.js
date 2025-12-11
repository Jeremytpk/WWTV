import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import ContinentsScreen from './src/screens/ContinentsScreen';
import CountriesScreen from './src/screens/CountriesScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import SearchScreen from './src/screens/SearchScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TvGardenWebScreen from './src/screens/TvGardenWebScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new version has been downloaded. Restart the app to apply the update.',
            [
              {
                text: 'Restart',
                onPress: async () => {
                  await Updates.reloadAsync();
                }
              }
            ]
          );
        }
      } catch (error) {
        // Handle error silently in production
        console.log('Error checking for updates:', error);
      }
    }

    if (!__DEV__) {
      checkForUpdates();
    }
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Continents" 
          component={ContinentsScreen}
        />
        <Stack.Screen 
          name="Countries" 
          component={CountriesScreen}
        />
        <Stack.Screen 
          name="Channels" 
          component={ChannelsScreen}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{
            orientation: 'all',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
        />
        <Stack.Screen 
          name="TvGardenWeb" 
          component={TvGardenWebScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </AppProvider>
  );
}
