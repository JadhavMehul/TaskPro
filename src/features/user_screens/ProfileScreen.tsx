import { View, Text, StyleSheet, Alert, Button, TouchableOpacity, Image, Animated, ScrollView, TouchableWithoutFeedback, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
// import { firebase } from "../../../firebaseConfig";
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import messaging from '@react-native-firebase/messaging';
import TitleText from '@components/global/Titletext';
import ToggleSwitch from '@components/global/ToggleSwitch';
import InputField from '@components/global/InputField';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '@components/global/BottomModal';
import firestore from '@react-native-firebase/firestore';
import { StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';






const handleLogout = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    Alert.alert('Error', 'Failed to logout. Try again.');
    console.error('Logout error:', error);
  }
};


const ProfileScreen = () => {

  // Modal input states
  const [formData, setFormData] = useState({
    profilePicture: '',
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
    phoneNumber: '',
    addressLineOne: '',
    addressLineTwo: '',
  });



  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
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


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadUserData = async () => {
    setActivityIndicator(true)
    try {
      const currentUser = auth().currentUser;

      if (currentUser?.email) {

        const storedData = await firestore()
          .collection('UserAccounts')
          .doc(currentUser.email).get()

        if (storedData.exists()) {
          const data = storedData.data();
          setFormData({
            profilePicture: data?.profilePicture || 'https://firebasestorage.googleapis.com/v0/b/task-pro-1.firebasestorage.app/o/global%2FprofileIcon.png?alt=media&token=35dcbb4b-bf4e-4e91-ac0a-25a5b600b422',
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            email: data?.email || '',
            isAdmin: data?.isAdmin || false,
            phoneNumber: data?.phone || '',
            addressLineOne: data?.addressLineOne || '',
            addressLineTwo: data?.addressLineTwo || '',
          });
          console.log(data);

          setIsOn(data?.isAdmin || false);
          setUserIsAdmin(data?.isAdmin || false);
        }

        setActivityIndicator(false)
      } else {
        console.warn('No user signed in, cannot update data');
        setActivityIndicator(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleUploadImage = async () => {
    console.log('pressed me');

    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      async (response) => {
        const asset = response.assets?.[0];

        if (response.didCancel || response.errorCode || !asset?.uri || !asset.type) {
          console.log('Image selection cancelled or invalid.');
          return;
        }

        try {
          const { uri, type } = asset;
          // const fileExt = type.split('/')[1] || 'jpg';
          // const path = `profilePictures/${formData.email}/profile.${fileExt}`;
          
          const reference = storage().ref(uri);
          
        } catch (err) {
          console.log('Upload failed:', err);
        }
      }
    );
  };


  const handleProfileEdit = async (formData: { firstName: string; lastName: string; phoneNumber: string; addressLineOne: string; addressLineTwo: string; }) => {
    setActivityIndicator(true)
    const updateObject = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber,
      addressLineOne: formData.addressLineOne,
      addressLineTwo: formData.addressLineTwo,
    }

    try {
      const currentUser = auth().currentUser;


      if (currentUser?.email) {
        await firestore()
          .collection('UserAccounts')
          .doc(currentUser.email)
          .set(updateObject, { merge: true });
        console.log('data updated to Firestore');
        setActivityIndicator(false)
      } else {
        console.warn('No user signed in, cannot update data');
        setActivityIndicator(false);
      }
    } catch (error) {
      console.log(error);
      setActivityIndicator(false);
    }


  }

  useEffect(() => {
    loadUserData()
  }, [])


  return (
    <View style={styles.inner_container}>

      <CustomSafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#FAF8F5' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10 }}>
            <TitleText style={styles.tts}>
              Profile
            </TitleText>
            <TouchableOpacity onPress={openModal} >
              <Image
                source={require('@assets/images/bars.png')}
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
                      <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
                        <Text style={styles.buttonText}>Edit DP</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={() => {
                        loadUserData();
                        setModalVisible(true);
                      }}>
                        <Text style={styles.buttonText}>Edit Details</Text>
                      </TouchableOpacity>



                      <BottomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
                        <ScrollView>
                          <View style={{ gap: 16, }}>

                            {activityIndicator ?
                              <ActivityIndicator size="large" color="#FECC01" /> :

                              <>

                                <View>

                                  <TitleText style={styles.labeltext}>First Name</TitleText>
                                  <InputField
                                    style={styles.input1}
                                    placeholder="First Name"
                                    autoCapitalize="none"
                                    value={formData.firstName}
                                    onChangeText={(text) => handleInputChange('firstName', text)}
                                  />

                                </View>
                                <View>

                                  <TitleText style={styles.labeltext}>Last Name</TitleText>
                                  <InputField
                                    style={styles.input1}
                                    placeholder="Last Name"
                                    autoCapitalize="none"
                                    value={formData.lastName}
                                    onChangeText={(text) => handleInputChange('lastName', text)}
                                  />

                                </View>


                                <View>

                                  <TitleText style={styles.labeltext}>Phone Number</TitleText>
                                  <InputField
                                    style={styles.input1}
                                    placeholder="Phone Number"
                                    autoCapitalize="none"
                                    value={formData.phoneNumber}
                                    onChangeText={(text) => handleInputChange('phoneNumber', text)}
                                  />

                                </View>
                                <View>

                                  <TitleText style={styles.labeltext}>Address Line 1</TitleText>
                                  <InputField
                                    style={styles.input1}
                                    placeholder="Flat No / Apartment Name / Street"
                                    autoCapitalize="none"
                                    value={formData.addressLineOne}
                                    onChangeText={(text) => handleInputChange('addressLineOne', text)}
                                  />

                                </View>

                                <View>

                                  <TitleText style={styles.labeltext}>Address Line 2</TitleText>
                                  <InputField
                                    style={styles.input1}
                                    placeholder="Land Mark / Near "
                                    autoCapitalize="none"
                                    value={formData.addressLineTwo}
                                    onChangeText={(text) => handleInputChange('addressLineTwo', text)}
                                  />

                                </View>








                              </>}

                          </View>
                        </ScrollView>

                        <View style={styles.endcontainer}>
                          <TouchableOpacity style={styles.orangebutton} onPress={() => { handleProfileEdit(formData) }} >
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
                    source={{ uri: formData.profilePicture }}
                    style={styles.image2}
                  />
                </View>
              </LinearGradient>

              {
                userIsAdmin &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TitleText style={styles.poptext}>
                    Admin
                  </TitleText>

                  <ToggleSwitch
                    isOn={isOn}
                    toggleSwitch={toggleSwitch}
                    knobPosition={new Animated.Value(isOn ? 38 : 2)}
                  />
                </View>
              }

              <View>

                <TitleText style={styles.labeltext}>First Name</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="First Name"
                  autoCapitalize="none"
                  value={formData.firstName}
                  editable={false}
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Last Name</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Last Name"
                  autoCapitalize="none"
                  value={formData.lastName}
                  editable={false}
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Email</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  value={formData.email}
                  editable={false}
                />

              </View>

              <View>

                <TitleText style={styles.labeltext}>Phone Number</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  value={formData.phoneNumber}
                  editable={false}
                />

              </View>
              <View>

                <TitleText style={styles.labeltext}>Address Line 1</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Flat No / Apartment Name / Street"
                  autoCapitalize="none"
                  value={formData.addressLineOne}
                  editable={false}
                />

              </View>

              <View>

                <TitleText style={styles.labeltext}>Address Line 2</TitleText>
                <InputField
                  style={styles.input1}
                  placeholder="Land Mark / Near "
                  autoCapitalize="none"
                  value={formData.addressLineTwo}
                  editable={false}
                />

              </View>









            </View>


          </ScrollView>

        </View>
        <BottomNav backgroundColor="#FAF8F5" />
      </CustomSafeAreaView>

    </View>




  )
}

const styles = StyleSheet.create({

  endcontainer: {
    width: '100%',
    paddingTop: 16,
    bottom: 0,
    backgroundColor: '#fff',

  },


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