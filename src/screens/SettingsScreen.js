import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';

export default function SettingsScreen({ navigation }) {
  const { language, toggleLanguage, isPremium, upgradeToPremium } = useApp();
  const t = translations[language];

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
        <Text style={styles.title}>{t.settings}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => language !== 'en' && toggleLanguage()}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}>
                🇬🇧 {t.english}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'fr' && styles.languageButtonActive,
              ]}
              onPress={() => language !== 'fr' && toggleLanguage()}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'fr' && styles.languageButtonTextActive,
              ]}>
                🇫🇷 {t.french}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.subscription}</Text>
          
          {isPremium ? (
            <View style={styles.premiumCard}>
              <Text style={styles.premiumTitle}>{t.premiumActive}</Text>
              <Text style={styles.premiumText}>{t.premiumBenefits}</Text>
              <Text style={styles.premiumBenefit}>{t.benefit1}</Text>
              <Text style={styles.premiumBenefit}>{t.benefit2}</Text>
              <Text style={styles.premiumBenefit}>{t.benefit3}</Text>
              <Text style={styles.premiumBenefit}>{t.benefit4}</Text>
            </View>
          ) : (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>{t.currentPlan}</Text>
              <Text style={styles.upgradeText}>{t.premiumBenefits}</Text>
              <Text style={styles.upgradeBenefit}>{t.benefit1}</Text>
              <Text style={styles.upgradeBenefit}>{t.benefit2}</Text>
              <Text style={styles.upgradeBenefit}>{t.benefit3}</Text>
              <Text style={styles.upgradeBenefit}>{t.benefit4}</Text>
              
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={upgradeToPremium}
              >
                <Text style={styles.upgradeButtonText}>{t.upgradeNow}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#16213e',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16213e',
  },
  languageButtonActive: {
    borderColor: '#e94560',
    backgroundColor: '#e94560',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  premiumCard: {
    padding: 20,
    backgroundColor: '#16213e',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4ecca3',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 15,
  },
  premiumText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  premiumBenefit: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  upgradeCard: {
    padding: 20,
    backgroundColor: '#16213e',
    borderRadius: 15,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  upgradeText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  upgradeBenefit: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  upgradeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e94560',
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
