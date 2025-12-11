# How to Get Real Stream URLs from tv.garden

tv.garden doesn't provide a public API, so you need to extract the actual stream URLs manually.

## Method 1: Browser Developer Tools (Recommended)

1. **Open tv.garden in Chrome/Firefox**
   - Go to https://tv.garden/cd (for DR Congo channels)

2. **Open Developer Tools**
   - Press F12 or Right-click → Inspect

3. **Go to Network Tab**
   - Click on "Network" tab
   - Filter by: `m3u8` or `video`

4. **Play a Channel**
   - Click on "Compassion TV" (or any channel)
   - Watch the Network tab

5. **Find the Stream URL**
   - Look for requests ending in `.m3u8`
   - Right-click → Copy → Copy URL
   - Example: `https://somecdn.com/live/compassion/playlist.m3u8`

6. **Update the Service File**
   - Replace the placeholder URL in `src/services/tvGardenService.js`
   - Test in your app

## Method 2: Inspect Page Source

1. **Right-click on the video player** → View Page Source
2. **Search for** `.m3u8` or `stream` or `hls`
3. **Copy the full stream URL**

## Method 3: Use IPTV-org Database

If tv.garden streams are protected or require authentication, use free public streams:

```javascript
// Example with IPTV-org streams
const response = await fetch('https://iptv-org.github.io/iptv/countries/cd.m3u');
const m3u = await response.text();
// Parse M3U to get channels
```

## Common Stream URL Patterns

tv.garden likely uses patterns like:
- `https://stream.tv.garden/live/{channel-id}/playlist.m3u8`
- `https://cdn.tv.garden/{country}/{channel}/index.m3u8`
- Or embeds from YouTube Live, Twitch, or other services

## Example: Getting Compassion TV URL

1. Go to: https://tv.garden/cd
2. Click "Compassion TV"
3. Open DevTools → Network
4. Look for something like:
   ```
   https://example.cloudfront.net/compassion/live/playlist.m3u8
   ```
5. Copy that URL
6. Update code:
   ```javascript
   {
     name: 'Compassion TV',
     url: 'https://actual-stream-url.com/compassion/live/playlist.m3u8'
   }
   ```

## Important Notes

- **Streams may be geo-restricted** (only work in certain countries)
- **URLs may expire** (time-limited tokens)
- **Some require authentication** (cookies, headers, API keys)
- **Legal considerations**: Ensure you have rights to redistribute streams

## Alternative: Contact tv.garden

Email tv.garden to ask if they have:
- Public API
- Developer program
- Official way to integrate their streams

## Testing Stream URLs

Test a URL before adding to your app:
```bash
# Using VLC
vlc https://stream-url.m3u8

# Using curl
curl -I https://stream-url.m3u8

# Using ffprobe
ffprobe https://stream-url.m3u8
```

## Current Status

Your app currently has:
- ✅ Working structure for channel data
- ✅ Video player that works with valid URLs
- ❌ Placeholder URLs for Congo channels
- ✅ Test videos as fallback

**Next step**: Extract real stream URLs from tv.garden using the methods above!
