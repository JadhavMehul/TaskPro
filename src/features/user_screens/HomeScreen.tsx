import React, { useEffect, useState } from 'react';
import { firebase } from "../../../firebaseConfig";
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { navigate } from '@utils/NavigationUtils';

const HomeScreen = () => {
  const user = firebase.auth().currentUser;
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [allTaskCards, setAllTaskCards] = React.useState<string[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Try again.');
      console.error('Logout error:', error);
    }
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
    <View style={styles.container}>

      <FlatList
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
      <Text style={styles.title}>🏠 HomeScreen</Text>
      <Button title="Logout" onPress={handleLogout} color="#ff4d4d" />
      {/* <Button title="btn" onPress={fetchTaskCard} color="#ff4d4d" /> */}
      {(userIsAdmin) && (
        <Button title="Add Task" onPress={() => navigate('AddTask')} color="#0badf5" />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  itemText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#555' },
});
