import React, { useEffect, useState, useRef } from 'react';
// import { firebase } from "../../../firebaseConfig";
import { View, Text, Button, StyleSheet, Animated, Alert, Platform, Image, FlatList, TouchableOpacity, ScrollView, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import { navigate } from '@utils/NavigationUtils';
import BottomNav from '@components/global/BottomBar';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import Feather from '@react-native-vector-icons/feather';
import { Modal } from 'react-native';

import BottomModal from '@components/global/BottomModal';
import auth from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import TaskBox from '@components/global/TaskBox';
import InputField from '@components/global/InputField';
import ToggleSwitch from '@components/global/ToggleSwitch';
import LinearGradient from 'react-native-linear-gradient';
import storage from "@react-native-firebase/storage";


import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import TimePicker from '@components/global/TimePicker';
import AddTaskEverything from '@components/global/AddTaskEverything';
import moment from 'moment';



type TaskData = {
  id: string;
  assignTo: string;
  title: string;
  description: string;
  createdBy: string;
  needPermission: boolean;
  notificationTimer: string;
  taskEndTime: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

// type User2 = {
//   id: string;
//   name: string;
//   image: string;
// };

// const users2: User2[] = [

//   {
//     id: '0',
//     name: 'Assigned to',
//     image: '',
//   },

//   {
//     id: '1',
//     name: 'Mehul',
//     image: 'https://i.imgur.com/1Qf1Z0G.jpg',
//   },
//   {
//     id: '2',
//     name: 'Chris',
//     image: 'https://i.imgur.com/1Qf1Z0G.jpg',
//   },
// ];

type User = {
  id: string;
  name: string;
  profilePicture: string;
  userEmail: string | null;
};

const HomeScreen = () => {

  const user = auth().currentUser;
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [originalTaskCards, setOriginalTaskCards] = useState<any[]>([]);
  const [allTaskCards, setAllTaskCards] = useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser2, setSelectedUser2] = useState<User | null>(null);
  const [showDropdown2, setShowDropdown2] = useState<boolean>(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [users, setUsers] = useState([
    { id: '0', name: 'Assigned to', profilePicture: '', userEmail: null },
  ]);

  const sortTaskByUsers = (userEmail: string | null) => {
  if (!userEmail) return;

  const filteredTasks = originalTaskCards.filter(task => task.assignTo === userEmail);
  setAllTaskCards(filteredTasks);
};
  
  const handleSelect2 = (user: User) => {
    if (user.id === '0') {
      setSelectedUser2(null);
      setAllTaskCards(originalTaskCards);
    } else {
      setSelectedUser2(user);
      sortTaskByUsers(user.userEmail);
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



  const fetchUserData = async () => {
    if (user?.email) {
      try {
        const doc = await firestore()
          .collection('UserAccounts')
          .doc(user.email)
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

  const fetchTaskCard = () => {
    const unsubscribe = firestore()
      .collection('TaskList')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (snapshot) => {
        try {
          const tasksWithUserInfo = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const task = { ...(doc.data() as TaskData), id: doc.id };


              let userInfo = { firstName: '', profilePicture: '' };

              if (task.assignTo) {
                const userDoc = await firestore()
                  .collection('UserAccounts')
                  .doc(task.assignTo) // This assumes the document ID in UserAccounts is the user's email
                  .get();

                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  userInfo = {
                    firstName: userData?.firstName || '',
                    profilePicture: userData?.profilePicture || '',
                  };
                }
              }

              const formattedDate = task.createdAt?.toDate ? moment(task.createdAt.toDate()).format("DD MMM YYYY - hh:mm A") : '';

              return {
                ...task,
                createdAt: formattedDate,
                firstName: userInfo.firstName,
                profilePicture: userInfo.profilePicture,
              };
            })
          );

          setOriginalTaskCards(tasksWithUserInfo);
          setAllTaskCards(tasksWithUserInfo);
          console.log(tasksWithUserInfo);

        } catch (error) {
          console.error('Error fetching user info for tasks:', error);
        }
      }, (error) => {
        console.error('Error fetching tasks:', error);
      });

    return unsubscribe;
  };

  const deleteTask = async (taskId: string, imageUrl: string) => {
  try {
    await firestore().collection("TaskList").doc(taskId).delete();
    console.log("Document successfully deleted!");

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
  } catch (error) {
    console.log("Error deleting task or image:", error);
  }
};






  useEffect(() => {
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

  fetchUserData();           // already defined
  getEmployees();            // new addition
  const unsubscribe = fetchTaskCard(); // snapshot listener

  return () => {
    if (unsubscribe) unsubscribe(); // cleanup listener
  };
}, [user]);


  return (

    <>
      {/* <StatusBar barStyle={'dark-content'}/> */}




      <View style={styles.inner_container}>
        <CustomSafeAreaView style={{ flex: 1 }}>
          {/* <View style={styles.yellow}> */}
          <LinearGradient
            colors={['#FECC01', '#F49C16']}
            style={styles.gradientBox}
          >

          {activityIndicator ?
                      <ActivityIndicator size="large" color="#FECC01" /> :

            <>
            <View style={styles.dropsection}>

              <TouchableOpacity onPress={() => setModalVisible(true)}>

                <View style={styles.addtask}>
                  <TitleText>
                    Add task
                  </TitleText>
                  <Image
                    source={require('../../assets/images/addtaskicon.png')}
                    style={styles.image2}
                  />
                </View>

              </TouchableOpacity>
              <BottomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
                <AddTaskEverything onCloseModal={() => setModalVisible(false)} />
              </BottomModal>

              {/* <TouchableOpacity
              onPress={() => setShowDropdown2(!showDropdown2)}>

              <View style={styles.addtask}>
                <TitleText style={styles.dropdownText2}>
                  {selectedUser2 ? selectedUser2.name : 'Assigned To'}
                </TitleText>
                <Image
                  source={require('../../assets/images/downarrow.png')}
                  style={styles.image2}
                />
              </View>

            </TouchableOpacity>





            {showDropdown2 && (
              <View style={styles.dropdownList2}>
                {users2.map((item) => (
                  <React.Fragment key={item.id}>{renderUser2({ item })}</React.Fragment>
                ))}
              </View>
            )} */}

              {/* <TouchableOpacity onPress={() => setModalVisible(true)}>

<View style={styles.addtask}>
  <TitleText>
    Add task
  </TitleText>
  <Image
    source={require('../../assets/images/edit.png')}
    style={styles.image}
  />
</View>

</TouchableOpacity> */}

              <TouchableOpacity onPress={() => setShowDropdown2(true)}>
                <View style={styles.addtask}>
                  <TitleText>
                    {selectedUser2 ? selectedUser2.name : 'Assigned To'}
                  </TitleText>
                  <Image
                    source={require('../../assets/images/downarrow.png')}
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
                <Pressable style={styles.modalBackground} onPress={() => setShowDropdown2(false)}>
                  <View style={styles.modalContainer}>
                    <FlatList
                      data={users}
                      keyExtractor={(item) => item.id}
                      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                      renderItem={renderUser2}
                    />
                  </View>
                </Pressable>
              </Modal>

            </View>


            {/* <ScrollView showsHorizontalScrollIndicator={false} overScrollMode="never"> */}

            <View style={{ flexDirection: 'column', gap: 16 }}>



              <FlatList
                data={allTaskCards}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TaskBox
                    taskTitle={item.title}
                    taskDescription={item.description}
                    imageSource={item.profilePicture} // Or dynamic if needed
                    personName={item.firstName || 'Unknown'}
                    dateTime={item.createdAt}
                    taskStatus={item.taskStatus}
                    onPress={() => navigate('TaskDetailsScreen', { taskId: item.id })}
                    onDelete={() => deleteTask(item.id, item.attachedImage)}
                  />
                )}
              />





            </View>

            {/* </ScrollView> */}

            </>
          }
          </LinearGradient>
          <BottomNav backgroundColor="#F5A115" />
        </CustomSafeAreaView>

      </View>
    </>
  );
};



const styles = StyleSheet.create({

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    alignItems: 'center',
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
    // ...StyleSheet.absoluteFillObject,
    padding: 16,
    paddingBottom: 75,
    // paddingTop: 100,
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },


  // yellow: {
  //   padding: 16,
  //   flex: 1, backgroundColor: '#FAB90A',
  //   borderTopLeftRadius: 12,
  //   borderTopRightRadius: 12,
  // },
  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  itemText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#555' },
});

export default HomeScreen;