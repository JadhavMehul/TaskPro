// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { navigationRef } from '@utils/NavigationUtils';
// import SplashScreen from '@features/splash_screen/SplashScreen';
// import LoginScreen from '@features/auth/LoginScreen';
// import RegisterScreen from '@features/auth/RegisterScreen';
// import HomeScreen from '@features/user_screens/HomeScreen';

// const Stack = createNativeStackNavigator();

// interface NavigationProps {
//   user: User | null; 
// }

// const Navigation: React.FC<NavigationProps> = ({ user }) => {
//   return (
//     <NavigationContainer ref={navigationRef}>
//       <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
//         {!user ? (
//           <>
//             <Stack.Screen name='SplashScreen' component={SplashScreen} />
//             <Stack.Screen options={{ animation: 'fade' }} name='LoginScreen' component={LoginScreen} />
//             <Stack.Screen options={{ animation: 'fade' }} name='RegisterScreen' component={RegisterScreen} />
//           </>
//         ) : (
//           <>
//             <Stack.Screen options={{ animation: 'fade' }} name='HomeScreen' component={HomeScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default Navigation;
