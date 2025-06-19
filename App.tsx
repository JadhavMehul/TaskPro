import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@utils/NavigationUtils';

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

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        {isShowSplash ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        ) : !user ? (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="ForgetScreen" component={ForgetScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
            <Stack.Screen name="TaskScreen" component={TaskScreen} />
            <Stack.Screen name="AddTask" component={AddTask} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
