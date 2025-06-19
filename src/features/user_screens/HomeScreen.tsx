import React, { useEffect, useState, useRef } from 'react';
import { firebase } from "../../../firebaseConfig";
import { View, Text, Button, StyleSheet, Animated, Alert, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { navigate } from '@utils/NavigationUtils';
import BottomNav from '@components/global/BottomBar';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import Feather from '@react-native-vector-icons/feather';
import Modal from 'react-native-modal';
import BottomModal from '@components/global/BottomModal';
import TaskBox from '@components/global/TaskBox';
import InputField from '@components/global/InputField';
import ToggleSwitch from '@components/global/ToggleSwitch';
import LinearGradient from 'react-native-linear-gradient';


type User2 = {
  id: string;
  name: string;
  image: string;
};

const users2: User2[] = [

  {
    id: '0',
    name: 'Assigned to',
    image: 'https://i.com/1Qf1Z0G.jpg',
  },
  
  {
    id: '1',
    name: 'Mehul',
    image: 'https://i.imgur.com/1Qf1Z0G.jpg',
  },
  {
    id: '2',
    name: 'Chris',
    image: 'https://i.imgur.com/1Qf1Z0G.jpg',
  },
];


const HomeScreen = () => {

  const [selectedUser2, setSelectedUser2] = useState<User2 | null>(null);
  const [showDropdown2, setShowDropdown2] = useState<boolean>(false);

  const handleSelect2 = (user2: User2) => {
    if (user2.id === '0') {
      setSelectedUser2(null);
    } else {
      setSelectedUser2(user2);
    }
    setShowDropdown2(false);
  };
  const renderUser2 = ({ item }: { item: User2 }) =>  {
    const isSelected2 = selectedUser2?.id === item.id;

    

    const content2 = (
      <View style={styles.userInner2}>
      <Image source={{ uri: item.image }} style={styles.avatar2} />
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















  const user = firebase.auth().currentUser;
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [allTaskCards, setAllTaskCards] = React.useState<string[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [isModalVisible, setModalVisible] = useState(false);

  const [isOn, setIsOn] = useState(false);
  const knobPosition = useRef(new Animated.Value(6)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 6 : 38; // move left/right based on toggle state
    Animated.timing(knobPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(prev => !prev);
  };





  const fetchUserData = async () => {
    if (user?.email) {
      try {
        const doc = await firebase.firestore()
          .collection('UserAccounts')
          .doc(user.email)
          .get();

        if (doc.exists) {
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

  const fetchTaskCard = async () => {
    setRefreshing(true);
    try {
      const doc = await firebase.firestore().collection('TaskList').get();
      const dateList = doc.docs.map(doc => doc.id);
      setAllTaskCards(dateList)
    } catch (error) {
      console.error("Error getting task dates:", error);
    }
    setRefreshing(false);
  };


  useEffect(() => {
    fetchUserData();
    fetchTaskCard();
  }, [user]);

  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        {/* <View style={styles.yellow}> */}
        <LinearGradient
        colors={['#FECC01', '#F49C16']}
        style={styles.gradientBox}
      >

     

          <View style={styles.dropsection}>

            <TouchableOpacity onPress={() => setModalVisible(true)}>

              <View style={styles.addtask}>
                <TitleText>
                  Add task
                </TitleText>
                <Image
                  source={require('../../assets/images/edit.png')}
                  style={styles.image}
                />
              </View>

            </TouchableOpacity>
            <BottomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
              <View style={{ flexDirection: 'column', gap: 16 }}>
                <TitleText style={styles.poptext}>
                  Title
                </TitleText>
                <InputField style={styles.input1}
                  placeholder="Task title"
                  autoCapitalize="none" />

                <TitleText style={styles.poptext}>
                  Description
                </TitleText>

                <InputField style={styles.input2}
                  placeholder="Description"
                  autoCapitalize="none"
                  textAlignVertical="top"
                  multiline
                  numberOfLines={4} />

                <View style={styles.namecard}>
                  <View style={styles.row}>
                    <View style={styles.circle}>
                      <Image
                        source={require('../../assets/images/home_fill.png')}

                        style={styles.circleImage}
                      />
                    </View>

                    <TitleText style={styles.personName}>Mehul</TitleText>
                  </View>

                  <TouchableOpacity>
                    <View style={styles.addtask}>
                      <TitleText>
                        Assign To
                      </TitleText>
                      <Image
                        source={require('../../assets/images/downarrow.png')}
                        style={styles.image2}
                      />
                    </View>

                  </TouchableOpacity>



                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TitleText style={styles.poptext}>
                    Need Permission?
                  </TitleText>

                  <ToggleSwitch
                    isOn={isOn}
                    toggleSwitch={toggleSwitch}
                    knobPosition={knobPosition}
                  />


                </View>
              </View>

              <View style={{ height: 100 }}>

              </View>



            </BottomModal>

            <TouchableOpacity 
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
)}

          </View>


          <ScrollView showsHorizontalScrollIndicator={false} overScrollMode="never">

            <View style={{ flexDirection: 'column', gap: 16 }}>



              <TaskBox
                taskTitle="Meeting with client"
                taskDescription="Discuss project requirements and timelines."
                imageSource={require('../../assets/images/home_fill.png')}
                personName="Mehul"
                dateTime="30 May 2025 - 11:24 AM"
                onPress={() => navigate('TaskDetailsScreen')}
                onDelete={() => console.log('Delete pressed')}
              />




            </View>

          </ScrollView>








          

      











                      {/* <FlatList
                    data={allTaskCards}
                    keyExtractor={(item) => item}
                    renderItem={({item}) => (
                      <TouchableOpacity onPress={() => navigate('TaskListScreen', { taskId: item })}>
                        <Text style={styles.itemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    onRefresh={fetchTaskCard}
                    refreshing={refreshing}
                    ListEmptyComponent={<Text style={styles.emptyText}>No task dates found</Text>}
                  />
                  
                  
                  <Button title="btn" onPress={fetchTaskCard} color="#ff4d4d" />
                  {(userIsAdmin) && (
                    <Button title="Add Task" onPress={() => navigate('AddTask')} color="#0badf5" />
                  )} */}



        {/* </View> */}
        </LinearGradient>
        <BottomNav />
      </CustomSafeAreaView>

    </View>
  );
};



const styles = StyleSheet.create({






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
    fontSize: 16,
    marginRight: 10,
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
    borderColor:'#E7E2DA',
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
  },


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
    // ...StyleSheet.absoluteFillObject,
    padding: 16,
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