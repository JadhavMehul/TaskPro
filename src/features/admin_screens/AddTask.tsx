import React, { useEffect, useState } from 'react';
import { firebase } from '../../../firebaseConfig';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddTask = () => {
  const user = firebase.auth().currentUser;
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const createTask = async () => {
    const task = {
      createdBy: [{userId: user?.uid, userEmail: user?.email}],
      taskTitle,
      taskDescription,
      assignedTo,
      createdAt: new Date(),  // <-- Use client timestamp here
    };
  
    const dateDocRef = firebase.firestore().collection("TaskList").doc(formattedDate);
  
    try {
      await dateDocRef.update({
        taskList: firebase.firestore.FieldValue.arrayUnion(task),
      });
      console.log("Task added to array!");
    } catch (error) {
      const err = error as any;
      if (err.code === 'not-found' || err.message.includes("No document to update")) {
        // Document doesn't exist — create it with the array containing the task
        await dateDocRef.set({
          taskList: [task],
        });
        console.log("Document created and task added!");
      } else {
        console.error("Error adding task: ", error);
      }
    }
  };
  
  useEffect(() => {
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
              console.log('isAdmin:', userData.isAdmin);
            } else {
              console.log('isAdmin field not found in user data');
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

    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
      <TextInput placeholder="Task Title..." style={styles.input} onChangeText={setTaskTitle} />
      <TextInput
        style={styles.textarea}
        multiline={true}
        placeholder="Task Description..."
        value={taskDescription}
        onChangeText={setTaskDescription}
        textAlignVertical="top"
      />
      <Picker
        selectedValue={assignedTo}
        onValueChange={(itemValue) => setAssignedTo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Assign To..." value="" />
        <Picker.Item label="taklu" value="taklu" />
        <Picker.Item label="maklu" value="maklu" />
        <Picker.Item label="baklu" value="baklu" />
      </Picker>
      <Button title="add task" onPress={createTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  input: { marginBottom: 15, borderBottomWidth: 1, padding: 8, color: 'black' },
  picker: { height: 50, width: '100%' },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100, 
  },
});

export default AddTask;
