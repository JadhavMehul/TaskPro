import { View, Text,StyleSheet,Alert,Button } from 'react-native'
import React from 'react'
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
// import { firebase } from "../../../firebaseConfig";
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging';

const handleLogout = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    Alert.alert('Error', 'Failed to logout. Try again.');
    console.error('Logout error:', error);
  }
};

const getToken = async () => {
  try {
    // await messaging().requestPermission();
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
};

const ProfileScreen = () => {
  return (
    <View style={styles.inner_container}>
        <CustomSafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
          <Button title="Logout" onPress={handleLogout} color="#ff4d4d" />
          <Button title="Token" onPress={getToken} color="#ff4d4d" />
          </View>
          <BottomNav />
        </CustomSafeAreaView>
        
      </View>

     
    
 
  )
}

const styles = StyleSheet.create({ 

    inner_container: {
        flex: 1,
        backgroundColor: "#FAF8F5",
        borderRadius: 12,
      },
})
export default ProfileScreen