
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';


type ToastProps = {
  message: string;
  type: 'success' | 'error';
};

const Toast = ({ message, type }: ToastProps) => {
  const backgroundColor = type === 'success' ? '#D1FADF' : '#FEE4E2';
  const iconColor = type === 'success' ? '#12B76A' : '#F04438';
  const iconName = type === 'success' ? 'check-circle' : 'x-circle';

  return (
    <View style={[styles.toast, { backgroundColor }]}>
      <Feather name={iconName} size={20} color={iconColor} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    // marginHorizontal: 16,
    marginTop: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#101828',
  },
});

export default Toast;
