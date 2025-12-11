// Service to fetch real stream URLs from tv.garden
const TV_GARDEN_BASE = 'https://tv.garden';

// TV Garden uses GitHub as their backend - using 'raw' folder instead of 'compressed'
const TV_GARDEN_GITHUB_BASE = 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries';

// Get URL with CORS proxy - React Native doesn't need CORS proxy
const getCorsProxiedUrl = (url) => {
  // React Native doesn't have CORS restrictions
  return url;
};

// Fetch JSON data from GitHub
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Fetch the actual stream URL for a channel from tv.garden
export const fetchTvGardenStreamUrl = async (countryCode, channelId) => {
  try {
    const url = `${TV_GARDEN_BASE}/${countryCode}/${channelId}`;
    const html = await fetchWithProxyRetry(url);
    const streamUrl = extractStreamUrl(html);
    return streamUrl;
  } catch (error) {
    return null;
  }
};

// Extract stream URL from tv.garden HTML
const extractStreamUrl = (html) => {
  try {
    // Look for common patterns in tv.garden's HTML
    
    // Pattern 1: Look for .m3u8 URLs (HLS streams) - most common for live TV
    const m3u8Match = html.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
    if (m3u8Match) {
      return m3u8Match[1];
    }
    
    // Pattern 2: Look for .ts URLs (MPEG-TS streams)
    const tsMatch = html.match(/(https?:\/\/[^\s"'<>]+\.ts[^\s"'<>]*)/i);
    if (tsMatch) {
      return tsMatch[1];
    }
    
    // Pattern 3: Look for video.js or similar player configurations
    const vjsMatch = html.match(/sources?:\s*\[?\s*{[^}]*src:\s*["']([^"']+)["']/i);
    if (vjsMatch) {
      return vjsMatch[1];
    }
    
    // Pattern 4: Look for YouTube embeds
    const youtubeMatch = html.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
    }
    
    // Pattern 5: Look for iframe sources
    const iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["']/i);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    
    // Pattern 6: Look for video source tags
    const videoMatch = html.match(/<video[^>]*src=["']([^"']+)["']/i);
    if (videoMatch) {
      return videoMatch[1];
    }
    
    // Pattern 7: Look for source tags inside video
    const sourceMatch = html.match(/<source[^>]*src=["']([^"']+)["']/i);
    if (sourceMatch) {
      return sourceMatch[1];
    }
    
    // Pattern 8: Look for data-* attributes
    const dataMatch = html.match(/data-(?:src|stream|url|video)=["']([^"']+)["']/i);
    if (dataMatch) {
      return dataMatch[1];
    }
    
    // Pattern 9: Look for JavaScript variables
    const jsMatch = html.match(/(?:streamUrl|videoUrl|src|url)\s*[=:]\s*["']([^"']+\.(?:m3u8|mp4|ts))["']/i);
    if (jsMatch) {
      return jsMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting stream URL:', error);
    return null;
  }
};

// Fetch all channels for a country from tv.garden GitHub backend
export const fetchTvGardenChannels = async (countryCode) => {
  try {
    // TV Garden stores channel data in GitHub as JSON - format is cd.json, us.json, etc.
    const url = `${TV_GARDEN_GITHUB_BASE}/${countryCode.toLowerCase()}.json`;
    
    const data = await fetchJSON(url);
    
    // Transform the data to our format
    // TV Garden data structure: { nanoid, name, iptv_urls[], youtube_urls[], language, country }
    const channels = data.map(channel => {
      // Get the first working URL (prefer iptv_urls, fallback to youtube_urls)
      let streamUrl = null;
      if (channel.iptv_urls && channel.iptv_urls.length > 0) {
        streamUrl = channel.iptv_urls[0];
      } else if (channel.youtube_urls && channel.youtube_urls.length > 0) {
        streamUrl = channel.youtube_urls[0];
      }
      
      return {
        name: channel.name || 'Unknown Channel',
        country: countryCode.toUpperCase(),
        logo: channel.logo || null,
        category: channel.category || 'General',
        url: streamUrl,
        language: channel.language || null,
        isGeoBlocked: channel.isGeoBlocked || false,
      };
    });
    
    return channels;
  } catch (error) {
    return [];
  }
};

// Fetch all available countries from tv.garden
export const fetchAvailableCountries = async () => {
  try {
    // TV Garden has a metadata file listing all countries
    const url = 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/compressed/countries_metadata.json';
    const data = await fetchJSON(url);
    const countries = Object.keys(data);
    return countries;
  } catch (error) {
    // Return common countries if fetch fails
    return ['cd', 'us', 'gb', 'fr', 'de', 'es', 'it', 'br', 'mx', 'ca'];
  }
};

// Country code mapping (ISO 3166-1 alpha-2 codes)
export const COUNTRY_CODE_MAP = {
  // Africa
  'Algeria': 'dz', 'Angola': 'ao', 'Benin': 'bj', 'Botswana': 'bw', 'Burkina Faso': 'bf',
  'Burundi': 'bi', 'Cameroon': 'cm', 'Cape Verde': 'cv', 'Central African Republic': 'cf',
  'Chad': 'td', 'Comoros': 'km', 'Congo': 'cg', 'Democratic Republic of the Congo': 'cd',
  'Djibouti': 'dj', 'Egypt': 'eg', 'Equatorial Guinea': 'gq', 'Eritrea': 'er',
  'Ethiopia': 'et', 'Gabon': 'ga', 'Gambia': 'gm', 'Ghana': 'gh', 'Guinea': 'gn',
  'Guinea-Bissau': 'gw', 'Ivory Coast': 'ci', 'Kenya': 'ke', 'Lesotho': 'ls',
  'Liberia': 'lr', 'Libya': 'ly', 'Madagascar': 'mg', 'Malawi': 'mw', 'Mali': 'ml',
  'Mauritania': 'mr', 'Mauritius': 'mu', 'Morocco': 'ma', 'Mozambique': 'mz',
  'Namibia': 'na', 'Niger': 'ne', 'Nigeria': 'ng', 'Rwanda': 'rw',
  'Sao Tome and Principe': 'st', 'Senegal': 'sn', 'Seychelles': 'sc', 'Sierra Leone': 'sl',
  'Somalia': 'so', 'South Africa': 'za', 'South Sudan': 'ss', 'Sudan': 'sd',
  'Swaziland': 'sz', 'Tanzania': 'tz', 'Togo': 'tg', 'Tunisia': 'tn', 'Uganda': 'ug',
  'Zambia': 'zm', 'Zimbabwe': 'zw',
  
  // Asia
  'Afghanistan': 'af', 'Armenia': 'am', 'Azerbaijan': 'az', 'Bahrain': 'bh',
  'Bangladesh': 'bd', 'Bhutan': 'bt', 'Brunei': 'bn', 'Cambodia': 'kh', 'China': 'cn',
  'Georgia': 'ge', 'Hong Kong': 'hk', 'India': 'in', 'Indonesia': 'id', 'Iran': 'ir',
  'Iraq': 'iq', 'Israel': 'il', 'Japan': 'jp', 'Jordan': 'jo', 'Kazakhstan': 'kz',
  'Kuwait': 'kw', 'Kyrgyzstan': 'kg', 'Laos': 'la', 'Lebanon': 'lb', 'Macau': 'mo',
  'Malaysia': 'my', 'Maldives': 'mv', 'Mongolia': 'mn', 'Myanmar': 'mm', 'Nepal': 'np',
  'North Korea': 'kp', 'Oman': 'om', 'Pakistan': 'pk', 'Palestine': 'ps',
  'Philippines': 'ph', 'Qatar': 'qa', 'Saudi Arabia': 'sa', 'Singapore': 'sg',
  'South Korea': 'kr', 'Sri Lanka': 'lk', 'Syria': 'sy', 'Taiwan': 'tw',
  'Tajikistan': 'tj', 'Thailand': 'th', 'Timor-Leste': 'tl', 'Turkey': 'tr',
  'Turkmenistan': 'tm', 'United Arab Emirates': 'ae', 'Uzbekistan': 'uz',
  'Vietnam': 'vn', 'Yemen': 'ye',
  
  // Europe
  'Albania': 'al', 'Andorra': 'ad', 'Austria': 'at', 'Belarus': 'by', 'Belgium': 'be',
  'Bosnia and Herzegovina': 'ba', 'Bulgaria': 'bg', 'Croatia': 'hr', 'Cyprus': 'cy',
  'Czech Republic': 'cz', 'Denmark': 'dk', 'Estonia': 'ee', 'Finland': 'fi',
  'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hungary': 'hu', 'Iceland': 'is',
  'Ireland': 'ie', 'Italy': 'it', 'Kosovo': 'xk', 'Latvia': 'lv', 'Liechtenstein': 'li',
  'Lithuania': 'lt', 'Luxembourg': 'lu', 'Macedonia': 'mk', 'Malta': 'mt',
  'Moldova': 'md', 'Monaco': 'mc', 'Montenegro': 'me', 'Netherlands': 'nl',
  'Norway': 'no', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro', 'Russia': 'ru',
  'San Marino': 'sm', 'Serbia': 'rs', 'Slovakia': 'sk', 'Slovenia': 'si',
  'Spain': 'es', 'Sweden': 'se', 'Switzerland': 'ch', 'Ukraine': 'ua',
  'United Kingdom': 'gb', 'Vatican City': 'va',
  
  // North America
  'Antigua and Barbuda': 'ag', 'Bahamas': 'bs', 'Barbados': 'bb', 'Belize': 'bz',
  'Canada': 'ca', 'Costa Rica': 'cr', 'Cuba': 'cu', 'Dominica': 'dm',
  'Dominican Republic': 'do', 'El Salvador': 'sv', 'Grenada': 'gd', 'Guatemala': 'gt',
  'Haiti': 'ht', 'Honduras': 'hn', 'Jamaica': 'jm', 'Mexico': 'mx', 'Nicaragua': 'ni',
  'Panama': 'pa', 'Saint Kitts and Nevis': 'kn', 'Saint Lucia': 'lc',
  'Saint Vincent and the Grenadines': 'vc', 'Trinidad and Tobago': 'tt',
  'United States': 'us',
  
  // South America
  'Argentina': 'ar', 'Bolivia': 'bo', 'Brazil': 'br', 'Chile': 'cl', 'Colombia': 'co',
  'Ecuador': 'ec', 'Guyana': 'gy', 'Paraguay': 'py', 'Peru': 'pe', 'Suriname': 'sr',
  'Uruguay': 'uy', 'Venezuela': 've',
  
  // Oceania
  'Australia': 'au', 'Fiji': 'fj', 'Kiribati': 'ki', 'Marshall Islands': 'mh',
  'Micronesia': 'fm', 'Nauru': 'nr', 'New Zealand': 'nz', 'Palau': 'pw',
  'Papua New Guinea': 'pg', 'Samoa': 'ws', 'Solomon Islands': 'sb', 'Tonga': 'to',
  'Tuvalu': 'tv', 'Vanuatu': 'vu',
};

// Get country code from country name
export const getCountryCode = (countryName) => {
  return COUNTRY_CODE_MAP[countryName] || countryName.toLowerCase().substring(0, 2);
};
