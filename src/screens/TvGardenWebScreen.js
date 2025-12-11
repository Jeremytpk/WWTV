import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function TvGardenWebScreen({ route, navigation }) {
  const { country, countryCode } = route.params;
  const webViewRef = useRef(null);

  // Build tv.garden URL for the country
  const tvGardenUrl = `https://tv.garden/${countryCode}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{country} - tv.garden</Text>
      </View>

      {/* Embedded tv.garden website */}
      <WebView
        ref={webViewRef}
        source={{ uri: tvGardenUrl }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading tv.garden...</Text>
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#e94560',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});
