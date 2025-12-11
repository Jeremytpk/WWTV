# WWTV - World Wide TV Streaming App

## Features Added

### 1. **Bilingual Support (English/French)**
- Language toggle icon in the header (🇬🇧/🇫🇷)
- Entire app switches language when toggled
- All screens translated

### 2. **Settings Screen**
- Access via settings icon (⚙️) in the header
- Language selection with visual toggle
- Premium subscription management

### 3. **Premium Features**
- Free users: Limited to 5 channels per country
- Premium users: Access to all channels
- Upgrade prompt shown to free users
- Premium badge displayed for subscribed users

### 4. **Logo**
Currently displaying "WWTV" as styled text. To add the actual logo image:

1. Save your logo image as `logo.png` in the `/assets` folder
2. Update `ContinentsScreen.js` to use the image:

```javascript
// Replace this:
<View style={styles.logoContainer}>
  <Text style={styles.logoText}>WWTV</Text>
</View>

// With this:
<Image 
  source={require('../../assets/logo.png')}
  style={styles.logo}
  resizeMode="contain"
/>

// And update styles:
logo: {
  width: 150,
  height: 40,
},
```

## How It Works

### Language System
- Managed by `AppContext` (src/context/AppContext.js)
- All translations stored in `src/utils/translations.js`
- Each screen uses `const { language } = useApp()` and `const t = translations[language]`

### Premium System
- State managed in `AppContext` 
- `isPremium` flag controls channel access
- ChannelsScreen filters channels based on premium status
- Settings screen allows upgrade (currently instant, can be integrated with payment system)

### Header Icons
- **Language Icon**: Shows 🇬🇧 or 🇫🇷, toggles on press
- **Settings Icon**: ⚙️, navigates to settings screen

## Translation Keys

Available in `src/utils/translations.js`:
- `worldTV`, `selectContinent`, `searchAllChannels`
- `countriesIn`, `searchCountries`
- `channelsIn`, `channelsAvailable`, `searchChannels`
- `settings`, `language`, `english`, `french`
- `subscription`, `upgradePremium`, `premiumActive`
- `back`, `loading`, `noChannels`

## Testing

1. **Language Toggle**: Tap the flag icon to switch between English and French
2. **Settings**: Tap the ⚙️ icon to open settings
3. **Premium Upgrade**: In settings, tap "Upgrade Now" to activate premium
4. **Channel Limit**: As free user, notice only 5 channels shown. After upgrade, all channels visible.

## Next Steps

1. Add your actual logo image
2. Integrate real payment system for premium upgrades
3. Add more languages if needed
4. Persist premium status to storage
