import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  audioUrl: string | null;
  styles: any;
  localAudio?: boolean;
  deleteAudio?: () => void;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  title = 'Audio Player',
  audioUrl,
  styles,
  localAudio,
  deleteAudio
}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const formatTime = (millis: number): string => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const stopAudio = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
    } catch (_) { }
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  };

  const playAudio = async () => {
    if (!audioUrl) {
      Alert.alert('No Audio', 'There is no audio available to play.');
      return;
    }

    try {
      setIsLoading(true);
      await stopAudio();
      setHasEnded(false); // reset replay state

      await audioRecorderPlayer.startPlayer(audioUrl);

      audioRecorderPlayer.addPlayBackListener((e) => {
        console.log('Playback update:', e.currentPosition, '/', e.duration);
        setPosition(e.currentPosition);
        setDuration(e.duration);

        // ✅ Detect when playback ends
        if (e.duration > 0 && e.currentPosition >= e.duration - 500) {
          console.log('==> Audio END detected');
          audioRecorderPlayer.stopPlayer().then(() => {
            audioRecorderPlayer.removePlayBackListener();
            setIsPlaying(false);
            setPosition(0);
            setHasEnded(true); // show Replay
          });
        }

        return;
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Playback failed', error);
      Alert.alert('Playback Error', 'Failed to play audio.');
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } catch (err) {
      console.error('Pause error', err);
    }
  };

  const resumeAudio = async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
      setIsPlaying(true);
    } catch (err) {
      console.error('Resume error', err);
      Alert.alert('Playback Error', 'Failed to resume audio.');
    }
  };

  const onSeek = async (value: number) => {
    try {
      if (!isPlaying) {
        // Workaround: resume → seek → pause
        await audioRecorderPlayer.resumePlayer();
        await audioRecorderPlayer.seekToPlayer(value);
        await audioRecorderPlayer.pausePlayer();
        setIsPlaying(false);
      } else {
        await audioRecorderPlayer.seekToPlayer(value);
      }
      setPosition(value);
    } catch (e) {
      console.log('Seek error:', e);
      Alert.alert('Seek Error', 'Could not seek. Try playing again.');
    }
  };


  const handlePlayPause = async () => {
    if (hasEnded) {
      await playAudio(); // replay from beginning
    } else if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
  };

  useEffect(() => {
    if (visible && audioUrl) {
      playAudio();
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
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
            <ActivityIndicator size="large" color="#000" />
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
                <Text style={styles.btnText}>
                  {hasEnded ? 'Replay Audio' : isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
            </>
          )}



          {
            localAudio && (
              <View>
                <TouchableOpacity onPress={onClose} style={styles.playBtn}>
                  <Text style={styles.btnText}>
                    Done
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteAudio} style={styles.playBtn}>
                  <Text style={styles.btnText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }

        </View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;
