# Build & Deployment Guide - WWTV

## Overview
This guide covers building iOS (production) and Android (preview) apps with OTA (Over-The-Air) updates enabled.

## Prerequisites

1. **EAS CLI** - Already installed globally
2. **Expo Account** - Logged in as `jeremytpk`
3. **Project ID** - `a0aee6c0-3ca6-4224-b766-a6c0817b92a8`

## Build Configuration

### eas.json Profiles

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "channel": "development"
  },
  "preview": {
    "distribution": "internal",
    "channel": "preview",
    "android": { "buildType": "apk" },
    "ios": { "simulator": false }
  },
  "production": {
    "autoIncrement": true,
    "channel": "production",
    "android": { "buildType": "app-bundle" },
    "ios": { "buildConfiguration": "Release" }
  }
}
```

### OTA Updates Configuration

**app.json** includes:
- `runtimeVersion: { policy: "appVersion" }` - Ensures compatibility
- `updates.url` - Expo's update server
- `updates.checkAutomatically: "ON_LOAD"` - Checks on app launch
- `updates.enabled: true` - OTA enabled

**App.js** includes:
- Automatic update check on app start
- User prompt to restart when update is downloaded
- Silent error handling in production

## Building the Apps

### 1. iOS Production Build

```bash
cd /Users/tpk/Documents/Jerttech/wwtv

# Build for iOS production (App Store)
eas build --platform ios --profile production

# Wait for build to complete (~15-30 minutes)
# You'll get a download link for the .ipa file
```

**What you get:**
- `.ipa` file ready for App Store submission
- Automatic version increment
- OTA updates enabled on production channel

### 2. Android Preview Build

```bash
# Build for Android preview (APK for testing)
eas build --platform android --profile preview

# Wait for build to complete (~10-20 minutes)
# You'll get a download link for the .apk file
```

**What you get:**
- `.apk` file for direct installation/testing
- Internal distribution (not for Play Store)
- OTA updates enabled on preview channel

### 3. Build Both Platforms

```bash
# Build both iOS and Android simultaneously
eas build --platform all --profile production
```

## OTA Updates - Quick Updates Without Rebuilding

### Publishing Updates

After making code changes (UI updates, bug fixes, new features):

```bash
# Publish to production channel (iOS production builds)
eas update --channel production --message "Fixed login bug"

# Publish to preview channel (Android preview builds)
eas update --channel preview --message "Added new feature"

# Publish to both channels
eas update --channel production,preview --message "Important fix"
```

### What Gets Updated via OTA
✅ **CAN be updated:**
- JavaScript code changes
- UI/layout changes
- Navigation updates
- Bug fixes
- New features (JS-only)
- Translations
- Configuration changes

❌ **CANNOT be updated (requires new build):**
- Native dependencies
- app.json changes (name, icon, permissions)
- New native modules
- SDK version upgrades

### Update Flow
1. User opens app
2. App checks for updates (automatic)
3. If available, downloads in background
4. Alert prompts user to restart
5. User taps "Restart" → app reloads with new version

## Version Management

### Semantic Versioning
Current: `1.0.0`

```json
"version": "1.0.0"  // in app.json
```

**When to increment:**
- **Major (2.0.0)**: Breaking changes, complete redesign
- **Minor (1.1.0)**: New features, significant updates
- **Patch (1.0.1)**: Bug fixes, small improvements

### Auto-increment
Production builds automatically increment build numbers via `"autoIncrement": true`

## Submission to App Stores

### iOS - App Store

```bash
# After production build completes
eas submit --platform ios --profile production

# Follow prompts:
# - Select the build
# - Enter Apple ID credentials
# - Configure app metadata
```

Requirements:
- Apple Developer Account ($99/year)
- App Store Connect app created
- Bundle ID: `com.jeremytpk.wwtv`

### Android - Google Play Store

```bash
# Build production Android (AAB)
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production

# Follow prompts:
# - Select the build
# - Upload service account key
# - Choose release track (internal/beta/production)
```

Requirements:
- Google Play Developer Account ($25 one-time)
- Play Console app created
- Package name: `com.jeremytpk.wwtv`

## Testing Builds

### iOS (TestFlight)

1. Build with production profile
2. Submit to App Store Connect
3. Automatically creates TestFlight build
4. Add testers via email
5. They install via TestFlight app

### Android (Internal Testing)

1. Download APK from EAS build
2. Share link or file with testers
3. Enable "Install from Unknown Sources"
4. Install APK directly

Or use Google Play Internal Testing:
1. Build with production profile (AAB)
2. Upload to Play Console
3. Add to internal testing track
4. Testers download from Play Store

## Monitoring & Rollback

### View Update Activity

```bash
# List all updates
eas update:list --channel production

# View specific update details
eas update:view [UPDATE_ID]
```

### Rollback Updates

```bash
# Republish previous update
eas update:republish --channel production --group [GROUP_ID]

# Delete broken update
eas update:delete [UPDATE_ID]
```

### Build History

```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

## Channels & Branches

### Current Setup
- **production**: iOS production builds, Play Store builds
- **preview**: Android preview APKs, internal testing
- **development**: Development builds with dev client

### Publishing Strategy

```bash
# Development testing
eas update --branch development --message "Testing new feature"

# Preview/staging
eas update --branch preview --message "Ready for QA"

# Production release
eas update --branch production --message "v1.1.0 release"
```

## Troubleshooting

### Build Failed
- Check eas.json syntax
- Verify all dependencies installed
- Review build logs: `eas build:view [BUILD_ID]`

### Update Not Applying
- Check runtime version compatibility
- Verify channel matches build profile
- Force close and reopen app
- Check network connection

### Native Changes Not Working
- Native changes require new build (not OTA)
- Run new build: `eas build --platform [ios/android] --profile production`

## Quick Commands Reference

```bash
# Login
eas login

# Check account
eas whoami

# Build iOS production
eas build --platform ios --profile production

# Build Android preview
eas build --platform android --profile preview

# Publish OTA update
eas update --channel production --message "Bug fixes"

# List builds
eas build:list

# List updates
eas update:list

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Cost Considerations

### Free Tier (Current)
- Unlimited OTA updates
- Shared build queue (slower)
- 30 builds/month

### Paid Plans
- Priority build queue
- More concurrent builds
- Larger build minutes
- Team collaboration

## Next Steps

1. **Run iOS Production Build**: `eas build --platform ios --profile production`
2. **Run Android Preview Build**: `eas build --platform android --profile preview`
3. **Test OTA Updates**: Make a small change, publish update, verify it applies
4. **Submit to Stores**: Follow submission process for App Store & Play Store

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
