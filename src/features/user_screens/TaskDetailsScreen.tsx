import {
  View, Text, StyleSheet, Alert, Button, Image, TouchableOpacity, Modal,
  Pressable,
  FlatList,
  TouchableWithoutFeedback,
  TextInput, Dimensions,
  ScrollView,
  ImageSourcePropType,
  ImageStyle,
  ActivityIndicator,
  StyleProp,
  ImageResolvedAssetSource,
  Image as RNImage,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import { goBack } from '@utils/NavigationUtils';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import ReadMoreText from '@components/global/ReadMoreText';
import { navigate } from '@utils/NavigationUtils';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useAudio } from '../../components/global/AudioContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import InputField from '@components/global/InputField';
import CommentModal from '@components/global/CommentModal';
import Icon from '@react-native-vector-icons/feather';
import BottomModal from '@components/global/BottomModal';
import Slider from '@react-native-community/slider';
import AudioPlayerModal from '@components/global/AudioPlayPause';
import moment from 'moment';



const statuses = ['New', 'Done', 'Approved'];


type User = {
  id: string;
  name: string;
  profilePicture: string;
  userEmail: string | null;
};

type RootStackParamList = {
  TaskDetailsScreen: { taskId: string };
};

type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetailsScreen'>;

type AttachedImage = {
  fileName: string;
  uploadUri: string;
  fileExt: string;
};
type UserInfo = {
  firstName: string;
  profilePicture: string;
};
type NewEmailList = string[];
type TaskData = {
  title: string;
  description: string;
  recordedSound: null;
  assignedTo: UserInfo | UserInfo[];
  taskStatus: string;
  needPermission: boolean;
  permissionStatus: boolean | null;
  comments: any[];
  attachedImage: string | null;
  attachedAudio: string | null;
  createdBy: string;
  taskEndTime: string;
  permissionUsername: string | null;
};

const screenWidth = Dimensions.get('window').width;

interface AutoSizedImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  borderRadius?: number;
}

