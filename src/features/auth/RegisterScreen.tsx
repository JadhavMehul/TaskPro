import React, { useState } from 'react';
import { firebase } from "../../../firebaseConfig";
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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


  const handleRegister = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;
        firebase.firestore().collection("UserAccounts").doc(email).set({
          userId: user?.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: selectedGender,
          isAdmin: isAdmin
          // birthDate: birthDate,
        })
      })
    } catch (error) {
      console.log(error);
    }
  };


  const passChecker = () => {
    if (password && cnfPassword !== "") {
      if (password === cnfPassword) {
        if (promoCode === '2000') {
          setIsAdmin(true)
          handleRegister()
        } else {
          handleRegister()
        }
      } else {
        Alert.alert('Wrong Details', 'Entered password and confirm password are not same.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    } else {
      Alert.alert('Password & Confirm Password', 'Fields must not be empty', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} />
      <Picker
        selectedValue={selectedGender}
        onValueChange={(itemValue) => setSelectedGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      {/* <TextInput placeholder="Birth Date" style={styles.input} secureTextEntry onChangeText={setBirthDate} /> */}
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry onChangeText={setCnfPassword} />
      <TextInput placeholder="Promo Code" style={styles.input} secureTextEntry onChangeText={setPromoCode} />
      <Button title="Register" onPress={passChecker} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  input: { marginBottom: 15, borderBottomWidth: 1, padding: 8, color: 'black' },
  picker: { height: 50, width: '100%' },
});

export default RegisterScreen;
