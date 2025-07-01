import { View, Text, Image, Animated, Platform, TouchableOpacity, StyleSheet, ScrollView, PermissionsAndroid, TouchableWithoutFeedback, Modal, ActivityIndicator, Alert, Pressable } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import TitleText from './Titletext';
import InputField from './InputField';
import Icon from '@react-native-vector-icons/feather';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useAudio } from '../global/AudioContext';
import BottomModal from './BottomModal';



type CommentModalProps = {
  visible: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: (text: string) => void;
  onSubmit: () => void;
};

const CommentModal = ({
  visible,
  onClose,
  inputValue,
  setInputValue,
  onSubmit,
}: CommentModalProps) => {

  const [isrecordModalVisible, setrecordModalVisible] = useState(false);

  const openModal3 = () => setrecordModalVisible(true);
  const closeModal3 = () => setrecordModalVisible(false);




  const { audioPath } = useAudio();

  const onPlaySound = async () => {
    if (!audioPath) {
      console.warn('No recording available');
      return;
    }

    const cleanedPath = audioPath.replace('file://', '');

    try {
      await audioRecorderPlayer.startPlayer(cleanedPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
        return;
      });
    } catch (error) {
      console.error('Playback failed', error);
    }
  };

   // audio section

   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
   const { setAudioPath } = useAudio();
 
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
       console.warn('Permission denied');
       return;
     }
 
     const path = Platform.select({
       ios: 'sound.m4a',
       android: `${RNFS.CachesDirectoryPath}/sound.m4a`,
     });
 
     const uri = await audioRecorderPlayer.startRecorder(path as string);
     audioRecorderPlayer.addRecordBackListener(() => { });
     console.log('Recording at:', uri);
     setAudioPath(uri);
   };
 
   const onStopRecord = async () => {
     const result = await audioRecorderPlayer.stopRecorder();
     audioRecorderPlayer.removeRecordBackListener();
     console.log('Stopped recording:', result);
   };

  
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <TitleText style={styles.poptext}>Add your Comment</TitleText>

          <InputField
            style={styles.input2}
            autoCapitalize="none"
            textAlignVertical="top"
            multiline
            numberOfLines={4}
            placeholder="Type here..."
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>

            <TouchableOpacity style={styles.orangebutton2} >
              <TitleText style={styles.orangebtntext2}>
                Upload image
              </TitleText>
            </TouchableOpacity>

            <TouchableOpacity
              
              style={styles.commentbox}
              onPress={openModal3}
            >
              
              <TitleText style={styles.textualtext}>Record audio</TitleText>
            </TouchableOpacity>

            <BottomModal isVisible={isrecordModalVisible} onClose={closeModal3}>
              <View style={{padding: 24, justifyContent: 'center', alignItems: 'center' , gap: 12}}>
              <TouchableOpacity
                  onPressIn={onStartRecord}
                  onPressOut={onStopRecord}
                  style={styles.commentbox}
                
                >
                  <Icon name="mic" size={16} color="#000" />
                  <TitleText style={styles.textualtext}>Hold to Record</TitleText>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={onPlaySound}
                  style={styles.commentbox}
                
                >
                  <Icon name="speaker" size={16} color="#000" />
                  <TitleText style={styles.textualtext}>Play the audio</TitleText>
                </TouchableOpacity>

                

              </View>
                
            </BottomModal>


            

            

          </View>

          <Pressable style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({

  textualtext: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  commentbox: {
    borderColor: '#FEC601',
    borderWidth: 1,
    borderStyle: 'solid',
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
    ,
    justifyContent: 'center',
    alignItems: 'center'
  },

  orangebutton2: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE27A',
    padding: 12,
    borderRadius: 25,
  },

  orangebtntext2: {
    color: '#0000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#ddd',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  input2: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    padding: 16,
    height: 120,
    borderRadius: 8,
    color: "#291C0A",
  },

  poptext: {
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#FECC01',
    padding: 10,
    borderRadius: 6,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
