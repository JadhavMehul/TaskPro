import React, { useEffect, useState } from 'react'
// import { firebase } from "../../../firebaseConfig";
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Modal, ActivityIndicator } from 'react-native'
import { navigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import InputField from '@components/global/InputField';
import Feather from '@react-native-vector-icons/feather';
import YellowButton from '@components/global/YellowButton';
import { ScrollView } from 'react-native';
import Toast from '@components/global/Toast'; // 👈 import toast
import auth from '@react-native-firebase/auth'


const LoginScreen = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  const isDisabled = !email || !password;

  const handleLogin = async () => {
    setModalVisible(true);
    try {
      await auth().signInWithEmailAndPassword(email, password)
      setModalVisible(false);
    } catch (error: unknown) {
      const firebaseError = error as { code: string; message: string };
      const cleanedCode = firebaseError.code.replace('auth/', '');
      setModalVisible(false);
      setToast({ message: cleanedCode, type: 'error' });
    }
  };

  // auto-hide toast
    useEffect(() => {
      if (toast) {
        const timeout = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timeout);
      }
    }, [toast]);

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
            {toast && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999 }}>
                <Toast message={toast.message} type={toast.type} />
              </View>
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }} // space for fixed footer
            >
              <TitleText style={styles.titletext}>Sign In</TitleText>
  
              <TitleText style={styles.labeltext}>Email</TitleText>
              <InputField
                style={styles.input1}
                placeholder="Enter your email"
                onChangeText={setEmail}
                autoCapitalize="none"
              />
  
              <View style={{ height: 16 }} />
  
              <TitleText style={styles.labeltext}>Password</TitleText>
              <View style={styles.inputWrapper}>
                <InputField
                  placeholder="Enter your password"
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


              <TouchableOpacity onPress={() => navigate('ForgetScreen')}>
              <TitleText style={styles.forgottext}>Forgot Password?</TitleText>
              </TouchableOpacity>
  
              



            </ScrollView>
  
            <View style={styles.endcontainer}>
              <YellowButton title="Sign In" onPress={handleLogin} disabled={!email || !password}/>
              <TouchableOpacity onPress={() => navigate('RegisterScreen')}>
                <TitleText style={styles.link}>
                  Don't have an account?
                  <TitleText style={styles.link2}> Sign Up</TitleText>
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
  endcontainer : {
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


  forgottext : {
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
    color: '#FAB90A',
  },
  
  input: { marginBottom: 15, borderBottomWidth: 1, color: 'black' },
  link: { color: '#101010', marginTop: 15, fontWeight: 600,fontSize: 14,},
  link2: { color: '#F49D16', marginTop: 15, fontWeight: 600,fontSize: 14,}
});


export default LoginScreen












