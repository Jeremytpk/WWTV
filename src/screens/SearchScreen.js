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
import { fetchChannels, searchChannels, getMockChannels } from '../services/tvGardenService';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { translateCountry } from '../utils/countryTranslations';

export default function SearchScreen({ navigation }) {
  const { language } = useApp();
  const t = translations[language];
  const [allChannels, setAllChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllChannels();
  }, []);

  const loadAllChannels = async () => {
    setLoading(true);
    try {
      let channels = await fetchChannels();
      
      if (!channels || channels.length === 0) {
        channels = getMockChannels();
      }
      
      setAllChannels(channels);
      setFilteredChannels([]);
    } catch (error) {
      console.error('Error loading channels:', error);
      const mockChannels = getMockChannels();
      setAllChannels(mockChannels);
      setFilteredChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChannels([]);
    } else {
      const results = searchChannels(allChannels, query);
      setFilteredChannels(results);
    }
  };

  const renderChannel = ({ item }) => {
    const translatedCountry = translateCountry(item.country, language);
    return (
      <TouchableOpacity
        style={styles.channelCard}
        onPress={() => navigation.navigate('Player', { channel: item })}
      >
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>📺</Text>
        </View>
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>{item.name}</Text>
          <Text style={styles.channelCountry}>🌍 {translatedCountry}</Text>
          <Text style={styles.channelCategory}>{item.category}</Text>
        </View>
        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>{t.loading}</Text>
        <Text style={styles.loadingText}>Loading channels...</Text>
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
        <Text style={styles.title}>{t.searchChannelsGlobal}</Text>
        <Text style={styles.subtitle}>{language === 'en' ? 'Find channels by name or country' : 'Trouvez des chaînes par nom ou pays'}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchPlaceholder}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {searchQuery === '' ? (
        <View style={styles.centered}>
          <Text style={styles.instructionIcon}>🔍</Text>
          <Text style={styles.instructionText}>
            Start typing to search for channels
          </Text>
          <Text style={styles.instructionSubtext}>
            Search by channel name, country, or category
          </Text>
        </View>
      ) : filteredChannels.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noResultsText}>
            No channels found for "{searchQuery}"
          </Text>
          <Text style={styles.noResultsSubtext}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultsCount}>
            Found {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''}
          </Text>
          <FlatList
            data={filteredChannels}
            renderItem={renderChannel}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            contentContainerStyle={styles.list}
          />
        </>
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
    flex: 1,
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
  subtitle: {
    fontSize: 14,
    color: '#aaa',
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
  resultsCount: {
    color: '#aaa',
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
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
  channelCountry: {
    fontSize: 13,
    color: '#e94560',
    marginBottom: 2,
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
  instructionIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  instructionSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  noResultsSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
