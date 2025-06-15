import React, { useEffect, useState } from 'react'
import { firebase } from './firebaseConfig';


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


const Stack = createNativeStackNavigator();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);

  function onAuthStateChanged(user: firebase.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>

        {isShowSplash ? (
          <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }} />
        ) : !user ? (
          <>
            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ForgetScreen' component={ForgetScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='TaskListScreen' component={TaskListScreen} options={{ headerShown: false }} />
            <Stack.Screen name='TaskScreen' component={TaskScreen} options={{ headerShown: false }} />
            <Stack.Screen name='AddTask' component={AddTask} options={{ headerShown: false }} />
          </>
        )}


      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
