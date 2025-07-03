import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  audioUrl: string | null;
  styles: any; // You can replace `any` with a proper StyleSheet type if needed
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  title = 'Audio Player',
  audioUrl,
  styles,
}) => {

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const onTogglePlayPause = async () => {
    if (!audioUrl) {
      Alert.alert('No Audio', 'There is no audio available to play.');
      return;
    }

    if (!isPlaying) {
      try {
        setIsLoading(true);
        await audioRecorderPlayer.startPlayer(audioUrl);
        setIsPlaying(true);
        setIsLoading(false);
        audioRecorderPlayer.addPlayBackListener((e) => {
          setPosition(e.currentPosition);
          setDuration(e.duration);
          console.log(formatTime(e.currentPosition));
          
          if (e.currentPosition >= e.duration) {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            setIsPlaying(false);
            setPosition(0);
          }
          return;
        });
      } catch (error) {
        console.error('Playback failed', error);
        setIsLoading(false);
        Alert.alert('Playback Error', 'Failed to play audio.');
      }
    } else {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    }
  };

  const onSeek = async (value: number) => {
    await audioRecorderPlayer.seekToPlayer(value);
    setPosition(value);
  };
  const formatTime = (millis: number): string => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (!isPlaying) {
      try {
        setIsPlaying(true);
        setIsLoading(false);
        await audioRecorderPlayer.startPlayer();
      } catch (error) {
        console.error('Playback failed', error);
        setIsLoading(false);
        Alert.alert('Playback Error', 'Failed to play audio.');
      }
    } else {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    }
  }


  useEffect(() => {
    if (audioUrl) {
      onTogglePlayPause();
    }
    if (!visible) {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setPosition(0);
    }

    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [visible]);



  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlayCenter}>
        <View style={styles.centeredModal}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            <>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={onSeek}
                minimumTrackTintColor="#F49D16"
                maximumTrackTintColor="#000000"
                thumbTintColor="#F49D16"
              />

              <Text style={styles.timer}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>

              <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>

                <Text style={styles.btnText}>{isPlaying ? 'Pause' : 'Play'}</Text>

              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;
