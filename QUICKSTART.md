# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Expo Go
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: Download from [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Scan QR Code
Look at your terminal and scan the QR code:
- **iOS**: Use Camera app
- **Android**: Use Expo Go app

### Step 3: Explore!
1. Select a continent (e.g., Europe 🇪🇺)
2. Choose a country (e.g., United Kingdom)
3. Pick a channel (e.g., BBC News)
4. Watch! 📺

## 💻 Development Commands

```bash
# Start the app
npm start

# Start with cache cleared
npm start -- --clear

# Run on specific platform
npm run ios
npm run android
npm run web

# Install new package
npm install package-name
```

## 🎮 Keyboard Shortcuts

While running `npm start`:
- `a` - Open on Android
- `i` - Open on iOS Simulator
- `w` - Open on web browser
- `r` - Reload app
- `m` - Toggle menu
- `j` - Open debugger
- `?` - Show all commands

## 📱 Using the App

### Browse by Location
```
Home → Continent → Country → Channel → Watch
```

### Search for Channels
```
Home → Search Button → Type name/country → Select → Watch
```

### Video Controls
- Tap video to show/hide controls
- Play/Pause button (⏸/▶)
- Fullscreen button (⛶)
- Back button to exit

### Fullscreen Mode
1. Tap fullscreen button in player
2. Device rotates to landscape
3. Video fills entire screen
4. Tap to show controls
5. Exit fullscreen or go back to return

## 🔧 Troubleshooting Quick Fixes

### App won't load?
```bash
npm start -- --clear
```

### Can't see QR code?
```bash
npm start -- --tunnel
```

### Weird errors?
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### Module not found?
```bash
npm install
```

## 📊 Testing Checklist

- [ ] App launches successfully
- [ ] Can navigate through continents
- [ ] Can select a country
- [ ] Channels load for a country
- [ ] Search works
- [ ] Can play a video
- [ ] Video controls work
- [ ] Fullscreen works
- [ ] Orientation changes work
- [ ] Back navigation works

## 🎨 First Customizations

### Change App Name
Edit `app.json`:
```json
"name": "Your App Name"
```

### Change Colors
Edit screen files, replace:
- `#1a1a2e` - Background
- `#16213e` - Cards
- `#e94560` - Accent

### Add More Channels
Edit `src/services/tvGardenService.js`
Add to `getMockChannels()` array

## 📁 Key Files

| File | Purpose |
|------|---------|
| `App.js` | Main app & navigation |
| `app.json` | App configuration |
| `src/screens/*.js` | All screen components |
| `src/services/tvGardenService.js` | Channel data |
| `src/data/continents.js` | Location data |

## 🆘 Need Help?

1. Check `TROUBLESHOOTING.md`
2. Review `CUSTOMIZATION.md`
3. Read `PROJECT_SUMMARY.md`
4. Check console logs
5. Search [Expo Forums](https://forums.expo.dev)

## 🎯 What to Do Next

### For Testing:
1. Try all navigation paths
2. Test search functionality
3. Play different channels
4. Test fullscreen mode
5. Try on different devices

### For Development:
1. Add your custom channels
2. Customize colors
3. Add new features
4. Test with real tv.garden API

### For Production:
1. Create app icons
2. Test thoroughly
3. Build for stores
4. Submit for review

## 🌟 Pro Tips

- Use mock data during development
- Test on physical device for best results
- Keep Expo Go updated
- Check console for debugging
- Use hot reload for fast development
- Test orientation on real device

## 📞 Quick Links

- [Expo Docs](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [tv.garden](https://tv.garden)

---

**You're all set! Enjoy building your TV app! 📺🚀**
