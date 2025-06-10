import React, { useState } from 'react'
import { firebase } from "../../../firebaseConfig";
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native'
import { navigate } from '@utils/NavigationUtils';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigate('RegisterScreen')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  input: { marginBottom: 15, borderBottomWidth: 1, padding: 8, color: 'black' },
  link: { color: 'blue', marginTop: 15 }
});


export default LoginScreen