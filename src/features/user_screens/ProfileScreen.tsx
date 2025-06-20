import { View, Text, StyleSheet, Alert, Button, TouchableOpacity, Image, Animated, ScrollView, TouchableWithoutFeedback, Modal } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
// import { firebase } from "../../../firebaseConfig";
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging';
import TitleText from '@components/global/Titletext';
import ToggleSwitch from '@components/global/ToggleSwitch';
import InputField from '@components/global/InputField';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '@components/global/BottomModal';




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

  const [isModalVisible, setModalVisible] = useState(false);

  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);




  const [isOn, setIsOn] = useState(false);
  const knobPosition = useRef(new Animated.Value(6)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 6 : 38;
    Animated.timing(knobPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(prev => !prev);
  };




  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10 }}>
            <TitleText style={styles.tts}>
              Profile
            </TitleText>
            <TouchableOpacity onPress={openModal} >
              <Image
                source={require('../../assets/images/bars.png')}
                style={styles.image}
              />
            </TouchableOpacity>

            <Modal
              visible={visible}
              animationType="fade"
              transparent
              onRequestClose={closeModal}
            >
              <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.overlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.menuBox}>
                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Edit DP</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}
                      >
                        <Text style={styles.buttonText}>Edit Details</Text>
                      </TouchableOpacity>



                      <BottomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
                        <View style={{ gap: 16 }}>
                          <View>

                            <TitleText style={styles.labeltext}>First Name</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="First Name"
                              autoCapitalize="none"
                            />

                          </View>
                          <View>

                            <TitleText style={styles.labeltext}>Last Name</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="Last Name"
                              autoCapitalize="none"
                            />

                          </View>
                          <View>

                            <TitleText style={styles.labeltext}>Email</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="Enter your email"
                              autoCapitalize="none"
                            />

                          </View>

                          <View>

                            <TitleText style={styles.labeltext}>Phone Number</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="Phone Number"
                              autoCapitalize="none"
                            />

                          </View>
                          <View>

                            <TitleText style={styles.labeltext}>Address Line 1</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="Flat No / Apartment Name / Street"
                              autoCapitalize="none"
                            />

                          </View>

                          <View>

                            <TitleText style={styles.labeltext}>Address Line 2</TitleText>
                            <InputField
                              style={styles.input1}
                              placeholder="Land Mark / Near "
                              autoCapitalize="none"
                            />

                          </View>
                          <TouchableOpacity style={styles.orangebutton} >
                  <TitleText style={styles.orangebtntext}>
                    Save
                  </TitleText>
                </TouchableOpacity>


                        </View>
                      </BottomModal>

                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={handleLogout}>Logout</Text>

                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

          <ScrollView>



            <View style={{ flexDirection: 'column', paddingVertical: 8, paddingHorizontal: 12, gap: 16 }}>

              <LinearGradient
                colors={['#FECC01', '#F49C16']}
                style={styles.gradientBorder}
              >
                <View style={styles.innerCircle}>
                  <Image
                    source={{ uri: 'https://i.imgur.com/WxNkKAl.jpeg' }}
                    style={styles.image2}
                  />
                </View>
              </LinearGradient>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TitleText style={styles.poptext}>
                  Admin
                </TitleText>

                <ToggleSwitch
                  isOn={isOn}
                  toggleSwitch={toggleSwitch}
                  knobPosition={knobPosition}
                />


              </View>

              <View>

                <TitleText style={styles.labeltext}>First Name</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="First Name"
                  autoCapitalize="none"
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Last Name</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Last Name"
                  autoCapitalize="none"
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Email</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                />

              </View>

              <View>

                <TitleText style={styles.labeltext}>Phone Number</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Phone Number"
                  autoCapitalize="none"
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Address Line 1</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Flat No / Apartment Name / Street"
                  autoCapitalize="none"
                />

              </View>

              <View>

                <TitleText style={styles.labeltext}>Address Line 2</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Land Mark / Near "
                  autoCapitalize="none"
                />

              </View>









            </View>


          </ScrollView>

        </View>
        <BottomNav />
      </CustomSafeAreaView>

    </View>




  )
}

const styles = StyleSheet.create({


  orangebtntext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  orangebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FECC01',
    padding: 12,
    borderRadius: 25,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuBox: {
    backgroundColor: '#ffffff',
    padding: 6,
    gap: 6,
    marginTop: 30,
    marginLeft: 'auto',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  button: {
    borderWidth: 1,
    borderColor: '#e0dcd6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    // marginVertical: 5,
    borderRadius: 6,
    width: 143,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  gradientBorder: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  innerCircle: {
    borderWidth: 6,
    borderColor: '#fff',
    width: 133,
    height: 133,
    borderRadius: 65,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image2: {
    width: '100%',
    height: '100%',
  },

  input1: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    padding: 16,
    borderRadius: 8,
    color: "#291C0A",
  },

  labeltext: {
    fontWeight: 400,
    fontSize: 15,
    marginBottom: 8,
    color: '#291C0A',
  },

  poptext: {
    fontSize: 15,
    fontWeight: 400,
  },
  tts: {
    fontWeight: '500',
    fontSize: 20,
  },

  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },

  image: {
    width: 24,
    height: 20,
  },
})
export default ProfileScreen