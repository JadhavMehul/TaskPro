import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@utils/NavigationUtils';
import { BackHandler } from 'react-native';

import SplashScreen from '@features/splash_screen/SplashScreen';
import LoginScreen from '@features/auth/LoginScreen';
import RegisterScreen from '@features/auth/RegisterScreen';
import HomeScreen from '@features/user_screens/HomeScreen';
import AddTask from '@features/admin_screens/AddTask';
import TaskListScreen from '@features/user_screens/TaskListScreen';
import TaskScreen from '@features/user_screens/TaskScreen';
import ForgetScreen from '@features/auth/ForgetScreen';
import ProfileScreen from '@features/user_screens/ProfileScreen';
import AdminScreen from '@features/user_screens/AdminScreen';
import TaskDetailsScreen from '@features/user_screens/TaskDetailsScreen';

import notifee, { AndroidImportance, AndroidStyle, AuthorizationStatus, EventType } from '@notifee/react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import messaging from "@react-native-firebase/messaging";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    async function requestUserPermission() {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission settings:', settings);
      } else {
        console.log('User declined permissions');
      }

    }
    requestUserPermission();
    

    // Create a notification channel for Android
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // Set high importance for urgent notifications
        sound: 'default',
      });
    };

    createNotificationChannel();

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log("Notification foreground received", remoteMessage);

      const imageUrl = remoteMessage.notification?.android?.imageUrl;

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || 'Check out this update',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          pressAction: { id: 'default' },
          style: imageUrl ? { type: AndroidStyle.BIGPICTURE, picture: imageUrl } : undefined,
        }
      });
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Notification background received", remoteMessage);

      const imageUrl = remoteMessage.notification?.android?.imageUrl;

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification 2',
        body: remoteMessage.notification?.body || 'Check out this update 2',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          pressAction: { id: 'default' },
          style: imageUrl
            ? { type: AndroidStyle.BIGPICTURE, picture: imageUrl }
            : undefined,
        },
      });
    });

    // Set up background event handler for Notifee
    const unsubscribeOnBackgroundEvent = notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('Notifee background event:', type, detail);

      if (type === EventType.PRESS) {
        // Handle notification press action
        console.log('Notification was pressed in background:', detail.notification);
      }
    });



    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return () => {
      subscriber
      unsubscribeOnMessage();
      unsubscribeOnBackgroundEvent
    };
  }, []);

  useEffect(() => {
    if (!isShowSplash) {
      if (!user) {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      }
    }
  }, [isShowSplash, user]);

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ForgetScreen" component={ForgetScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
        <Stack.Screen name="TaskScreen" component={TaskScreen} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
