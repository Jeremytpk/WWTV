import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function PlayerScreen({ route, navigation }) {
  const { channel } = route.params;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [streamUrl, setStreamUrl] = useState(channel.url);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  
  // Fetch real stream URL if it's a tv.garden URL
  useEffect(() => {
    const loadStreamUrl = async () => {
      if (channel.url && channel.url.startsWith('tvgarden://')) {
        setIsLoadingUrl(true);
        try {
          const { fetchTvGardenStreamUrl } = require('../services/tvGardenScraper');
          const [, countryAndId] = channel.url.split('://');
          const [countryCode, channelId] = countryAndId.split('/');
          
          const realUrl = await fetchTvGardenStreamUrl(countryCode, channelId);
          
          if (realUrl) {
            setStreamUrl(realUrl);
          } else {
            setError('Could not load stream URL');
          }
        } catch (err) {
          setError('Failed to load stream');
        } finally {
          setIsLoadingUrl(false);
        }
      }
    };
    
    loadStreamUrl();
  }, [channel.url]);
  
  // Create video player instance
  const player = useVideoPlayer(streamUrl, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    // Listen for player status changes
    const subscription = player.addListener('statusChange', (status, oldStatus, error) => {
      if (status === 'readyToPlay') {
        setIsReady(true);
      }
      if (error) {
        setError(error.message || 'Failed to load video stream');
      }
    });

    // Set up screen orientation support
    setupOrientation();

    return () => {
      subscription.remove();
    };
  }, []);

  const setupOrientation = async () => {
    try {
      // Allow all orientations
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('Error setting up orientation:', error);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen - lock to landscape
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setIsFullscreen(true);
      } else {
        // Exit fullscreen - lock to portrait
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      // Toggle fullscreen state even if orientation lock fails
      setIsFullscreen(!isFullscreen);
    }
  };

  const togglePlayPause = () => {
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleVideoPress = () => {
    setShowControls(true);
    setTimeout(() => {
      if (player.playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <StatusBar hidden={isFullscreen} />
      
      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>{channel.name}</Text>
            <Text style={styles.channelCountry}>{channel.country}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        {isLoadingUrl ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e94560" />
            <Text style={styles.loadingText}>Loading stream from tv.garden...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorSubtext}>
              The stream may be temporarily unavailable
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setIsLoading(true);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <VideoView
              style={styles.video}
              player={player}
              allowsPictureInPicture={false}
              nativeControls={false}
            />

            {showControls && (
              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={togglePlayPause}
                >
                  <Text style={styles.controlButtonText}>
                    {player.playing ? '⏸' : '▶'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fullscreenButton}
                  onPress={toggleFullscreen}
                >
                  <Text style={styles.fullscreenButtonText}>
                    {isFullscreen ? '⛶' : '⛶'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>

      {!isFullscreen && (
        <View style={styles.info}>
          <Text style={styles.infoTitle}>Channel Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{channel.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoValue}>{channel.country}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  fullscreenContainer: {
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16213e',
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  channelInfo: {
    marginBottom: 10,
  },
  channelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  channelCountry: {
    fontSize: 14,
    color: '#aaa',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(233, 69, 96, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  fullscreenButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  info: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
});
