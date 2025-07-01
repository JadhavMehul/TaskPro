import {
  View, Text, StyleSheet, Alert, Button, Image, TouchableOpacity, Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import { goBack } from '@utils/NavigationUtils';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import ReadMoreText from '@components/global/ReadMoreText';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useAudio } from '../../components/global/AudioContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import firestore from "@react-native-firebase/firestore";
import InputField from '@components/global/InputField';




const statuses = ['New', 'Done', 'Approved'];


type User = {
  id: string;
  name: string;
  profilePicture: string;
  userEmail: string | null;
};

type RootStackParamList = {
  TaskDetailsScreen: { taskId: string }; // Replace `any` with your actual task type
};

type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetailsScreen'>;


const TaskDetailsScreen = () => {


  const route = useRoute<TaskDetailsScreenRouteProp>();
  const { taskId } = route.params;

  const [selectedStatus, setSelectedStatus] = useState('New');
  const [showDropdown, setShowDropdown] = useState(false);
  const [commentmodalVisible, setCommentModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedUser2, setSelectedUser2] = useState<User | null>(null);
  const [showDropdown2, setShowDropdown2] = useState<boolean>(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [allData, setAllData] = useState({
    title: '',
    description: '',
    recordedSound: '',
    assignedProfilePicture: '',
    assignedName: '',
    taskStatus: '',
    needPermission: false
  })
  const [users, setUsers] = useState([
    { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
  ]);

  const { audioPath } = useAudio();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

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

  const handleSubmit = () => {
    console.log('Input Value:', inputValue);
    setCommentModalVisible(false);
    setInputValue('');
  };


  const changeAssignToUserInDB = async (user: any) => {
    setActivityIndicator(true)
    try {
      await firestore().collection('TaskList').doc(taskId).update({
        assignTo: user.userEmail,
      });

      setAllData(prev => ({
        ...prev,
        assignedProfilePicture: user.profilePicture,
        assignedName: user.name
      }));
    } catch (error) {
      console.log(error);

    } finally {
      setActivityIndicator(false)
    }
  }

  const handleSelect2 = (user: User) => {
    if (user.id === '0') {
      setSelectedUser2(null);
    } else {
      setSelectedUser2(user);
      changeAssignToUserInDB(user)

    }
    setShowDropdown2(false);
  };
  const renderUser2 = ({ item }: { item: User }) => {
    const isSelected2 = selectedUser2?.id === item.id;

    if (item.id === '0') {
      return (
        <TouchableOpacity onPress={() => handleSelect2(item)}>
          <View style={[styles.userContainer2, { backgroundColor: '#fff', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={styles.crossIcon2}>❌</Text>
            <Text style={styles.userName2}>{item.name}</Text>
            <Text style={styles.crossIcon2}>❌</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const content2 = (
      <View style={styles.userInner2}>
        <Image source={{ uri: item.profilePicture }} style={styles.avatar2} />
        <Text style={[styles.userName2, isSelected2 && { color: '#fff' }]}>
          {item.name}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect2(item)}>
        {isSelected2 ? (
          <LinearGradient
            colors={['#F8B700', '#F88D00']}
            style={styles.userContainer2}
          >
            {content2}
          </LinearGradient>
        ) : (
          <View style={[styles.userContainer2, { backgroundColor: '#fff' }]}>
            {content2}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'New':
        return '#fff';
      case 'Done':
        return '#FFFFCC';
      case 'Approved':
        return '#D8F9E0';
      default:
        return '#fff';
    }
  };



  const updateTaskStatus = async (status: string) => {
    setActivityIndicator(true)
    try {
      await firestore().collection('TaskList').doc(taskId).update({
        taskStatus: status,
        taskDone: true
      });
      setAllData(prev => ({
        ...prev,
        taskStatus: status
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedStatus(status);
      setActivityIndicator(false)
      setShowDropdown(false);
    }
  }

  const fetchTask = async () => {
    setActivityIndicator(true)
    try {
      const taskData = await firestore().collection('TaskList').doc(taskId).get();
      if (taskData.exists()) {
        const data = taskData.data();
        const fetchAssignToData = await firestore().collection('UserAccounts').doc(data?.assignTo).get();
        const assignToData = fetchAssignToData.data();
        setAllData({
          title: data?.title || '',
          description: data?.description || '',
          recordedSound: data?.recordedSound || null,
          assignedProfilePicture: assignToData?.profilePicture || '',
          assignedName: assignToData?.firstName || '',
          taskStatus: data?.taskStatus || '',
          needPermission: data?.needPermission || false,
        })
        console.log(data);
        setSelectedStatus(data?.taskStatus || 'New');
      }

    } catch (error) {
      console.log(error);

    } finally {
      setActivityIndicator(false)
    }
  }

  const getEmployees = async () => {
    setActivityIndicator(true);
    try {
      const allEmployeeData = await firestore().collection("UserAccounts").get();
      const employees = allEmployeeData.docs.map((doc, i) => {
        const data = doc.data();
        return {
          id: (i + 1).toString(),
          name: data.firstName || '',
          profilePicture: data.profilePicture || '',
          userEmail: data.email || null,
        };
      });

      const updatedUsers = [
        { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
        ...employees,
      ];
      setUsers(updatedUsers);
    } catch (error) {
      console.log("Error fetching employees:", error);
    } finally {
      setActivityIndicator(false);
    }
  };

  useEffect(() => {
    fetchTask();
    getEmployees();
  }, [])


  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        {activityIndicator ?
          <ActivityIndicator size="large" color="#FECC01" /> :
          <View style={{ flex: 1, backgroundColor: '#FAF8F5' }}>
            <TouchableOpacity onPress={goBack}>
              <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' }} >
                <Image
                  source={require('../../assets/images/backicon.png')}
                  style={styles.image}
                />
                <TitleText style={styles.backtext}>Back</TitleText>

              </View>
            </TouchableOpacity>


            <View style={{ padding: 16, gap: 16 }}>

              <View style={styles.taskbox}>

                {/* <TitleText style={styles.tasktitle}>taskTitle</TitleText> */}

                <ReadMoreText
                  text={allData.title}
                  numberOfChars={20}
                  textStyle={styles.text}
                  readMoreTextStyle={styles.readMoreLink}
                />

                <ReadMoreText
                  text={allData.description}
                  numberOfChars={100}
                  textStyle={styles.text}
                  readMoreTextStyle={styles.readMoreLink}
                />
                {/* <TitleText style={styles.taskdescription}>taskDescription</TitleText> */}

              </View>

              <View style={styles.commentbox}>
                <TouchableOpacity onPress={onPlaySound} >
                  <Image source={require('../../assets/images/speaker.png')} style={styles.speaker} />
                </TouchableOpacity>



                <View style={styles.righttop}>
                  <View style={styles.circle}>
                    <Image source={
                      allData.assignedProfilePicture
                        ? { uri: allData.assignedProfilePicture } // Remote URL string
                        : require('@assets/images/profileIcon.png') // Local fallback
                    } style={styles.circleImage} />
                  </View>
                  <Text style={styles.personName}>{allData.assignedName}</Text>
                </View>

                <View style={{ flexDirection: 'column', gap: 6 }}>

                  <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} >
                    <View style={[
                      styles.addtask,
                      { backgroundColor: getBackgroundColor(selectedStatus) },
                    ]}>
                      <TitleText>
                        {allData.taskStatus}
                        {/* {selectedStatus} */}
                      </TitleText>
                      <Image
                        source={require('../../assets/images/downarrow.png')}
                        style={styles.image2}
                      />
                    </View>

                  </TouchableOpacity>


                  <Modal
                    transparent
                    visible={showDropdown}
                    animationType="fade"
                    onRequestClose={() => setShowDropdown(false)}
                  >
                    <Pressable
                      style={styles.modalBackground}
                      onPress={() => setShowDropdown(false)}
                    >
                      <View style={styles.dropdown}>
                        {statuses.map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[styles.option, { backgroundColor: getBackgroundColor(status) }]}
                            onPress={() => {
                              updateTaskStatus(status);
                            }}
                          >
                            <Text style={styles.optionText}>{status}</Text>

                          </TouchableOpacity>
                        ))}
                      </View>
                    </Pressable>
                  </Modal>


                  <TouchableOpacity
                    onPress={() => setShowDropdown2(!showDropdown2)}>

                    <View style={styles.addtask}>
                      <TitleText style={styles.dropdownText2}>
                        {'Assign To'}
                        {/* {selectedUser2 ? selectedUser2.name : 'Assign To'} */}
                      </TitleText>
                      <Image
                        source={require('../../assets/images/downarrow.png')}
                        style={styles.image2}
                      />
                    </View>

                  </TouchableOpacity>



                  {/* {showDropdown2 && (
                    <View style={styles.dropdownList2}>
                      {users.map((item) => (
                        <React.Fragment key={item.id}>{renderUser2({ item })}</React.Fragment>
                      ))}
                    </View>
                  )} */}

                  <Modal
                    visible={showDropdown2}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowDropdown2(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setShowDropdown2(false)}>
                      <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                          <View style={styles.modalContent}>
                            <FlatList
                              data={users}
                              keyExtractor={(item) => item.id}
                              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                              renderItem={renderUser2}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>


                </View>
              </View>

              {/* <TouchableOpacity onPress={onPlaySound} style={styles.playBtn}>
        <Text style={styles.btnText}>Play Recording</Text>
      </TouchableOpacity> */}


              {
                allData.needPermission && (

                  <View style={styles.commentbox}>

                    <TitleText style={styles.textualtext}>Will you approve this?</TitleText>
                    <View style={styles.addtask}>
                      <TouchableOpacity onPress={() => setSelected(!selected)}>
                        <Image
                          source={
                            selected
                              ? require('../../assets/images/like_fill.png')
                              : require('../../assets/images/like_unfill.png')
                          }
                          style={styles.icon}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setSelected2(!selected2)}>
                        <Image
                          source={
                            selected2
                              ? require('../../assets/images/dislike_fill.png')
                              : require('../../assets/images/dislike_unfill.png')
                          }
                          style={styles.icon}
                        />
                      </TouchableOpacity>

                    </View>
                  </View>
                )}



              <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
                <View style={styles.commentbox}>

                  <TitleText style={styles.textualtext}>Comment</TitleText>
                  <Image
                    source={require('../../assets/images/addicon.png')}
                    style={styles.image2}
                  />
                </View>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={commentmodalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
              >
                <View style={styles.overlay}>
                  <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setCommentModalVisible(false)}>
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    <TitleText style={styles.poptext}>
                      Add your Comment
                    </TitleText>

                    <InputField style={styles.input2}

                      autoCapitalize="none"
                      textAlignVertical="top"
                      multiline
                      numberOfLines={4}
                      placeholder="Type here..."
                      value={inputValue}
                      onChangeText={setInputValue}
                    />



                    {/* Submit Button */}
                    <Pressable style={styles.submitButton} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <View style={styles.commentbox}>

                <View style={{ flexDirection: 'row', gap: 0 }}>

                  <View style={styles.righttop}>
                    <View style={styles.circle}>
                      <Image source={require('../../assets/images/home_fill.png')} style={styles.circleImage} />
                    </View>
                    <Text style={styles.personName}>Mehul</Text>
                  </View>

                  <View style={{ flexDirection: 'column', gap: 6, maxWidth: '70%' }}>
                    <TitleText>30 May 2025 11:25 AM</TitleText>

                    <ReadMoreText
                      text="Lorem ipsum is a dummy o jherbsd kwjebna ljwnde lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, d kjwf esd ensma wedjnsam."
                      numberOfChars={65}
                      textStyle={{ fontSize: 16, color: '#333' }}
                      readMoreTextStyle={{ color: 'orange' }}
                    />
                  </View>

                </View>


                <TouchableOpacity onPress={() => { }}>
                  <Feather name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        }
        {/* <BottomNav /> */}
      </CustomSafeAreaView>

    </View>
  )
}

const styles = StyleSheet.create({

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
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  openButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // transparent black
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
  modalText: {
    fontSize: 18,
    fontWeight: '500',
  },

  playBtn: { padding: 20, backgroundColor: '#4CAF50', borderRadius: 12 },
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },

  text: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FFF',
    width: '50%',
    borderRadius: 10,
    padding: 15,
    height: '70%',
    elevation: 5,
    gap: 10,
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
    fontSize: 16,
    marginRight: 10,
  },
  arrow2: {
    fontSize: 16,
  },
  dropdownList2: {
    position: 'absolute',
    top: 60, // adjust this based on dropdownHeader height
    // left: 0,
    right: 0,
    zIndex: 4,
    marginTop: 10,
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
  modalBackground: {
    flex: 1,
  },

  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdown: {
    gap: 6,
    padding: 6,
    alignSelf: 'center',
    width: '40%',
    marginTop: 220,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 20,
  },


  option: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ddd7',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',

  },
  optionText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
  },





  speaker: {
    width: 44,
    height: 43,
  },

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  circle: {
    width: '70%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  personName: {
    fontWeight: 500,
    fontSize: 16,
    color: '#000000',
  },

  righttop: {
    alignItems: 'center',
    // backgroundColor: 'green',
    width: '25%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
  },

  icon: {
    width: 24,
    height: 21,
  },

  addtask: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 18,
    borderRadius: 6,
    alignItems: 'center',
  },

  textualtext: {
    fontWeight: 'bold',
    fontSize: 16,

  },

  commentbox: {
    borderColor: '#FEC601',
    borderWidth: 4,
    borderStyle: 'dashed',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
    ,
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  tasktitle: {
    fontWeight: 500,
    fontSize: 20,
    color: '#000000',
  },

  taskdescription: {
    fontWeight: 400,
    fontSize: 16,
    color: '#666666',
  },

  taskbox: {

    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,

    flexDirection: 'column',
    gap: 8,
  },

  image2: {
    width: 18,
    height: 18,
    resizeMode: 'cover',
  },

  image: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
  },

  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  backtext: {
    fontWeight: 600,
    fontSize: 16,
  },
})

export default TaskDetailsScreen