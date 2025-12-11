# Troubleshooting Guide

## Common Issues and Solutions

### 1. Video Not Playing

**Problem**: Channel stream doesn't load or shows an error

**Solutions**:
- Check your internet connection
- The stream URL from tv.garden may be temporarily unavailable
- Try a different channel
- Some streams may require specific codecs not supported on all devices
- Use the retry button in the player

### 2. Screen Orientation Issues

**Problem**: Fullscreen doesn't rotate the device

**Solutions**:
- Ensure screen rotation is enabled on your device
- On iOS: Swipe down from top-right, check rotation lock icon
- On Android: Swipe down from top, check auto-rotate setting
- Some devices may have orientation restrictions

### 3. Channels Not Loading

**Problem**: Channel list is empty or not loading

**Solutions**:
- Check if tv.garden service is accessible
- The app will fall back to mock data if tv.garden is unavailable
- Check your internet connection
- Try pulling down to refresh (if implemented)

### 4. Navigation Issues

**Problem**: Can't go back or navigation is stuck

**Solutions**:
- Use the device's back button (Android)
- Use the back button in the app header
- Force close and restart the app

### 5. App Crashes on Startup

**Problem**: App closes immediately after opening

**Solutions**:
```bash
# Clear cache and restart
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Check for any native module issues
npx expo-doctor
```

### 6. Expo Go Issues

**Problem**: App won't load in Expo Go

**Solutions**:
- Ensure Expo Go app is up to date
- Check that both devices are on the same WiFi network
- Try scanning the QR code again
- Restart the Metro bundler: `npx expo start -c`

### 7. Video Player Black Screen

**Problem**: Video area is black but controls work

**Solutions**:
- The stream format may not be supported
- Try a different channel
- Check if the stream URL is valid
- Some m3u8 streams require specific configurations

### 8. Performance Issues

**Problem**: App is slow or laggy

**Solutions**:
- Close other apps to free up memory
- Restart the app
- On older devices, video quality may impact performance
- Ensure you have a stable internet connection

## Development Issues

### Metro Bundler Port Already in Use

```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill -9

# Or start on a different port
npx expo start --port 8082
```

### Module Not Found Errors

```bash
# Clear watchman watches
watchman watch-del-all

# Clear Metro bundler cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### iOS Simulator Not Opening

```bash
# List available simulators
xcrun simctl list devices

# Open iOS simulator manually
open -a Simulator
```

### Android Emulator Issues

```bash
# List available emulators
emulator -list-avds

# Start a specific emulator
emulator -avd <emulator_name>
```

## Getting Help

If you continue experiencing issues:

1. Check the [Expo documentation](https://docs.expo.dev)
2. Search [Expo forums](https://forums.expo.dev)
3. Check tv.garden status
4. Review the console logs for specific error messages
5. Try with the mock data first to isolate issues

## Reporting Bugs

When reporting issues, please include:
- Device type and OS version
- Expo SDK version
- Steps to reproduce the issue
- Error messages from console
- Screenshots if applicable
