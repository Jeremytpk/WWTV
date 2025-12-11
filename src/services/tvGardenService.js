// Service to interact with tv.garden
import { 
  fetchTvGardenChannels, 
  fetchTvGardenStreamUrl, 
  getCountryCode 
} from './tvGardenScraper';

const IPTV_ORG_URL = 'https://iptv-org.github.io/iptv/index.m3u';

// Fetch channels - try tv.garden first, fallback to mock data
export const fetchChannels = async () => {
  try {
    console.log('Fetching channels from tv.garden...');
    // For now, return mock data
    // Real implementation would scrape tv.garden for all countries
    return getMockChannels();
  } catch (error) {
    console.error('Error fetching channels:', error);
    return getMockChannels();
  }
};

// Fetch channels for a specific country from tv.garden (real backend data)
export const fetchChannelsByCountryFromTvGarden = async (countryName) => {
  try {
    const countryCode = getCountryCode(countryName);
    const channels = await fetchTvGardenChannels(countryCode);
    
    if (channels && channels.length > 0) {
      // Channels already have the correct format from the scraper
      return channels.map(ch => ({
        name: ch.name,
        country: countryName,
        logo: ch.logo,
        category: ch.category || 'General',
        url: ch.url, // Direct stream URL from tv.garden
        language: ch.language,
      }));
    }
    
    return [];
  } catch (error) {
    return [];
  }
};

// Parse M3U playlist format
const parseM3U = (m3uContent) => {
  const lines = m3uContent.split('\n');
  const channels = [];
  let currentChannel = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Extract channel information from EXTINF line
      const info = line.substring(8); // Remove '#EXTINF:'
      const parts = info.split(',');
      const metadata = parts[0];
      const name = parts.slice(1).join(',').trim();
      
      // Try to extract country and other info from metadata
      const countryMatch = metadata.match(/tvg-country="([^"]*)"/);
      const logoMatch = metadata.match(/tvg-logo="([^"]*)"/);
      const categoryMatch = metadata.match(/group-title="([^"]*)"/);
      
      currentChannel = {
        name: name,
        country: countryMatch ? countryMatch[1] : 'Unknown',
        logo: logoMatch ? logoMatch[1] : null,
        category: categoryMatch ? categoryMatch[1] : 'General',
      };
    } else if (line && !line.startsWith('#') && currentChannel) {
      // This line contains the stream URL
      currentChannel.url = line;
      channels.push(currentChannel);
      currentChannel = null;
    }
  }

  return channels;
};

// Filter channels by country
export const getChannelsByCountry = (channels, country) => {
  return channels.filter(channel => 
    channel.country.toLowerCase().includes(country.toLowerCase())
  );
};

// Search channels by name or country
export const searchChannels = (channels, query) => {
  const lowerQuery = query.toLowerCase();
  return channels.filter(channel => 
    channel.name.toLowerCase().includes(lowerQuery) ||
    channel.country.toLowerCase().includes(lowerQuery) ||
    channel.category.toLowerCase().includes(lowerQuery)
  );
};

