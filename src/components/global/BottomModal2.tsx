import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface BottomModal2Props {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const BottomModal2: React.FC<BottomModal2Props> = ({ isVisible, onClose, children }) => {
    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={onClose}
            style={styles.modal}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton2}
                >
                    <Text style={styles.closeButtonText2}>×</Text>
                </TouchableOpacity>
                <View style={styles.modalbtn}></View>
                {children}

            </View>
        </Modal>
    );
};

export default BottomModal2;

const styles = StyleSheet.create({
    closeButton2: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#eee',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText2: {
        fontSize: 20,
        color: '#333',
    },
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
