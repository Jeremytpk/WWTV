import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { fetchChannels, getChannelsByCountry, getMockChannels } from '../services/tvGardenService';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { translateCountry } from '../utils/countryTranslations';

// Country timezone mapping
const COUNTRY_TIMEZONES = {
  'Democratic Republic of the Congo': 'Africa/Kinshasa',
  'United States': 'America/New_York',
  'United Kingdom': 'Europe/London',
  'France': 'Europe/Paris',
  'Germany': 'Europe/Berlin',
  'Spain': 'Europe/Madrid',
  'Italy': 'Europe/Rome',
  'Brazil': 'America/Sao_Paulo',
  'Japan': 'Asia/Tokyo',
  'China': 'Asia/Shanghai',
  'India': 'Asia/Kolkata',
  'South Korea': 'Asia/Seoul',
  'Australia': 'Australia/Sydney',
  'Canada': 'America/Toronto',
  'Mexico': 'America/Mexico_City',
  'Argentina': 'America/Argentina/Buenos_Aires',
  'South Africa': 'Africa/Johannesburg',
  'Nigeria': 'Africa/Lagos',
  'Kenya': 'Africa/Nairobi',
  'Egypt': 'Africa/Cairo',
  'Algeria': 'Africa/Algiers',
  'Morocco': 'Africa/Casablanca',
  'Ghana': 'Africa/Accra',
  'Ethiopia': 'Africa/Addis_Ababa',
  'Turkey': 'Europe/Istanbul',
  'Saudi Arabia': 'Asia/Riyadh',
  'United Arab Emirates': 'Asia/Dubai',
  'Iran': 'Asia/Tehran',
  'Iraq': 'Asia/Baghdad',
  'Israel': 'Asia/Jerusalem',
  'Pakistan': 'Asia/Karachi',
  'Bangladesh': 'Asia/Dhaka',
  'Indonesia': 'Asia/Jakarta',
  'Thailand': 'Asia/Bangkok',
  'Vietnam': 'Asia/Ho_Chi_Minh',
  'Philippines': 'Asia/Manila',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Singapore': 'Asia/Singapore',
  'New Zealand': 'Pacific/Auckland',
  'Russia': 'Europe/Moscow',
  'Ukraine': 'Europe/Kiev',
  'Poland': 'Europe/Warsaw',
  'Romania': 'Europe/Bucharest',
  'Netherlands': 'Europe/Amsterdam',
  'Belgium': 'Europe/Brussels',
  'Greece': 'Europe/Athens',
  'Portugal': 'Europe/Lisbon',
  'Sweden': 'Europe/Stockholm',
  'Norway': 'Europe/Oslo',
  'Denmark': 'Europe/Copenhagen',
  'Finland': 'Europe/Helsinki',
  'Austria': 'Europe/Vienna',
  'Switzerland': 'Europe/Zurich',
  'Ireland': 'Europe/Dublin',
  'Czech Republic': 'Europe/Prague',
  'Hungary': 'Europe/Budapest',
  'Chile': 'America/Santiago',
  'Colombia': 'America/Bogota',
  'Peru': 'America/Lima',
  'Venezuela': 'America/Caracas',
  'Ecuador': 'America/Guayaquil',
  'Bolivia': 'America/La_Paz',
  'Paraguay': 'America/Asuncion',
  'Uruguay': 'America/Montevideo',
  'Cuba': 'America/Havana',
  'Dominican Republic': 'America/Santo_Domingo',
  'Jamaica': 'America/Jamaica',
  'Haiti': 'America/Port-au-Prince',
  'Trinidad and Tobago': 'America/Port_of_Spain',
};

export default function ChannelsScreen({ route, navigation }) {
  const { country, continent } = route.params;
  const { language, isPremium } = useApp();
  const t = translations[language];
  const translatedCountry = translateCountry(country, language);
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    loadChannels();
  }, [country]);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const timezone = COUNTRY_TIMEZONES[country] || 'UTC';
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [country]);

  const loadChannels = async () => {
    setLoading(true);
    try {
      // Fetch real channels from tv.garden backend
      const { fetchChannelsByCountryFromTvGarden } = require('../services/tvGardenService');
      let countryChannels = await fetchChannelsByCountryFromTvGarden(country);
      
      // Filter channels based on premium status
      if (!isPremium && countryChannels.length > 5) {
        countryChannels = countryChannels.slice(0, 5);
      }
      
      setChannels(countryChannels);
      setFilteredChannels(countryChannels);
    } catch (error) {
      setChannels([]);
      setFilteredChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChannels(channels);
    } else {
      const filtered = channels.filter(channel =>
        channel.name.toLowerCase().includes(query.toLowerCase()) ||
        channel.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChannels(filtered);
    }
  };

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      style={styles.channelCard}
      onPress={() => navigation.navigate('Player', { channel: item })}
    >
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>📺</Text>
      </View>
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>{item.name}</Text>
        <Text style={styles.channelCategory}>{item.category}</Text>
      </View>
      <Text style={styles.playIcon}>▶</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{translatedCountry}</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>{continent}</Text>
          {currentTime && (
            <>
              <Text style={styles.subtitleDivider}> • </Text>
              <Text style={styles.localTime}>🕐 {currentTime}</Text>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchChannels}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {!loading && filteredChannels.length > 0 && (
        <View style={styles.channelCountContainer}>
          <Text style={styles.channelCount}>
            {filteredChannels.length} {t.channelsAvailable}
          </Text>
          {!isPremium && channels.length > 5 && (
            <Text style={styles.premiumNote}>
              {language === 'en' ? '🔒 Upgrade to Premium for more channels' : '🔒 Passez à Premium pour plus de chaînes'}
            </Text>
          )}
        </View>
      )}

      {filteredChannels.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noChannelsText}>
            {t.noChannels}
          </Text>
          <Text style={styles.noChannelsSubtext}>
            Try another country or use the search feature
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChannels}
          renderItem={renderChannel}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  subtitleDivider: {
    fontSize: 14,
    color: '#aaa',
  },
  localTime: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: '600',
  },
  premiumNote: {
    fontSize: 12,
    color: '#ffa500',
    marginTop: 5,
    fontStyle: 'italic',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  channelCountContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  channelCount: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 15,
    backgroundColor: '#16213e',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0f3460',
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  channelInfo: {
    flex: 1,
    marginLeft: 15,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  channelCategory: {
    fontSize: 12,
    color: '#aaa',
  },
  playIcon: {
    fontSize: 24,
    color: '#e94560',
  },
  loadingText: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
  noChannelsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  noChannelsSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
