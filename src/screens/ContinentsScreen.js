import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { getContinentsList } from '../data/continents';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';

export default function ContinentsScreen({ navigation }) {
  const continents = getContinentsList();
  const { language, toggleLanguage } = useApp();
  const t = translations[language];

  const renderContinent = ({ item }) => {
    const displayName = language === 'fr' ? item.nameFr : item.name;
    return (
      <TouchableOpacity
        style={styles.continentCard}
        onPress={() => navigation.navigate('Countries', { continent: item })}
      >
        <Text style={styles.continentEmoji}>{item.emoji}</Text>
        <Text style={styles.continentName}>{displayName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>WWTV</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleLanguage}
            >
              <Text style={styles.iconText}>
                {language === 'en' ? '🇬🇧' : '🇫🇷'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>{t.selectContinent}</Text>
      </View>
      <FlatList
        data={continents}
        renderItem={renderContinent}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.searchButtonText}>{t.searchAllChannels}</Text>
      </TouchableOpacity>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    letterSpacing: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  list: {
    padding: 10,
  },
  continentCard: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#16213e',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continentEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  continentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  searchButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#e94560',
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
