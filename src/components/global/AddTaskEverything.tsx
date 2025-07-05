import { View, Text, Image, Animated, Platform, TouchableOpacity, StyleSheet, ScrollView, PermissionsAndroid, TouchableWithoutFeedback, Modal, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import TitleText from './Titletext'
import InputField from './InputField'
import ToggleSwitch from './ToggleSwitch'

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import TimePicker from './TimePicker'
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useAudio } from '../global/AudioContext';
import Icon from '@react-native-vector-icons/feather';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomModal from '@components/global/BottomModal';
import { screenWidth } from '@utils/Scaling';
import storage from "@react-native-firebase/storage";
import AudioPlayerModal from './AudioPlayPause';




type Props = {
  onCloseModal: () => void;
};

type User = {
  id: string;
  name: string;
  profilePicture: string;
  userEmail: string | null;
};

type AttachedImage = {
  fileName: string;
  uploadUri: string;
  fileExt: string;
};

const AddTaskEverything: React.FC<Props> = ({ onCloseModal }) => {
  const currentUser = auth().currentUser;
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [timeSet, setTimeSet] = useState(false);
  const [attachedImageModal, setAttachedImageModal] = useState(false);
  const [attachedAudioModal, setAttachedAudioModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
  
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<string | null>(null);
  const [users, setUsers] = useState([
    { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
  ]);

  console.log(attachedAudio);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignTo: '',
    needPermission: false,
    taskEndTime: '',
    notificationTimer: '',
    createdBy: '',
    taskStatus: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | null | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (pickerMode === 'date') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setPickerMode('time');
      setShowPicker(true);
    } else {
      const updatedDate = selectedDate || date;
      setDate(updatedDate);
      setShowPicker(false);
      setTimeSet(true);
      handleInputChange('taskEndTime', moment(updatedDate).format('YYYY-MM-DDTHH:mm:ssZ'))
    }
  };
  const showDateTimePicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };
  //   timepicker end

  // toggleswitch start

  const [isOn, setIsOn] = useState(false);
  const knobPosition = useRef(new Animated.Value(6)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 6 : 38;
    Animated.timing(knobPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(prev => !prev);
  };

  // toggleswitch end

  // dropdown start
  const [selectedUser3, setSelectedUser3] = useState<User | null>(null);
  const [showDropdown3, setShowDropdown3] = useState<boolean>(false);

  const handleSelect3 = (user: User) => {
    if (user.id === '0') {
      setSelectedUser3(null);
    } else {
      setSelectedUser3(user);
      handleInputChange('assignTo', user.userEmail)
      handleInputChange('createdBy', currentUser?.email)
    }
    setShowDropdown3(false);
  };
  const renderUser3 = ({ item }: { item: User }) => {
    const isSelected3 = selectedUser3?.id === item.id;

    if (item.id === '0') {
      return (
        <TouchableOpacity onPress={() => handleSelect3(item)}>
          <View style={[styles.userContainer2, { backgroundColor: '#fff', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={styles.crossIcon2}>❌</Text>
            <Text style={styles.userName2}>{item.name}</Text>
            <Text style={styles.crossIcon2}>❌</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const content3 = (
      <View style={styles.userInner2}>
        <Image source={{ uri: item.profilePicture }} style={styles.avatar2} />
        <Text style={[styles.userName2, isSelected3 && { color: '#fff' }]}>
          {item.name}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect3(item)}>
        {isSelected3 ? (
          <LinearGradient
            colors={['#F8B700', '#F88D00']}
            style={styles.userContainer2}
          >
            {content3}
          </LinearGradient>
        ) : (
          <View style={[styles.userContainer2, { backgroundColor: '#fff' }]}>
            {content3}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const callApi = async (formData: any, id: string) => {

    console.log(formData);

    const payload = {
      email: formData.assignTo,
      title: formData.title,
      body: formData.description,
      taskTimer: formData.notificationTimer,
      endTimer: formData.taskEndTime,
      docId: id,
    };

    const api = 'http://154.53.44.112:3000/start-reminder-loop-until-end'
    // const api = 'http://10.0.2.2:3000/start-reminder-loop-until-end'
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);

    } catch (error) {
      console.error('❌ Error calling API:', error);
    }

  }





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
     setTimeout(async () => {
       const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        console.log('Stopped recording:', result);
        setAttachedAudio(result)
    }, 1000);
  };






  const addTaskFunction = async (formData: any, attachedImage: AttachedImage | null, attachedAudio: string | null) => {
    const { title, description, assignTo, taskEndTime, notificationTimer, createdBy, taskStatus } = formData;

    // Check if any required field is empty
    if (
      !title.trim() ||
      !description.trim() ||
      !assignTo.trim() ||
      !taskEndTime.trim() ||
      !notificationTimer.trim() ||
      !createdBy.trim()
    ) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    setActivityIndicator(true);
    try {
      const timeNow = Date.now();

      // Case 1: Both image and audio are attached
      if (attachedImage && attachedAudio) {
        const referenceImage = storage().ref(`taskAttachments/images/${createdBy}-${timeNow}-${attachedImage.fileName}`);
        await referenceImage.putFile(attachedImage.uploadUri);
        const downloadImageURL = await referenceImage.getDownloadURL();

        const referenceAudio = storage().ref(`taskAttachments/audio/${createdBy}-${timeNow}`);
        await referenceAudio.putFile(attachedAudio);
        const downloadAudioURL = await referenceAudio.getDownloadURL();

        const docRef = await firestore().collection("TaskList").add({
          ...formData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          taskStatus: 'New',
          taskDone: false,
          attachedImage: downloadImageURL,
          attachedAudio: downloadAudioURL,
        });
        console.log('Task added successfully!');
        await callApi(formData, docRef.id);

        // Case 2: Only image is attached
      } else if (attachedImage) {
        const reference = storage().ref(`taskAttachments/images/${createdBy}-${timeNow}-${attachedImage.fileName}`);
        await reference.putFile(attachedImage.uploadUri);
        const downloadURL = await reference.getDownloadURL();

        const docRef = await firestore().collection("TaskList").add({
          ...formData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          taskStatus: 'New',
          taskDone: false,
          attachedImage: downloadURL,
        });
        console.log('Task added successfully!');
        await callApi(formData, docRef.id);

        // Case 3: Only audio is attached
      } else if (attachedAudio) {
        const reference = storage().ref(`taskAttachments/audio/${createdBy}-${timeNow}`);
        await reference.putFile(attachedAudio);
        const downloadURL = await reference.getDownloadURL();

        const docRef = await firestore().collection("TaskList").add({
          ...formData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          taskStatus: 'New',
          taskDone: false,
          attachedAudio: downloadURL,
        });
        console.log('Task added successfully!');
        await callApi(formData, docRef.id);

        // Case 4: No attachments
      } else {
        const docRef = await firestore().collection("TaskList").add({
          ...formData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          taskStatus: 'New',
          taskDone: false,
        });
        console.log('Task added successfully!');
        await callApi(formData, docRef.id);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setActivityIndicator(false);
      onCloseModal();
    }

  };

  const uploadImage = async () => {
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



  useEffect(() => {
    const getEmployees = async () => {
      setActivityIndicator(true)
      try {
        const allEmployeeData = await firestore().collection("UserAccounts").get()
        const employees = allEmployeeData.docs.map((doc, i) => {
          const data = doc.data();
          // console.log(data);
          return {
            id: (i + 1).toString(),
            name: data.firstName || '',
            profilePicture: data.profilePicture || '',
            userEmail: data.email || null,
          };
        });
        // setCards(employees);

        const updatedUsers = [
          { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
          ...employees,
        ];
        setUsers(updatedUsers);
        setActivityIndicator(false)
        // console.log("Employees:", JSON.stringify(employees));
      } catch (error) {
        console.log(error);
        setActivityIndicator(false)
      }
    }
    getEmployees();
  }, [])



  return (

    <View style={{ flex: 1 }}>

      <ScrollView>
        <View style={{ flexDirection: 'column', gap: 16 }}>

          {activityIndicator ?
            <ActivityIndicator size="large" color="#FECC01" /> :

            <>

              <TitleText style={styles.poptext}>
                Title
              </TitleText>
              <InputField style={styles.input1}
                placeholder="Task title"
                autoCapitalize="none"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
              />

              <TitleText style={styles.poptext}>
                Description
              </TitleText>

              <InputField style={styles.input2}
                placeholder="Description"
                autoCapitalize="none"
                textAlignVertical="top"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
              />

              <TouchableOpacity style={styles.orangebutton2} onPress={() => uploadImage()}>
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
                          style={styles.redbutton}
                          onPress={() => setAttachedImage(null)}
                        >
                          <TitleText style={styles.orangebtntext}>Delete Image</TitleText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.orangebutton}
                          onPress={() => setAttachedImageModal(false)}
                        >
                          <TitleText style={styles.orangebtntext2}>Done</TitleText>
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

              <View style={styles.namecard}>
                <View style={styles.row}>
                  <View style={styles.circle}>
                    <Image
                      source={selectedUser3 ? { uri: selectedUser3.profilePicture } : require('@assets/images/profileIcon.png')}

                      style={styles.circleImage}
                    />
                  </View>

                  <TitleText style={styles.personName}>{selectedUser3 ? selectedUser3.name : 'User Name'}</TitleText>
                </View>


                <TouchableOpacity onPress={() => setShowDropdown3(true)}>
                  <View style={styles.addtask}>
                    <TitleText style={styles.dropdownText2}>
                      {selectedUser3 ? selectedUser3.name : 'Assign To'}
                    </TitleText>
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={styles.image2}
                    />
                  </View>
                </TouchableOpacity>

                <Modal
                  transparent
                  visible={showDropdown3}
                  animationType="fade"
                  onRequestClose={() => setShowDropdown3(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setShowDropdown3(false)}>
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                          <ScrollView contentContainerStyle={{ gap: 10 }}>
                            {users.map((item) => (
                              <React.Fragment key={item.userEmail}>{renderUser3({ item })}</React.Fragment>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>



              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TitleText style={styles.poptext}>
                  Need Permission?
                </TitleText>

                <ToggleSwitch
                  isOn={isOn}
                  toggleSwitch={() => {
                    toggleSwitch(); // <- call toggle switch
                    handleInputChange('needPermission', !isOn); // <- call input change
                  }}
                  knobPosition={knobPosition}
                />


              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TitleText style={styles.poptext}>
                  Task End Time
                </TitleText>


                <TouchableOpacity onPress={showDateTimePicker}>
                  <View style={styles.addtask}>
                    {timeSet ? (
                      <TitleText>{moment(date).format('YYYY-MM-DDTHH:mm:ssZ')}</TitleText>
                    ) : (
                      <>
                        <TitleText>Add Time</TitleText>
                        <Image
                          source={require('../../assets/images/addcircle.png')}
                          style={styles.image2}
                        />
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode={pickerMode}
                    is24Hour={true}
                    display="spinner"
                    onChange={onChange}
                  />
                )}

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TitleText style={styles.poptext}>
                  Add Notification Timer
                </TitleText>

                <TimePicker onSendData={(timer: string) => handleInputChange('notificationTimer', timer)} />

              </View>
            </>
          }
        </View>
      </ScrollView>

      <View style={styles.endcontainer}>
        <TouchableOpacity style={styles.orangebutton} onPress={() => addTaskFunction(formData, attachedImage, attachedAudio)}>
          <TitleText style={styles.orangebtntext}>
            Add Task
          </TitleText>
        </TouchableOpacity>
      </View>
    </View>

  )
}

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


  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  slider: { width: '100%', marginTop: 10 },
  timer: { marginTop: 10, fontSize: 16, color: '#333' },
  playBtn2: { padding: 12, backgroundColor: '#FECC01', borderRadius: 12, marginTop: 16, flex:1},
  playBtn3: { padding: 12, backgroundColor: '#FF3B30', borderRadius: 12, marginTop: 16, flex:1 },

  playBtn: { padding: 12, backgroundColor: '#F49D16', borderRadius: 12, marginTop: 16, width: '100%'},
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },



  textualtext: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  commentbox: {
    borderColor: '#FEC601',
    borderWidth: 1,
    borderStyle: 'solid',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
    ,
    justifyContent: 'center',
    alignItems: 'center'
  },

  recordBtn: { padding: 20, backgroundColor: '#FF5555', borderRadius: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    height: '50%',
    borderRadius: 10,
    padding: 16,
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
 

  orangebtntext2: {
    color: '#0000000',
    fontSize: 16,
    fontWeight: '600',
  },

  redbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 25,
    marginBottom: 16,
  },

  orangebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FECC01',
    padding: 12,
    borderRadius: 25,
  },

  orangebutton2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE27A',
    padding: 12,
    borderRadius: 25,
  },

  text: {
    fontSize: 16,
    color: '#333',
  },
  readMoreLink: {
    color: 'orange',
    fontWeight: '500',
  },

  crossIcon2: {
    fontSize: 8,
    color: '#999',
    paddingHorizontal: 4,
  },

  dropdownHeader2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText2: {
    fontSize: 14,
    // marginRight: 10,
  },
  arrow2: {
    fontSize: 16,
  },
  dropdownList2: {
    position: 'absolute',
    top: 50,

    right: 10,
    zIndex: 4,
    // marginTop: 10,
    width: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    gap: 10,
    padding: 8,
  },
  userContainer2: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    borderRadius: 12,
    padding: 10,
  },
  userInner2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar2: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  userName2: {
    fontSize: 16,
    fontWeight: '600',
  },

  namecard: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  personName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',
  },

  input1: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    color: "#291C0A",
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
    fontSize: 15,
    fontWeight: 400,
  },//


  image: {
    width: 17,
    height: 17,
    resizeMode: 'cover',
  },

  image2: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
  },

  addtask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 12,
    borderRadius: 6,
  },

  dropsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,

  },


  gradientBox: {
    padding: 16,
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },


  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  itemText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#555' },

})

export default AddTaskEverything