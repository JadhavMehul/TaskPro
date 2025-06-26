import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';

const Recorder = () => {
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  const onStartRecord = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.warn('Microphone permission denied');
      return;
    }

    const path = Platform.select({
      ios: 'sound.m4a',
      android: `${RNFS.CachesDirectoryPath}/sound.m4a`,
    });

    const result = await audioRecorderPlayer.startRecorder(path as string);
    audioRecorderPlayer.addRecordBackListener(() => {});
    console.log('Recording started:', result);
    setAudioPath(result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log('Recording stopped:', result);
  };

  const onPlaySound = async () => {
    if (!audioPath) return;

    const cleanedPath = audioPath.replace('file://', '');
    console.log('Playing from:', cleanedPath);

    try {
      await audioRecorderPlayer.startPlayer(cleanedPath);
      console.log('Started player ');

      audioRecorderPlayer.addPlayBackListener((e) => {
        console.log('Playing at:', e.currentPosition, '/', e.duration);
        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
        return;
      });
    } catch (error) {
      console.log('Playback error ', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={onStartRecord}
        onPressOut={onStopRecord}
        style={styles.recordBtn}
      >
        <Text style={styles.btnText}> Hold to Record</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlaySound} style={styles.playBtn}>
        <Text style={styles.btnText}>Play Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlaySound} style={styles.playBtn}>
        <Text style={styles.btnText}>Play Recording</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordBtn: {
    padding: 20,
    backgroundColor: '#FF5555',
    borderRadius: 12,
    marginBottom: 20,
  },
  playBtn: {
    padding: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Recorder;
