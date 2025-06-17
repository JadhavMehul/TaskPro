import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { firebase } from "../../../firebaseConfig";
import { navigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import InputField from '@components/global/InputField';
import YellowButton from '@components/global/YellowButton';
import Toast from '@components/global/Toast'; 

const ForgetScreen = () => {
  const [email, setEmail] = useState('');
  const isDisabled = !email ;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendLink = async () => {
    setModalVisible(true);

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('Email Sent', 'Reset password email has been sent.', [
        { text: 'OK', onPress: () => navigate('LoginScreen') },
      ]);
    } catch (error: any) {
      setToast({ message: 'Something went wrong, please try again later.', type: 'error' });
    } finally {
      setModalVisible(false);
    }
  };



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
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <TitleText style={styles.titletext}>Forgot Password</TitleText>
              <View style={{ height: 24 }} />
              <TitleText style={styles.textualtext}>
                Enter your email and we will send password reset link on your registered email to recover the password
              </TitleText>
              <View style={{ height: 16 }} />
              <TitleText style={styles.labeltext}>Email</TitleText>
              <InputField
                style={styles.input1}
                placeholder="Enter your email"
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <View style={{ height: 16 }} />
            </ScrollView>

            <View style={styles.endcontainer}>
              <YellowButton title="Send Link" onPress={handleSendLink} disabled={!email }/>
              <TouchableOpacity onPress={() => navigate('LoginScreen')}>
                <TitleText style={styles.link}>
                  Back To <TitleText style={styles.link2}> Sign In</TitleText>
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
    textualtext: {
        fontWeight: 400,
        fontSize: 14,
        textAlign: 'center',
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
    color: '#FECC01',
  },
  
  input: { marginBottom: 15, borderBottomWidth: 1, color: 'black' },
  link: { color: '#101010', marginTop: 15, fontWeight: 600,fontSize: 14,},
  link2: { color: '#F49D16', marginTop: 15, fontWeight: 600,fontSize: 14,}
});


export default ForgetScreen












