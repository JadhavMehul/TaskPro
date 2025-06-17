import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
};

const Toast = ({ message, type }: ToastProps) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  const backgroundColor = type === 'success' ? '#D1FADF' : '#FEE4E2';
  const iconColor = type === 'success' ? '#12B76A' : '#F04438';
  const iconName = type === 'success' ? 'check-circle' : 'x-circle';

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 10,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
    style={[
      styles.toast,
      {
        backgroundColor,
        transform: [{ translateY }],
      },
    ]}
  >
    <Feather name={iconName} size={20} color={iconColor} style={styles.icon} />
    <Text style={styles.message}>{message}</Text>
  </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 24,

    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 24,
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
    paddingRight: 16,
  },
});

export default Toast;