// Mock data in case tv.garden API is unavailable
export const getMockChannels = () => {
  return [
    // News Channels
    {
      name: 'BBC News',
      country: 'United Kingdom',
      logo: 'https://i.imgur.com/eNZQWLz.png',
      category: 'News',
      url: 'https://d2vnbkvjbims7j.cloudfront.net/containerA/LTN/playlist.m3u8'
    },
    {
      name: 'CNN International',
      country: 'United States',
      logo: 'https://i.imgur.com/ilZJT5s.png',
      category: 'News',
      url: 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8'
    },
    {
      name: 'France 24 English',
      country: 'France',
      logo: 'https://i.imgur.com/EV4NCOP.png',
      category: 'News',
      url: 'https://cdn.klowdtv.net/803B48A/n1.klowdtv.net/live1/france24_720p/playlist.m3u8'
    },
    {
      name: 'Al Jazeera English',
      country: 'Qatar',
      logo: 'https://i.imgur.com/x8BPCR6.png',
      category: 'News',
      url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8'
    },
    {
      name: 'DW English',
      country: 'Germany',
      logo: 'https://i.imgur.com/A1xzjOI.png',
      category: 'News',
      url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8'
    },
    // Entertainment
    {
      name: 'Red Bull TV',
      country: 'Austria',
      logo: 'https://i.imgur.com/7UuBHvP.png',
      category: 'Sports',
      url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8'
    },
    {
      name: 'Bloomberg TV',
      country: 'United States',
      logo: 'https://i.imgur.com/OuogLHx.png',
      category: 'Business',
      url: 'https://bloomberg.com/media-manifest/streams/us.m3u8'
    },
    {
      name: 'Tastemade',
      country: 'United States',
      logo: 'https://i.imgur.com/8s6aRwv.png',
      category: 'Lifestyle',
      url: 'https://tastemade-xumo.amagi.tv/playlist.m3u8'
    },
    // International
    {
      name: 'NHK World Japan',
      country: 'Japan',
      logo: 'https://i.imgur.com/4ESi2La.png',
      category: 'News',
      url: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8'
    },
    {
      name: 'CGTN',
      country: 'China',
      logo: 'https://i.imgur.com/IrVdQ25.png',
      category: 'News',
      url: 'https://live.cgtn.com/1000/prog_index.m3u8'
    },
    {
      name: 'RT News',
      country: 'Russia',
      logo: 'https://i.imgur.com/R5wePRZ.png',
      category: 'News',
      url: 'https://rt-glb.rttv.com/live/rtnews/playlist.m3u8'
    },
    {
      name: 'TRT World',
      country: 'Turkey',
      logo: 'https://i.imgur.com/8w8omD7.png',
      category: 'News',
      url: 'https://tv-trtworld.live.trt.com.tr/master.m3u8'
    },
    // More International
    {
      name: 'Arirang TV',
      country: 'South Korea',
      logo: 'https://i.imgur.com/S8xBRjY.png',
      category: 'General',
      url: 'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8'
    },
    {
      name: 'NDTV 24x7',
      country: 'India',
      logo: 'https://i.imgur.com/VvXbCKk.png',
      category: 'News',
      url: 'https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8'
    },
    {
      name: 'CNA',
      country: 'Singapore',
      logo: 'https://i.imgur.com/UT2JWTl.png',
      category: 'News',
      url: 'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8'
    },
    {
      name: 'Africa News',
      country: 'Congo',
      logo: 'https://i.imgur.com/4MRxMV2.png',
      category: 'News',
      url: 'https://rakuten-africanews-1-eu.rakuten.wurl.tv/playlist.m3u8'
    },
    // Democratic Republic of the Congo Channels
    // Using working demo videos until real tv.garden stream URLs are extracted
    {
      name: 'CCPV TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/CJp6LUz.png',
      category: 'Religious',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      name: 'Compassion TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/9KzJpF6.png',
      category: 'Religious',
      url: 'tvgarden://cd/QOfJ38EhuVvyDe' // Real tv.garden link - will be resolved to stream URL
    },
    {
      name: 'EVI TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/xN3YQRE.png',
      category: 'General',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      name: 'Géopolis TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/7TFhkYE.png',
      category: 'General',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    {
      name: 'La Sentinelle TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/5FhQ7uw.png',
      category: 'Religious',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    {
      name: 'LBFD RTV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/VSi2kNz.png',
      category: 'General',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    },
    {
      name: 'Metanoia TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/8KBHQ7u.png',
      category: 'Religious',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    },
    {
      name: 'Mishapi Voice TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/4BbkJPx.png',
      category: 'Religious',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    {
      name: 'Numerica TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/EfwU4Ro.png',
      category: 'General',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
    },
    {
      name: 'RL PPO TV',
      country: 'Democratic Republic of the Congo',
      logo: 'https://i.imgur.com/FswM3I0.png',
      category: 'Religious',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      name: 'Euronews',
      country: 'France',
      logo: 'https://i.imgur.com/vSTF11t.png',
      category: 'News',
      url: 'https://rakuten-euronews-1-pt.samsung.wurl.tv/playlist.m3u8'
    },
    // Australian
    {
      name: 'ABC Australia',
      country: 'Australia',
      logo: 'https://i.imgur.com/wXqBtKn.png',
      category: 'General',
      url: 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8'
    },
    // Latin American
    {
      name: 'Telesur',
      country: 'Venezuela',
      logo: 'https://i.imgur.com/NNDP0VR.png',
      category: 'News',
      url: 'https://cdnesmain.telesur.ultrabase.net/mbliveMain/hd/playlist.m3u8'
    },
    {
      name: 'Canal Capital',
      country: 'Colombia',
      logo: 'https://i.imgur.com/c7QVHE4.png',
      category: 'General',
      url: 'https://mdstrm.com/live-stream-playlist/57d01d6c28b263eb73b59a5a.m3u8'
    },
  ];
};
