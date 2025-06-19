import React, { useEffect, useState } from 'react';
// import { firebase } from "../../../firebaseConfig";
import { View, Text, Button, StyleSheet, Alert, Image, FlatList, TouchableOpacity } from 'react-native';
import { navigate } from '@utils/NavigationUtils';
import BottomNav from '@components/global/BottomBar';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import Feather from '@react-native-vector-icons/feather';
import Modal from 'react-native-modal';
import BottomModal from '@components/global/BottomModal';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


const HomeScreen = () => {
  const user = auth().currentUser;
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [allTaskCards, setAllTaskCards] = React.useState<string[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);





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

  const fetchTaskCard = async () => {
    setRefreshing(true);
    try {
      const doc = await firestore().collection('TaskList').get();
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
        <View style={styles.yellow}>


          <View style={styles.dropsection}>
            <View style={styles.addtask}>
              <TitleText>
                Add task
              </TitleText>
              <Image
                source={require('../../assets/images/edit.png')}
                style={styles.image}
              />
            </View>

            <View style={styles.addtask}>
              <TitleText>
                Assigned To
              </TitleText>
              <Image
                source={require('../../assets/images/downarrow.png')}
                style={styles.image2}
              />
            </View>

          </View>

          <TouchableOpacity onPress={() => navigate('TaskDetailsScreen')}>
            <View style={styles.taskbox}>

              <View style={styles.topbox}>

                <View style={styles.lefttop}>
                  <TitleText style={styles.tasktitle}>
                    Task Title
                  </TitleText>
                  <TitleText style={styles.taskdescription}>
                    Lorem ipsum is a dummy or placeholde text commonly used ...
                  </TitleText>
                </View>
                <View style={styles.righttop}>
                  <View style={styles.circle}>
                    <Image
                      source={require('../../assets/images/home_fill.png')}
                      style={styles.circleImage} />

                  </View>

                  <TitleText style={styles.personName}>
                    Mehul
                  </TitleText>

                </View>

              </View>

              <View style={styles.aline}>

              </View>

              <View style={styles.bottombox}>

                <View style={styles.leftbottom}>
                  <TitleText style={styles.datetime}>
                    30 May 2025 - 11:24 AM
                  </TitleText>
                </View>


                <TouchableOpacity ><Feather name="trash" size={24} color="red" /></TouchableOpacity>
               

               



              </View>

            </View>

          </TouchableOpacity>





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



        </View>
        <BottomNav />
      </CustomSafeAreaView>

    </View>
  );
};



const styles = StyleSheet.create({


 
 
  
  

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

  datetime: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
  },

  leftbottom: {
    width: '70%',
    // backgroundColor: 'red',
  },

  bottombox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',

  },

  aline: {
    height: 1,
    width: '100%',
    backgroundColor: '#E7E2DA',
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
    justifyContent: 'space-between',
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

  lefttop: {
    width: '74%',
    // backgroundColor: 'red',
    flexDirection: 'column',
    gap: 24,
  },

  topbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  taskbox: {

    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,

    flexDirection: 'column',
    gap: 8,
  },
  yellow: {
    padding: 16,
    flex: 1, backgroundColor: '#FAB90A',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
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