const TaskDetailsScreen = () => {
  const AutoSizedImage: React.FC<AutoSizedImageProps> = ({ source, style, borderRadius = 10 }) => {
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
      // Case: Remote image with `uri`
      if (typeof source === 'object' && 'uri' in source && source.uri) {
        RNImage.getSize(
          source.uri,
          (width, height) => {
            const maxWidth = screenWidth * 0.9;
            const ratio = maxWidth / width;
            setImageSize({
              width: maxWidth,
              height: height * ratio,
            });
          },
          error => {
            console.error('Image size fetch error:', error);
          }
        );
      } else {
        // Case: Local static image (require)
        const resolved: ImageResolvedAssetSource = RNImage.resolveAssetSource(source);
        const maxWidth = screenWidth * 0.9;
        const ratio = maxWidth / resolved.width;
        setImageSize({
          width: maxWidth,
          height: resolved.height * ratio,
        });
      }
    }, [source]);

    if (!imageSize) return <ActivityIndicator size="small" color="#FECC01" />;

    return (
      <Image
        source={source}
        style={[
          {
            width: imageSize.width,
            height: imageSize.height,
            borderRadius,
          },
          style,
        ]}
        resizeMode="contain"
      />
    );
  };


  const currentUser = auth().currentUser;
  const screenWidth = Dimensions.get('window').width;

  const [ismicModalVisible, setmicModalVisible] = useState(false);

  const openModal = () => setmicModalVisible(true);
  const closeModal = () => setmicModalVisible(false);
  const [selectedCommentImage, setSelectedCommentImage] = useState<string | null>(null);
  const [selectedCommentAudio, setSelectedCommentAudio] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false)
  const [ispicModalVisible, setpicModalVisible] = useState(false);

  const openModal2 = (x: string) => {

    setSelectedCommentImage(x);
    setpicModalVisible(true);
  }
  const openAudioModal = (x: string) => {

    setSelectedCommentAudio(x);
    setModalVisible2(true);
  }

  const closeModal2 = () => setpicModalVisible(false);

  const [ispic2ModalVisible, setpic2ModalVisible] = useState(false);

  const openModal3 = () => setpic2ModalVisible(true);
  const closeModal3 = () => setpic2ModalVisible(false);


  const route = useRoute<TaskDetailsScreenRouteProp>();
  const { taskId } = route.params;

  const [selectedStatus, setSelectedStatus] = useState('New');
  const [showDropdown, setShowDropdown] = useState(false);
  const [commentmodalVisible, setCommentModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<string | null>(null);
  const [selectedUser2, setSelectedUser2] = useState<User[]>([]);
  const [tempSelectedUsers2, setTempSelectedUsers2] = useState<User[]>([]);
  const [showDropdown2, setShowDropdown2] = useState<boolean>(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [allData, setAllData] = useState<TaskData>({
    title: '',
    description: '',
    recordedSound: null,
    assignedTo: [],
    taskStatus: '',
    needPermission: false,
    permissionStatus: null,
    comments: [],
    attachedImage: null,
    attachedAudio: null,
    createdBy: '',
    taskEndTime: '',
    permissionUsername: '',
  })
  const [users, setUsers] = useState([
    { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
  ]);
  const [commentUsers, setCommentUsers] = useState<{
    [email: string]: { name: string, profilePicture: string }
  }>({});





  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);


  const handleSubmit = async () => {
    setActivityIndicator(true);
    if (!inputValue.trim()) {
      Alert.alert('Error', 'Please add comment before submitting.');
      setActivityIndicator(false);
    } else {
      try {
        if (attachedAudio && attachedImage) {
          const referenceAudio = storage().ref(`commentAttachments/audio/${currentUser?.email}-${Date.now()}`);
          await referenceAudio.putFile(attachedAudio);
          const downloadAudioURL = await referenceAudio.getDownloadURL();

          const referenceImage = storage().ref(`commentAttachments/images/${currentUser?.email}-${Date.now()}-${attachedImage.fileName}`);
          await referenceImage.putFile(attachedImage.uploadUri);
          const downloadImageURL = await referenceImage.getDownloadURL();

          await firestore().collection('TaskList').doc(taskId).update({
            taskComments: firestore.FieldValue.arrayUnion({
              commentedAt: new Date(),
              commentedText: inputValue,
              commentedBy: currentUser?.email,
              commentedAudio: downloadAudioURL,
              commentedImage: downloadImageURL
            }),
          });

        } else if (attachedAudio) {
          const reference = storage().ref(`commentAttachments/audio/${currentUser?.email}-${Date.now()}`);
          await reference.putFile(attachedAudio);
          const downloadURL = await reference.getDownloadURL();

          await firestore().collection('TaskList').doc(taskId).update({
            taskComments: firestore.FieldValue.arrayUnion({
              commentedAt: new Date(),
              commentedText: inputValue,
              commentedBy: currentUser?.email,
              commentedAudio: downloadURL,
            }),
          });
        } else if (attachedImage) {
          const reference = storage().ref(`commentAttachments/images/${currentUser?.email}-${Date.now()}-${attachedImage.fileName}`);
          await reference.putFile(attachedImage.uploadUri);
          const downloadURL = await reference.getDownloadURL();

          await firestore().collection('TaskList').doc(taskId).update({
            taskComments: firestore.FieldValue.arrayUnion({
              commentedAt: new Date(),
              commentedText: inputValue,
              commentedBy: currentUser?.email,
              commentedImage: downloadURL,
            }),
          });
        } else {
          await firestore().collection('TaskList').doc(taskId).update({
            taskComments: firestore.FieldValue.arrayUnion({
              commentedAt: new Date(),
              commentedText: inputValue,
              commentedBy: currentUser?.email,
            }),
          })
        }


      } catch (error) {
        console.log(error);
      } finally {
        setActivityIndicator(false);
        setCommentModalVisible(false);
        setInputValue('');
        setAttachedImage(null);
        setAttachedAudio(null);
        await fetchTask();
      }
    }
  };
  const commentModalClose = () => {
    setInputValue('');
    setAttachedImage(null);
    setAttachedAudio(null);
    setCommentModalVisible(false)
  }

  const [updatedUsers, setUpdatedUsers] = useState<string[]>([]);

  const changeAssignToUserInDB = async (emails: string[]) => {
    setActivityIndicator(true)
    try {
      await firestore().collection('TaskList').doc(taskId).update({
        assignTo: emails,
      });

      // setAllData(prev => ({
      //   ...prev,
      //   assignedProfilePicture: user.profilePicture,
      //   assignedName: user.name
      // }));
    } catch (error) {
      console.log(error);

    } finally {
      setActivityIndicator(false)
    }
  }

  const handleSelect2 = (user: User) => {

    if (user.id === '0') {
      setTempSelectedUsers2([]);
      // setSelectedUser2(null);
    } else {

      const already = tempSelectedUsers2.find(u => u.id === user.id);

      const updatedList: UserInfo[] = already
        ? tempSelectedUsers2.filter(u => u.id !== user.id).map(u => ({
          firstName: u.name, // mapping 'name' from User to 'firstName' in UserInfo
          profilePicture: u.profilePicture,
        }))
        : [...tempSelectedUsers2, user].map(u => ({
          firstName: u.name,
          profilePicture: u.profilePicture,
        }));

      setTempSelectedUsers2(already
        ? tempSelectedUsers2.filter(u => u.id !== user.id)
        : [...tempSelectedUsers2, user]);

      console.log(already ? 'Removed user, new list:' : 'Added user, new list:', updatedList);


      const newEmailList: string[] = already
        ? tempSelectedUsers2
          .filter(u => u.id !== user.id)
          .map(u => u.userEmail)
          .filter((email): email is string => !!email)
        : [...tempSelectedUsers2, user]
          .map(u => u.userEmail)
          .filter((email): email is string => !!email);






      setAllData(prev => ({
        ...prev,
        assignedTo: updatedList
      }));

      setUpdatedUsers(newEmailList);

      // changeAssignToUserInDB(newEmailList);


      // if (user.userEmail && !updatedUsers.includes(user.userEmail)) {
      //   setUpdatedUsers(prev => [...prev, user.userEmail]);
      // }







      // setSelectedUser2(user);
      // changeAssignToUserInDB(user)

    }
    // setShowDropdown2(false);
  };
  const renderUser2 = ({ item }: { item: User }) => {
    const isSelected2 = tempSelectedUsers2.some(u => u.id === item.id);

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
  const fetchCommentUsers = async (emails: string[]) => {
    const usersMap: { [email: string]: { name: string; profilePicture: string } } = {};
    await Promise.all(emails.map(async (email) => {
      const userDoc = await firestore().collection('UserAccounts').doc(email).get();
      const userData = userDoc.data();
      if (userData) {
        usersMap[email] = {
          name: userData.firstName || '',
          profilePicture: userData.profilePicture || '',
        };
      }
    }));
    setCommentUsers(usersMap);
  };

  const fetchTask = async () => {
    setActivityIndicator(true);
    try {
      const taskData = await firestore().collection('TaskList').doc(taskId).get();
      const data = taskData.data();



      if (!data) {
        console.warn('No task data found');
        return;
      }

      let assignToData: { firstName: string; profilePicture: string } | { firstName: string; profilePicture: string }[] = {
        firstName: '',
        profilePicture: '',
      };
      if (data.assignTo && data.assignTo.length > 0) {
        const userInfoArray: { firstName: string; profilePicture: string }[] = [];

        for (const assigneeEmail of data.assignTo) {
          const userDoc = await firestore()
            .collection('UserAccounts')
            .doc(assigneeEmail)
            .get();

          if (userDoc.exists()) {
            const userData = userDoc.data();
            userInfoArray.push({
              firstName: userData?.firstName || '',
              profilePicture: userData?.profilePicture || '',
            });
          }
        }

        assignToData = userInfoArray;
      }
      console.log("assignToData", assignToData);



      setAllData({
        title: data.title || '',
        description: data.description || '',
        recordedSound: data.attachedAudio || null,
        assignedTo: assignToData || [],
        taskStatus: data.taskStatus || '',
        needPermission: data.needPermission || false,
        permissionStatus: typeof data.permissionStatus === 'boolean' ? data.permissionStatus : null,
        comments: data.taskComments || [],
        attachedImage: data.attachedImage || null,
        attachedAudio: data.attachedAudio || null,
        createdBy: data.createdBy || '',
        taskEndTime: moment(data.taskEndTime).format('DD MMM YYYY - hh:mm A') || '',
        permissionUsername: data.permissionUsername || null
      });
      console.log("data:", data);


      if (data.taskComments?.length > 0) {
        const emails = Array.from(
          new Set((data.taskComments as any[]).map((c) => String(c.commentedBy)))
        );
        await fetchCommentUsers(emails);
      }

      setSelectedStatus(data.taskStatus || 'New');

    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setActivityIndicator(false);
    }
  };



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
        { id: '0', name: 'Deselect', profilePicture: '', userEmail: null },
        ...employees,
      ];
      setUsers(updatedUsers);
    } catch (error) {
      console.log("Error fetching employees:", error);
    } finally {
      setActivityIndicator(false);
    }
  };


  const updatePermission = async (permission: boolean) => {
    const api = 'http://89.117.145.28:3000/permission-status'
    // const api = 'http://10.0.2.2:3000/permission-status'

    const payload = {
      createdByEmail: allData.createdBy,
      title: allData.title,
    };
    if (permission) {
      setSelected(permission);
      setSelected2(!permission);
    } else {
      setSelected(permission);
      setSelected2(!permission);
    }
    try {

      let permissionName = "";

      if (currentUser?.email) {
        const doc = await firestore()
          .collection('UserAccounts')
          .doc(currentUser.email)
          .get();

        if (doc.exists()) {
          const userData = doc.data();
          if (userData && userData.firstName && userData.lastName) {
            permissionName = userData.firstName + " " + userData.lastName;
          }
        } else {
          console.log('User document does not exist');
        }
      }

      await firestore().collection('TaskList').doc(taskId).update({
        permissionStatus: permission,
        permissionUpdatedBy: currentUser?.email,
        permissionUsername: permissionName
      });


      setAllData(prev => ({
        ...prev,
        permissionStatus: permission,
        permissionUpdatedBy: currentUser?.email,
        permissionUsername: permissionName
      }));


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
      console.log(error);
      Alert.alert("Error", "Error occured please try again later");
    }
  }

  const deleteTask = async (taskId: string, imageUrl?: string | null, audioUrl?: string | null) => {
    setIsDeleting(true)
    try {
      if (imageUrl) {
        const decodedUrl = decodeURIComponent(imageUrl);
        const match = decodedUrl.match(/\/o\/(.*?)\?/);
        const filePath = match?.[1];

        if (filePath) {
          const imageRef = storage().ref(filePath);
          await imageRef.delete();
          console.log("Image successfully deleted from Storage!");
        } else {
          console.warn("Could not extract file path from imageUrl.");
        }
      }

      if (audioUrl) {
        const decodedUrl = decodeURIComponent(audioUrl);
        const match = decodedUrl.match(/\/o\/(.*?)\?/);
        const filePath = match?.[1];

        if (filePath) {
          const audioRef = storage().ref(filePath);
          await audioRef.delete();
          console.log("Audio successfully deleted from Storage!");
        } else {
          console.warn("Could not extract file path from audioUrl.");
        }
      }

      if (allData.comments) {
        allData.comments.map(async (x) => {
          if (x.commentedImage) {
            const decodedUrl = decodeURIComponent(x.commentedImage);
            const match = decodedUrl.match(/\/o\/(.*?)\?/);
            const filePath = match?.[1];

            if (filePath) {
              const imageRef = storage().ref(filePath);
              await imageRef.delete();
              console.log("Image successfully deleted from Storage!");
            } else {
              console.warn("Could not extract file path from imageUrl.");
            }
          }
        })
      }

      if (allData.comments) {
        allData.comments.map(async (x) => {
          if (x.commentedAudio) {
            const decodedUrl = decodeURIComponent(x.commentedAudio);
            const match = decodedUrl.match(/\/o\/(.*?)\?/);
            const filePath = match?.[1];

            if (filePath) {
              const audioRef = storage().ref(filePath);
              await audioRef.delete();
              console.log("Audion successfully deleted from Storage!");
            } else {
              console.warn("Could not extract file path from imageUrl.");
            }
          }
        })
      }

      await firestore().collection("TaskList").doc(taskId).delete();
      console.log("Document successfully deleted!");

      navigate("HomeScreen");
    } catch (error) {
      console.log("Error deleting task or image:", error);
    } finally {
      setIsDeleting(false)
    }
  };


  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const fetchUserData = async () => {
    if (currentUser?.email) {
      try {
        const doc = await firestore()
          .collection('UserAccounts')
          .doc(currentUser.email)
          .get();

        if (doc.exists()) {
          const userData = doc.data();
          if (userData && typeof userData.isAdmin !== 'undefined') {
            setUserIsAdmin(userData.isAdmin);
          }
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No user is logged in');
    }
  };



  useEffect(() => {
    fetchTask();
    getEmployees();
    fetchUserData();
  }, [])


  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        {activityIndicator ?
          <ActivityIndicator size="large" color="#FECC01" /> :
          <View style={{ flex: 1, backgroundColor: '#FAF8F5', paddingBottom: 16 }}>
            <TouchableOpacity onPress={goBack}>
              <View style={{ flexDirection: 'row', gap: 6, paddingTop: 16, paddingHorizontal: 16, alignItems: 'center' }} >
                <Image
                  source={require('../../assets/images/backicon.png')}
                  style={styles.image}
                />
                <TitleText style={styles.backtext}>Back</TitleText>

              </View>
            </TouchableOpacity>

            <ScrollView>
              <View style={{ padding: 16, gap: 16 }}>

                <View style={styles.taskbox}>


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


                </View>
                <View style={styles.taskbox2}>
                  <TitleText>
                    Finish before: {allData.taskEndTime}
                  </TitleText>
                  {
                    userIsAdmin && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Confirm Deletion',
                            'Are you sure you want to delete this task?',
                            [
                              {
                                text: 'No',
                                style: 'cancel',
                              },
                              {
                                text: 'Yes, I\'m sure',
                                onPress: () => deleteTask(taskId, allData.attachedImage, allData.attachedAudio),
                                style: 'destructive', // optional, for red text on iOS
                              },
                            ]
                          );
                        }}
                      >
                        {isDeleting ? (
                          <ActivityIndicator size={24} color="red" />
                        ) : (
                          <Feather name="trash" size={24} color="red" />
                        )}
                      </TouchableOpacity>
                    )
                  }




                </View>

                <View style={styles.commentbox}>
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                    <TouchableOpacity onPress={() =>
                      allData.recordedSound
                        ? setModalVisible(true)
                        : Alert.alert("No Audio", "There was no task audio added")
                    }>
                      <Icon name="speaker" size={32} color="#000" />
                    </TouchableOpacity>
                    {
                      allData.recordedSound && (
                        <AudioPlayerModal
                          visible={modalVisible}
                          onClose={() => setModalVisible(false)}
                          audioUrl={allData.recordedSound}
                          styles={styles}
                        />
                      )}


                    <TouchableOpacity onPress={() =>
                      allData.attachedImage
                        ? setpic2ModalVisible(true)
                        : Alert.alert("No Image", "There was no task image added")
                    }>
                      <Icon name="image" size={32} color="#000" />
                    </TouchableOpacity >

                    {
                      allData.attachedImage && (
                        <BottomModal isVisible={ispic2ModalVisible} onClose={closeModal3}>
                          <View>
                            {imageLoading && (
                              <ActivityIndicator
                                size="large" color="#FECC01"
                                style={{ position: 'absolute', top: screenWidth * 0.4 + 16, alignSelf: 'center', zIndex: 1 }}
                              />
                            )}

                            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 16 }}>
                              <AutoSizedImage source={{ uri: allData.attachedImage }} />
                            </ScrollView>
                            {/* <Image
                              source={{ uri: allData.attachedImage }}
                              style={{
                                width: screenWidth * 0.8,
                                height: screenWidth * 0.8,
                                borderRadius: 10,
                                alignSelf: 'center',
                                marginTop: 16,
                              }}
                              onLoadStart={() => setImageLoading(true)}
                              onLoadEnd={() => setImageLoading(false)}
                            /> */}
                          </View>
                        </BottomModal>
                      )
                    }

                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (Array.isArray(allData.assignedTo) && allData.assignedTo.length > 0) {
                        setShowSelectedModal(true);
                      }
                    }} style={styles.righttop}>
                    <View style={styles.circle}>
                      <Image
                        source={
                          Array.isArray(allData.assignedTo)
                            ? allData.assignedTo.length > 1
                              ? require('@assets/images/multiUserIcon.png')
                              : allData.assignedTo.length === 1
                                ? { uri: allData.assignedTo[0].profilePicture }
                                : require('@assets/images/profileIcon.png')
                            : allData.assignedTo.profilePicture
                              ? { uri: allData.assignedTo.profilePicture }
                              : require('@assets/images/profileIcon.png')
                        }
                        style={styles.circleImage}
                      />
                    </View>

                    <Text style={styles.personName}>
                      {
                        Array.isArray(allData.assignedTo)
                          ? allData.assignedTo.length > 1
                            ? `${allData.assignedTo.length} members`
                            : allData.assignedTo.length === 1
                              ? allData.assignedTo[0].firstName
                              : ''
                          : allData.assignedTo.firstName
                      }
                    </Text>
                  </TouchableOpacity>



                  <Modal
                    visible={showSelectedModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowSelectedModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={[styles.modalContent, { height: '40%' }]}>
                        <TouchableOpacity
                          onPress={() => setShowSelectedModal(false)}
                          style={styles.closeButton2}
                        >
                          <Text style={styles.closeButtonText2}>×</Text>
                        </TouchableOpacity>

                        <FlatList
                          data={Array.isArray(allData.assignedTo) ? allData.assignedTo : [allData.assignedTo]}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={styles.userInner2}>
                              <Image source={{ uri: item.profilePicture }} style={styles.avatar2} />
                              <Text style={styles.userName2}>{item.firstName}</Text>
                            </View>
                          )}
                          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                      </View>
                    </View>
                  </Modal>


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
                          source={require('@assets/images/downarrow.png')}
                          style={styles.image2}
                        />
                      </View>

                    </TouchableOpacity>

                    <Modal
                      visible={showDropdown2}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setShowDropdown2(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <TouchableOpacity
                            onPress={() => setShowDropdown2(false)}
                            style={styles.closeButton2}
                          >
                            <Text style={styles.closeButtonText2}>×</Text>
                          </TouchableOpacity>
                          <FlatList
                            data={users}
                            keyExtractor={(item) => item.id}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            renderItem={renderUser2}
                          />

                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUser2(tempSelectedUsers2);
                              setShowDropdown2(false);
                              changeAssignToUserInDB(updatedUsers);
                            }}
                            style={styles.doneButton}
                          >
                            <Text style={styles.doneButtonText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>


                  </View>
                </View>



                {allData.needPermission && (
                  allData.permissionStatus === null ? (
                    userIsAdmin ? (
                      // Admin sees approval UI
                      <View style={styles.commentbox}>
                        <TitleText style={styles.textualtext}>Will you approve this?</TitleText>
                        <View style={styles.addtask}>
                          <TouchableOpacity onPress={() => updatePermission(true)}>
                            <Image
                              source={
                                allData.permissionStatus === true
                                  ? require('../../assets/images/like_fill.png')
                                  : require('../../assets/images/like_unfill.png')
                              }
                              style={styles.icon}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => updatePermission(false)}>
                            <Image
                              source={
                                allData.permissionStatus === false
                                  ? require('../../assets/images/dislike_fill.png')
                                  : require('../../assets/images/dislike_unfill.png')
                              }
                              style={styles.icon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      // Non-admin sees "pending"
                      <View style={styles.commentbox}>
                        <TitleText style={styles.textualtext}>Permission is pending</TitleText>
                      </View>
                    )
                  ) : (
                    // Permission already given
                    <View style={styles.commentbox}>
                      <TitleText style={styles.textualtext}>
                        Permission given by: {allData.permissionUsername}
                      </TitleText>
                      <Image
                        source={
                          allData.permissionStatus === true
                            ? require('../../assets/images/like_fill.png')
                            : require('../../assets/images/dislike_fill.png')
                        }
                        style={styles.icon}
                      />
                    </View>
                  )
                )}





                {/* {
                  userIsAdmin && (

                    <View style={styles.commentbox}>
                      {
                        allData.needPermission && allData.permissionStatus === null ? (
                          <>

                            <TitleText style={styles.textualtext}>Will you approve this?</TitleText>
                            <View style={styles.addtask}>
                              <TouchableOpacity onPress={() => updatePermission(true)}>
                                <Image
                                  source={
                                    allData?.permissionStatus === true
                                      ? require('../../assets/images/like_fill.png')
                                      : require('../../assets/images/like_unfill.png')
                                  }
                                  style={styles.icon}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => updatePermission(false)}>
                                <Image
                                  source={
                                    allData?.permissionStatus === false
                                      ? require('../../assets/images/dislike_fill.png')
                                      : require('../../assets/images/dislike_unfill.png')
                                  }
                                  style={styles.icon}
                                />
                              </TouchableOpacity>

                            </View>

                          </>
                        ) : (
                          <>
                            <TitleText style={styles.textualtext}>Permission given by: {allData.permissionUsername}</TitleText>
                            <Image
                              source={
                                allData?.permissionStatus === true
                                  ? require('../../assets/images/like_fill.png')
                                  : require('../../assets/images/dislike_fill.png')
                              }
                              style={styles.icon}
                            />
                          </>
                        )}
                    </View>
                  )
                } */}






                <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
                  <View style={styles.commentbox}>

                    <TitleText style={styles.textualtext}>Comment</TitleText>
                    <Image
                      source={require('../../assets/images/addicon.png')}
                      style={styles.image2}
                    />
                  </View>
                </TouchableOpacity>
                <CommentModal
                  visible={commentmodalVisible}
                  onClose={() => commentModalClose()}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSubmit={handleSubmit}
                  attachedImage={attachedImage}
                  setAttachedImage={setAttachedImage}
                  attachedAudio={attachedAudio}
                  setAttachedAudio={setAttachedAudio}
                />


                {
                  allData.comments && (
                    (allData.comments as {
                      commentedAt: { _seconds: number; _nanoseconds: number };
                      commentedText: string;
                      commentedBy: string;
                      commentedImage: string
                      commentedAudio: string
                    }[])
                      .sort((a, b) => b.commentedAt._seconds - a.commentedAt._seconds)
                      .map((commentData, index) => (
                        <View style={styles.commentbox2} key={index}>
                          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                            <View style={styles.circle}>
                              <Image
                                source={
                                  commentUsers[commentData.commentedBy]?.profilePicture
                                    ? { uri: commentUsers[commentData.commentedBy].profilePicture }
                                    : require('../../assets/images/profileIcon.png')
                                }
                                style={styles.circleImage}
                              />
                            </View>
                            <Text style={styles.personName}>{commentUsers[commentData.commentedBy]?.name ?? 'Unknown'}</Text>
                          </View>

                          <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>

                            <View>

                              <TitleText>
                                {moment(new Date(commentData.commentedAt._seconds * 1000)).format('DD MMM YYYY hh:mm A')}
                              </TitleText>



                              <ReadMoreText
                                text={commentData.commentedText}
                                numberOfChars={40}
                                textStyle={{ fontSize: 16, color: '#333' }}
                                readMoreTextStyle={{ color: 'orange' }}
                              />
                            </View>





                            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                              {
                                commentData.commentedAudio && (
                                  <TouchableOpacity onPress={() =>
                                    commentData.commentedAudio
                                      ? openAudioModal(commentData.commentedAudio)
                                      : Alert.alert("No Audio", "There was no audio added on comment")
                                  }>
                                    <Icon name="mic" size={20} color="#000" />
                                  </TouchableOpacity>
                                )

                              }


                              {/* {
                                commentData.commentedAudio && (
                                  <AudioPlayerModal
                                    visible={modalVisible2}
                                    onClose={() => setModalVisible2(false)}
                                    audioUrl={selectedCommentAudio}
                                    styles={styles}
                                  />
                                )} */}

                              {
                                commentData.commentedImage && (
                                  <TouchableOpacity onPress={() => commentData.commentedImage
                                    ? openModal2(commentData.commentedImage)
                                    : Alert.alert("No Image", "There was no image added on comment")
                                  }>
                                    <Icon name="image" size={20} color="#000" />
                                  </TouchableOpacity>
                                )
                              }


                              <BottomModal isVisible={ispicModalVisible} onClose={closeModal2}>
                                <View>
                                  {imageLoading && (
                                    <ActivityIndicator
                                      size="large" color="#FECC01"
                                      style={{ position: 'absolute', top: screenWidth * 0.4 + 16, alignSelf: 'center', zIndex: 1 }}
                                    />
                                  )}
                                  <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 16 }}>
                                    <AutoSizedImage
                                      source={
                                        selectedCommentImage
                                          ? { uri: selectedCommentImage }
                                          : require('../../assets/images/profileIcon.png')
                                      }
                                    />
                                  </ScrollView>
                                  {/* <Image
                                    source={
                                      selectedCommentImage ? { uri: selectedCommentImage } : require('../../assets/images/profileIcon.png')
                                    }
                                    style={{
                                      width: screenWidth * 0.8,
                                      height: screenWidth * 0.8,
                                      borderRadius: 10,
                                      alignSelf: 'center',
                                      marginTop: 16,
                                    }}
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoadEnd={() => setImageLoading(false)}
                                  /> */}
                                </View>
                              </BottomModal>
                            </View>

                          </View>
                        </View>
                      ))
                  )
                }


                <AudioPlayerModal
                  visible={modalVisible2}
                  onClose={() => setModalVisible2(false)}
                  audioUrl={selectedCommentAudio}
                  styles={styles}
                />





              </View>
            </ScrollView>
          </View>
        }
        {/* <BottomNav /> */}
      </CustomSafeAreaView>

    </View>
  )
}

const styles = StyleSheet.create({
  doneButton: {
    marginTop: 16,
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton2: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText2: {
    fontSize: 20,
    color: '#333',
  },

  commentbox2: {

    flexDirection: 'row', padding: 12, gap: 16, borderColor: '#FEC601',
    borderWidth: 4,
    borderStyle: 'dashed',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

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

  playBtn: { padding: 12, backgroundColor: '#F49D16', borderRadius: 12, marginTop: 16 },
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
    top: 60,
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
    height: '60%',
    borderRadius: 10,
    padding: 16,
    paddingTop: 40,

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
    width: 32,
    height: 32,
  },

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  circle: {
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    width: '30%',
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
    width: '45%',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'green',
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
    backgroundColor: '#ffffff',
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

  taskbox2: {

    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
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