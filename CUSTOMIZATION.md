# Configuration & Customization Guide

## Customizing the App

### Colors and Theme

The app uses a dark theme with the following color scheme:

```javascript
// Primary Colors
Background: '#1a1a2e'
Card Background: '#16213e'
Accent: '#e94560'
Text Primary: '#fff'
Text Secondary: '#aaa'
Dark Accent: '#0f3460'
```

To change the color scheme, update the StyleSheet objects in each screen file.

### Adding More Data Sources

To integrate additional TV channel sources:

1. **Edit `src/services/tvGardenService.js`**:

```javascript
// Add a new source URL
const ALTERNATIVE_SOURCE_URL = 'https://your-source.com/channels.m3u';

export const fetchFromAlternativeSource = async () => {
  const response = await fetch(ALTERNATIVE_SOURCE_URL);
  const text = await response.text();
  return parseM3U(text);
};
```

2. **Combine Multiple Sources**:

```javascript
export const fetchChannels = async () => {
  try {
    const [tvGarden, alternative] = await Promise.all([
      fetchFromTvGarden(),
      fetchFromAlternativeSource()
    ]);
    return [...tvGarden, ...alternative];
  } catch (error) {
    return getMockChannels();
  }
};
```

### Modifying Continents and Countries

Edit `src/data/continents.js` to add or remove continents and countries:

```javascript
export const CONTINENTS = {
  'Your Continent': {
    name: 'Your Continent',
    emoji: '🌍',
    countries: ['Country 1', 'Country 2', ...]
  },
  // ... other continents
};
```

### Customizing the Video Player

Edit `src/screens/PlayerScreen.js`:

```javascript
// Change video resize mode
resizeMode={ResizeMode.COVER} // or STRETCH, CONTAIN

// Modify control timeout
setTimeout(() => {
  setShowControls(false);
}, 5000); // Change from 3000 to 5000ms

// Add additional controls
<TouchableOpacity onPress={handleRewind}>
  <Text>⏪ Rewind</Text>
</TouchableOpacity>
```

### Adding Features

#### 1. Favorites System

Create a new context for favorites:

```javascript
// src/context/FavoritesContext.js
import React, { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (channel) => {
    setFavorites([...favorites, channel]);
  };

  const removeFavorite = (channelName) => {
    setFavorites(favorites.filter(ch => ch.name !== channelName));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
```

#### 2. Recently Watched

Add AsyncStorage for persistence:

```bash
npx expo install @react-native-async-storage/async-storage
```

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRecentlyWatched = async (channel) => {
  try {
    const recent = await AsyncStorage.getItem('recentlyWatched');
    const recentArray = recent ? JSON.parse(recent) : [];
    recentArray.unshift(channel);
    await AsyncStorage.setItem('recentlyWatched', JSON.stringify(recentArray.slice(0, 10)));
  } catch (error) {
    console.error('Error saving recently watched:', error);
  }
};
```

#### 3. Channel Categories Filter

Add category filtering to ChannelsScreen:

```javascript
const [selectedCategory, setSelectedCategory] = useState('All');
const categories = ['All', 'News', 'Sports', 'Entertainment', 'Music'];

const filterByCategory = (channels) => {
  if (selectedCategory === 'All') return channels;
  return channels.filter(ch => ch.category === selectedCategory);
};
```

### Performance Optimization

#### Lazy Loading

Implement FlatList optimization:

```javascript
<FlatList
  data={channels}
  renderItem={renderChannel}
  keyExtractor={(item, index) => `${item.name}-${index}`}
  // Performance props
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

#### Image Caching

Install and use react-native-fast-image:

```bash
npm install react-native-fast-image
```

```javascript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: channel.logo }}
  style={styles.logo}
  resizeMode={FastImage.resizeMode.contain}
/>
```

### Internationalization (i18n)

Add multi-language support:

```bash
npm install i18next react-i18next
```

```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'select_continent': 'Select a Continent',
        'search_channels': 'Search All Channels',
      }
    },
    es: {
      translation: {
        'select_continent': 'Selecciona un Continente',
        'search_channels': 'Buscar Todos los Canales',
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
});
```

### Build Configuration

#### App Icon and Splash Screen

Replace the default assets:
- `assets/icon.png` - 1024x1024px
- `assets/splash-icon.png` - 1284x2778px (or similar)
- `assets/adaptive-icon.png` - 1024x1024px (Android)

#### App Name and Bundle ID

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### Environment Variables

Create different environments:

```bash
npm install react-native-dotenv
```

Create `.env` file:
```
API_URL=https://tv.garden
API_KEY=your_api_key
```

Use in code:
```javascript
import { API_URL } from '@env';
```

### Analytics Integration

Add Firebase Analytics:

```bash
npx expo install expo-firebase-analytics
```

```javascript
import * as Analytics from 'expo-firebase-analytics';

// Track screen views
Analytics.logEvent('screen_view', {
  screen_name: 'PlayerScreen',
  channel_name: channel.name,
});
```

## Testing

### Unit Tests

```bash
npm install --save-dev jest @testing-library/react-native
```

### E2E Tests

```bash
npm install --save-dev detox
```

## Deployment

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

### Submit to Stores

```bash
eas submit --platform ios
eas submit --platform android
```
