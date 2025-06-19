import React, { useEffect, useState } from 'react';
// import { firebase } from "../../../firebaseConfig";
import { Picker } from '@react-native-picker/picker';

import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Alert, Modal, ActivityIndicator } from 'react-native'
import { navigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import InputField from '@components/global/InputField';
import Feather from '@react-native-vector-icons/feather';
import YellowButton from '@components/global/YellowButton';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


const RegisterScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  // const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

  // const [fetchedPromoCode, setFetchedPromoCode] = useState<{ adminCode: string; userCode: string }>({
  //   adminCode: '',
  //   userCode: '',
  // });



  const [checked, setChecked] = useState(false);

  const isDisabled = !email || !password || !firstName|| !lastName||!selectedGender||!cnfPassword||!promoCode||!checked;


  const getPromoCodes = async () => {
    try {
      const codeData = await firestore().collection("PromoCodes").doc("Code").get();

      if (!codeData.exists) {
        console.log("Promo code document not found");
        return null;
      } else {
        const data = codeData.data();
        if (data?.adminCode && data?.userCode) {
          return({
            adminCode: data.adminCode,
            userCode: data.userCode,
          });
        } else {
          console.log("Invalid promo code data structure");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updatePromo = async () => {
    const adminPromoCode = Math.floor(1000 + Math.random() * 9000).toString();
    const userPromoCode = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      await firestore().collection("PromoCodes").doc("Code").set({
        adminCode: adminPromoCode,
        userCode: userPromoCode
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleRegister = async (adminValue: boolean) => {
    try {
      setModalVisible(true);
      await auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;
        firestore().collection("UserAccounts").doc(email).set({
          userId: user?.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: selectedGender,
          isAdmin: adminValue
          // birthDate: birthDate,
        })
      }).then(() => {
        updatePromo();
      })
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      
      Alert.alert('Error', 'Internal server error please try again later.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      setModalVisible(false);
    }
  };


  const passChecker = async () => {
    const promoObject = await getPromoCodes();
    if (!promoObject) {
      Alert.alert('Error', 'Unable to fetch promo codes. Please try again later.');
      return;
    }

    if (password && cnfPassword !== "") {
      if (password === cnfPassword) {
        if (promoCode.toString() === promoObject.adminCode) {
          handleRegister(true)
        } else if (promoCode.toString() === promoObject.userCode) {
          handleRegister(false)
        } else {
          Alert.alert('Invalid Code', 'The promo code you entered is incorrect.');
        }
      } else {
        Alert.alert('Wrong Details', 'Entered password and confirm password are not same.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    } else {
      Alert.alert('Password & Confirm Password', 'Fields must not be empty', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

  }

  

  return (
    <View style={styles.container}>
      <View style={styles.inner_container}>
        <CustomSafeAreaView style={{ flex: 1 }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              {/* <View style={styles.activityIndicatorWrapper}> */}
                <ActivityIndicator size="large" color="#267EDF" />

                
              {/* </View> */}
            </View>
          </Modal>
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }} 
            >
              <TitleText style={styles.titletext}>Sign Up</TitleText>


              <TitleText style={styles.labeltext}>First Name</TitleText>
              <InputField
                style={styles.input1}
                placeholder="First Name"
                onChangeText={setFirstName}

              />
              <View style={{ height: 16 }} />

              <TitleText style={styles.labeltext}>Last Name</TitleText>
              <InputField
                style={styles.input1}
                placeholder="Last Name"
                onChangeText={setLastName}

              />
              <View style={{ height: 16 }} />


              {/* <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} /> */}
              {/* <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} /> */}
              {/* <Picker
                selectedValue={selectedGender}
                style={styles.input2} 
                onValueChange={(itemValue) => setSelectedGender(itemValue)}

              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker> */}





              <TitleText style={styles.labeltext}>Email</TitleText>
              <InputField
                style={styles.input1}
                placeholder="Email"
                onChangeText={setEmail} autoCapitalize="none"

              />
              <View style={{ height: 16 }} />

              <TitleText style={styles.labeltext}>Password</TitleText>

              <View style={styles.inputWrapper}>
                <InputField
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  onChangeText={setPassword}
                  style={styles.inputWithIcon}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Feather
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ height: 16 }} />

              <TitleText style={styles.labeltext}>Confirm Password</TitleText>

              <View style={styles.inputWrapper}>
                <InputField
                  placeholder="Confirm Password"
                  secureTextEntry={!passwordVisible2}
                  onChangeText={setCnfPassword}
                  style={styles.inputWithIcon}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible2(!passwordVisible2)}
                >
                  <Feather
                    name={passwordVisible2 ? 'eye' : 'eye-off'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>


              <View style={{ height: 16 }} />
              <View style={styles.rowcon}>

                <View style={{ width: '45%' }}>
                  <TitleText style={styles.labeltext}>Promo Code</TitleText>
                  <InputField
                    placeholder="Promo Code" style={styles.input1} secureTextEntry onChangeText={setPromoCode}

                  />
                </View>

                <View style={{ width: '45%' }}>
                  <TitleText style={styles.labeltext}>Gender</TitleText>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedGender}
                      onValueChange={(itemValue) => setSelectedGender(itemValue)}
                      style={styles.pickerText} // only font styles like color, fontSize
                      dropdownIconColor="#999" // optional: customize dropdown arrow
                    >
                      <Picker.Item label="Gender" value="" />
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                </View>



              </View>

              <View style={styles.containercheck}>
                <TouchableOpacity
                  onPress={() => setChecked(!checked)}
                  style={[
                    styles.checkbox,
                    checked ? styles.checkedBox : styles.uncheckedBox,
                  ]}
                >
                  {checked && <Feather name="check" size={18} color="#fff" />}
                </TouchableOpacity>

                <TitleText style={styles.textterms}>
                  I Agree with{'  '}
                  <TitleText style={styles.linkterms}>
                    Terms of Service
                  </TitleText>{'  '}
                  and{'  '}
                  <TitleText style={styles.linkterms} >
                    Privacy Policy
                  </TitleText>
                </TitleText>
              </View>


              <View style={{ height: 16 }} />

              {/* <TextInput placeholder="Birth Date" style={styles.input} secureTextEntry onChangeText={setBirthDate} /> */}
              {/* <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} autoCapitalize="none" /> */}
              {/* <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} /> */}
              {/* <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry onChangeText={setCnfPassword} /> */}
              {/* <TextInput placeholder="Promo Code" style={styles.input} secureTextEntry onChangeText={setPromoCode} /> */}
              {/* <Button title="Register" onPress={passChecker} /> */}

            </ScrollView>
            <View style={styles.endcontainer}>
              <YellowButton title="Register" onPress={passChecker} disabled={!email || !password || !firstName|| !lastName||!selectedGender||!cnfPassword||!promoCode||!checked}/>
              <TouchableOpacity onPress={() => navigate('LoginScreen')}>
                <TitleText style={styles.link}>
                  Have a account?
                  <TitleText style={styles.link2}>  Sign In</TitleText>
                </TitleText>
              </TouchableOpacity>
            </View>
          </View>
        </CustomSafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Grey background color with 50% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  containercheck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FDC201',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2, 
  },
  checkedBox: {
    backgroundColor: '#FDC201',
  },
  uncheckedBox: {
    backgroundColor: '#FAF8F5',
    borderWidth: 2,
    borderColor: '#FDC201',
  },
  textterms: {
    // flex: 1,
    color: '#29220A',
    fontSize: 14,
    // flexWrap: 'wrap',
    fontWeight: '500',
  },
  linkterms: {
    fontSize: 14,
    color: '#F49D16',
    fontWeight: '500',
  },

  pickerWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },

  pickerText: {
    fontSize: 16,
    color: '#291C0A', // apply text styling here
  },

  rowcon: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  endcontainer: {
    position: 'absolute',
    width: '100%',
    paddingTop: 16,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#FAF8F5',

  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },

  inputWithIcon: {
    paddingRight: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    color: "#291C0A",
  },


  forgottext: {
    fontWeight: 500,
    fontSize: 15,
    color: '#F49C16',
    textAlign: 'right',
  },

  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  container: {
    padding: 6,
    borderRadius: 12,
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inner_container: {
    paddingLeft: 24,
    paddingRight: 24,
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  input1: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
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
  titletext: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 28,
    color: '#FECC01',
  },

  input: { marginBottom: 15, borderBottomWidth: 1, color: 'black' },
  link: { color: '#101010', marginTop: 15, fontWeight: 600, fontSize: 14, },
  link2: { color: '#F49D16', marginTop: 15, fontWeight: 600, fontSize: 14, }
});


export default RegisterScreen;
