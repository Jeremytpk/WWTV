import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { translateCountry } from '../utils/countryTranslations';

// Country code mapping for tv.garden URLs
const COUNTRY_CODE_MAP = {
  'Democratic Republic of the Congo': 'cd',
  'Congo': 'cg',
  'United States': 'us',
  'United Kingdom': 'gb',
  'France': 'fr',
  'Germany': 'de',
  'Spain': 'es',
  'Italy': 'it',
  'Brazil': 'br',
  'Japan': 'jp',
  'China': 'cn',
  'India': 'in',
  'South Korea': 'kr',
  'Australia': 'au',
  'Canada': 'ca',
  'Mexico': 'mx',
  'Argentina': 'ar',
  'South Africa': 'za',
  'Nigeria': 'ng',
  'Kenya': 'ke',
  'Egypt': 'eg',
  'Algeria': 'dz',
  'Morocco': 'ma',
  'Ghana': 'gh',
  'Ethiopia': 'et',
  'Turkey': 'tr',
  'Saudi Arabia': 'sa',
  'United Arab Emirates': 'ae',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Israel': 'il',
  'Pakistan': 'pk',
  'Bangladesh': 'bd',
  'Indonesia': 'id',
  'Thailand': 'th',
  'Vietnam': 'vn',
  'Philippines': 'ph',
  'Malaysia': 'my',
  'Singapore': 'sg',
  'New Zealand': 'nz',
  'Russia': 'ru',
  'Ukraine': 'ua',
  'Poland': 'pl',
  'Romania': 'ro',
  'Netherlands': 'nl',
  'Belgium': 'be',
  'Greece': 'gr',
  'Portugal': 'pt',
  'Sweden': 'se',
  'Norway': 'no',
  'Denmark': 'dk',
  'Finland': 'fi',
  'Austria': 'at',
  'Switzerland': 'ch',
  'Ireland': 'ie',
  'Czech Republic': 'cz',
  'Hungary': 'hu',
  'Chile': 'cl',
  'Colombia': 'co',
  'Peru': 'pe',
  'Venezuela': 've',
  'Ecuador': 'ec',
  'Bolivia': 'bo',
  'Paraguay': 'py',
  'Uruguay': 'uy',
  'Cuba': 'cu',
  'Dominican Republic': 'do',
  'Jamaica': 'jm',
  'Haiti': 'ht',
  'Trinidad and Tobago': 'tt',
};

const getCountryCode = (countryName) => {
  return COUNTRY_CODE_MAP[countryName] || countryName.toLowerCase().substring(0, 2);
};

export default function CountriesScreen({ route, navigation }) {
  const { continent } = route.params;
  const { language } = useApp();
  const t = translations[language];
  const continentName = language === 'fr' ? continent.nameFr : continent.name;
  const allCountries = continent.countries.sort();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(allCountries);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCountries(allCountries);
    } else {
      const filtered = allCountries.filter(country =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  };

  const renderCountry = ({ item }) => {
    const translatedName = translateCountry(item, language);
    return (
      <TouchableOpacity
        style={styles.countryCard}
        onPress={() => navigation.navigate('Channels', { 
          country: item, 
          continent: continent.name 
        })}
      >
        <Text style={styles.countryName}>{translatedName}</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.emoji}>{continent.emoji}</Text>
        <Text style={styles.title}>{continentName}</Text>
        <Text style={styles.subtitle}>{t.countriesIn} {continentName}</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchCountries}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredCountries}
        renderItem={renderCountry}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
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
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  list: {
    padding: 10,
  },
  countryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 18,
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
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  arrow: {
    fontSize: 18,
    color: '#e94560',
  },
});
