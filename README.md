# World Wide TV (WWTV)

A React Native mobile application built with Expo that provides access to free worldwide TV channels from tv.garden.

## Features

- 📺 **Browse by Continent & Country**: Navigate through continents to find channels from specific countries
- 🔍 **Global Search**: Search for channels by name, country, or category
- 📱 **Responsive Design**: Adapts to different device screen sizes
- 🔄 **Screen Orientation Support**: Automatically handles device orientation
- ⛶ **Fullscreen Mode**: Watch channels in fullscreen with landscape orientation
- ▶️ **Video Player Controls**: Play, pause, and control video playback
- 🌍 **Worldwide Coverage**: Access channels from Africa, Asia, Europe, North America, South America, and Oceania

## Tech Stack

- **React Native** - Mobile framework
- **Expo 52** - Development platform
- **React Navigation** - Navigation library
- **Expo Video** - Video playback
- **Expo Screen Orientation** - Handle device orientation
- **tv.garden** - TV channels data source

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your device:
   - **iOS**: Press `i` or scan the QR code with your iPhone camera
   - **Android**: Press `a` or scan the QR code with the Expo Go app
   - **Web**: Press `w` (limited video support)

## Project Structure

```
wwtv/
├── src/
│   ├── data/
│   │   └── continents.js       # Continents and countries data
│   ├── screens/
│   │   ├── ContinentsScreen.js # Browse continents
│   │   ├── CountriesScreen.js  # Browse countries
│   │   ├── ChannelsScreen.js   # View country channels
│   │   ├── SearchScreen.js     # Search all channels
│   │   └── PlayerScreen.js     # Video player
│   └── services/
│       └── tvGardenService.js  # TV.garden API integration
├── App.js                      # Main app with navigation
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```

## Usage

1. **Browse by Location**:
   - Select a continent from the home screen
   - Choose a country
   - Browse available channels
   - Tap a channel to start watching

2. **Search Channels**:
   - Tap the "Search All Channels" button on the home screen
   - Type channel name, country, or category
   - Tap any result to watch

3. **Video Player**:
   - Tap the video to show/hide controls
   - Use the play/pause button to control playback
   - Tap the fullscreen button to enter fullscreen mode
   - In fullscreen, the device will rotate to landscape
   - Tap the back button or use device back navigation to exit

## TV.garden Integration

The app fetches channel data from tv.garden's public M3U playlist. Channels are organized by:
- Country
- Category (News, Entertainment, Sports, etc.)
- Name

If the tv.garden service is unavailable, the app includes mock data for demonstration.

## Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo Go app (for testing on physical devices)

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Features to Add (Future Enhancements)

- Favorites/Bookmarks functionality
- Recently watched channels
- Channel ratings and reviews
- Picture-in-Picture mode
- Chromecast support
- Download for offline viewing
- Channel guide with schedules
- Multi-language support

## License

MIT License

## Credits

- Channel data provided by [tv.garden](https://tv.garden)
- Built with [Expo](https://expo.dev)
