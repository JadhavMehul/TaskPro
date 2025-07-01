import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        <View style={styles.modalbtn}></View>
        {children}

      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',

  },

  modalbtn: {
    height: 4,
    width: '20%',
    borderRadius: 11,
    backgroundColor: '#cccccc',

    marginLeft: 'auto',
    marginRight: 'auto',

  }
});
