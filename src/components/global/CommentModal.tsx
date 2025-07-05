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
import AudioPlayerModal from './AudioPlayPause';
import { launchImageLibrary } from 'react-native-image-picker';
import { screenWidth } from '@utils/Scaling';



type CommentModalProps = {
  visible: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: (text: string) => void;
  onSubmit: () => void;
  attachedImage: AttachedImage | null;
  setAttachedImage: (image: AttachedImage | null) => void;
  attachedAudio: string | null;
  setAttachedAudio: (text: string | null) => void;
};

type AttachedImage = {
  fileName: string;
  uploadUri: string;
  fileExt: string;
};

const CommentModal = ({
  visible,
  onClose,
  inputValue,
  setInputValue,
  onSubmit,
  attachedImage,
  setAttachedImage,
  attachedAudio,
  setAttachedAudio
}: CommentModalProps) => {

  const [activityIndicator, setActivityIndicator] = useState(false);
  const [isrecordModalVisible, setrecordModalVisible] = useState(false);
  const [attachedImageModal, setAttachedImageModal] = useState(false);
  const [attachedAudioModal, setAttachedAudioModal] = useState(false);


  const openModal3 = () => setrecordModalVisible(true);
  const closeModal3 = () => setrecordModalVisible(false);


  const [modalVisible, setModalVisible] = useState(false);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;



  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);


  // audio section

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
    setTimeout(async () => {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Stopped recording:', result);
      setAttachedAudio(result)
    }, 1000);
  };

  const selectImageToUpload = () => {
    if (attachedImage?.uploadUri.trim()) {
      setAttachedImageModal(true)
    } else {
      launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
        const asset = response.assets?.[0];
        if (!asset?.uri || !asset?.type || !asset?.fileName) {
          console.log('Image selection failed or cancelled');
          return;
        }
        setAttachedImage({ fileName: asset.fileName, uploadUri: asset.uri, fileExt: asset.type })
        setAttachedImageModal(true);
      });
    }
  }

  const uploadAudio = async () => {
    if (attachedAudio?.trim()) {

      setAttachedAudioModal(true)

    } else {
      Alert.alert('Error', 'Something went wrong please close the app and re-open it');
    }
  }


  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton2} onPress={onClose}>
            <Text style={styles.closeButtonText2}>×</Text>
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

            <TouchableOpacity style={styles.orangebutton2} onPress={selectImageToUpload}>
              <TitleText style={styles.orangebtntext2}>
                {attachedImage?.uploadUri ? 'View Image' : 'Upload Image'}
              </TitleText>
            </TouchableOpacity>

            {attachedImage && (
              <BottomModal isVisible={attachedImageModal} onClose={() => setAttachedImageModal(false)}>
                {activityIndicator ?
                  <>
                    <ActivityIndicator size="large" color="#FECC01" />
                  </> : <>
                    <ScrollView>
                      <View style={{ gap: 16 }}>
                        <Image
                          source={{ uri: attachedImage.uploadUri }}
                          style={{
                            width: screenWidth * 0.8,
                            height: screenWidth * 0.8,
                            borderRadius: 10,
                            alignSelf: 'center',
                            marginTop: 16,
                          }}
                        />
                      </View>
                    </ScrollView>

                    <View style={styles.endcontainer}>
                      <TouchableOpacity
                        style={styles.orangebutton}
                        onPress={() => setAttachedImage(null)}
                      >
                        <TitleText style={styles.orangebtntext}>Delete Image</TitleText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.orangebutton}
                        onPress={() => setAttachedImageModal(false)}
                      >
                        <TitleText style={styles.orangebtntext}>Done</TitleText>
                      </TouchableOpacity>
                    </View>
                  </>
                }
              </BottomModal>
            )}



            {attachedAudio?.trim() ?
              <TouchableOpacity
                onPressIn={uploadAudio}
                style={styles.commentbox}
              >
                <Icon name="mic" size={16} color="#000" />
                <TitleText style={styles.textualtext}>
                  Listen Audio
                </TitleText>
              </TouchableOpacity>

              :

              <TouchableOpacity
                onPressIn={onStartRecord}
                onPressOut={onStopRecord}
                style={styles.commentbox}
              >
                <Icon name="mic" size={16} color="#000" />
                <TitleText style={styles.textualtext}>
                  Hold to Record
                </TitleText>
              </TouchableOpacity>
            }
            {
                attachedAudio?.trim() && (
                  <AudioPlayerModal
                    visible={attachedAudioModal}
                    onClose={() => setAttachedAudioModal(false)}
                    audioUrl={attachedAudio}
                    localAudio={true}
                    deleteAudio={() => setAttachedAudio(null)}
                    styles={styles}
                  />
                )
              }

          </View>

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({

  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredModal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 10,
  },

  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  playBtn: { padding: 12, backgroundColor: '#F49D16', borderRadius: 12, marginTop: 16, width: '100%' },
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },



  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  slider: { width: '100%', marginTop: 10 },
  timer: { marginTop: 10, fontSize: 16, color: '#333' },

  textualtext: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  playBtn2: { padding: 12, backgroundColor: '#FECC01', borderRadius: 12, marginTop: 16, flex:1},
  playBtn3: { padding: 12, backgroundColor: '#FF3B30', borderRadius: 12, marginTop: 16, flex:1 },

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
  closeButton2: {
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
  closeButtonText2: {
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

  endcontainer: {
    width: '100%',
    paddingTop: 16,
    bottom: 0,
    backgroundColor: '#fff',
  },

  orangebtntext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  orangebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FECC01',
    padding: 12,
    borderRadius: 25,
  },
});
