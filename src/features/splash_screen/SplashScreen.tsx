import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@utils/Constants'
import AppLogo from "@assets/images/AppLogo.png";
import { screenHeight, screenWidth } from '@utils/Scaling';
import { navigate } from '@utils/NavigationUtils';

const SplashScreen = () => {

  useEffect(() => {

    const navigateUser = async () => {
      try {
        navigate("LoginScreen")
      } catch (error) {
        console.log("error on splash screen");
        
      }
    }

    const timeoutId = setTimeout(navigateUser, 2000)
    return () => clearTimeout(timeoutId)

  },[])

  return (
    <View style={styles.splashScreenBackground}>
      <Image source={AppLogo} style={styles.logoImage} />
    </View>
  )
}

const styles = StyleSheet.create({
  splashScreenBackground: {
    backgroundColor: Colors.Primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    height: screenHeight * 0.2,
    width: screenWidth * 0.2,
    resizeMode: 'contain'
  }
})

export default SplashScreen