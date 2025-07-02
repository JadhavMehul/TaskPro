import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  isPlaying: boolean;
  position: number;
  duration: number;
  title?: string;
  onTogglePlayPause: () => void;
  onSeek: (value: number) => void;
  formatTime: (millis: number) => string;
  styles: any; // You can replace `any` with a proper StyleSheet type if needed
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  isPlaying,
  position,
  duration,
  onTogglePlayPause,
  onSeek,
  title = 'Audio Player',
  formatTime,
  styles,
}) => {
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

          <TouchableOpacity onPress={onTogglePlayPause} style={styles.playBtn}>
            <Text style={styles.btnText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;
