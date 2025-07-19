import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Modal,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';

type User2 = {
  id: string;
  name: string;
  image: string;
};

const users2: User2[] = [
  { id: '0', name: 'Unassign', image: '' },
  { id: '1', name: 'Mehul', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '2', name: 'Chris', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '3', name: 'Ketan', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '4', name: 'Torthak', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '5', name: 'Pranav', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '6', name: 'Sashu', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '7', name: 'Manas', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
  { id: '8', name: 'Tanu', image: 'https://i.imgur.com/1Qf1Z0G.jpg' },
];

const NewScreen = () => {
  const [selectedUsers2, setSelectedUsers2] = useState<User2[]>([]);
  const [tempSelectedUsers2, setTempSelectedUsers2] = useState<User2[]>([]);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false);

  const handleSelect2 = (user: User2) => {
    if (user.id === '0') {
      setTempSelectedUsers2([]);
      return;
    }

    const already = tempSelectedUsers2.find(u => u.id === user.id);
    if (already) {
      setTempSelectedUsers2(prev => prev.filter(u => u.id !== user.id));
    } else {
      setTempSelectedUsers2(prev => [...prev, user]);
    }
  };

  const renderUser2 = ({ item }: { item: User2 }) => {
    const isSelected = tempSelectedUsers2.some(u => u.id === item.id);

    if (item.id === '0') {
      return (
        <TouchableOpacity onPress={() => handleSelect2(item)}>
          <View style={[styles.userContainer2, {
            backgroundColor: '#fff',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
          }]}>
            <Text style={styles.crossIcon2}>❌</Text>
            <Text style={styles.userName2}>{item.name}</Text>
            <Text style={styles.crossIcon2}>❌</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const content = (
      <View style={styles.userInner2}>
        <Image source={{ uri: item.image }} style={styles.avatar2} />
        <Text style={[styles.userName2, isSelected && { color: '#fff' }]}>
          {item.name}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect2(item)}>
        {isSelected ? (
          <LinearGradient colors={['#F8B700', '#F88D00']} style={styles.userContainer2}>
            {content}
          </LinearGradient>
        ) : (
          <View style={[styles.userContainer2, { backgroundColor: '#fff' }]}>
            {content}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.righttop}
          onPress={() => {
            if (selectedUsers2.length > 0) setShowSelectedModal(true);
          }}
        >
          <View style={styles.circle}>
            {selectedUsers2.length === 1 ? (
              <Image source={{ uri: selectedUsers2[0].image }} style={styles.circleImage} />
            ) : selectedUsers2.length > 1 ? (
              <Image source={require('../../assets/images/multiUserIcon.png')} style={styles.circleImage} />
            ) : (
              <Image source={require('@assets/images/profileIcon.png')} style={styles.circleImage} />
            )}
          </View>
          <TitleText style={styles.dropdownText2}>
            {selectedUsers2.length === 0
              ? 'Assign To'
              : selectedUsers2.length === 1
                ? selectedUsers2[0].name
                : `${selectedUsers2.length} Members`}
          </TitleText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setTempSelectedUsers2(selectedUsers2);
          setShowDropdown2(true);
        }}>
          <View style={styles.addtask}>
            <TitleText style={styles.dropdownText2}>
              Assign to
            </TitleText>
            <Image source={require('../../assets/images/downarrow.png')} style={styles.image2} />
          </View>
        </TouchableOpacity>

        {/* Selection Modal */}
        <Modal
          visible={showDropdown2}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown2(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Close (X) Button */}
              <TouchableOpacity
                onPress={() => setShowDropdown2(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <FlatList
                data={users2}
                keyExtractor={(item) => item.id}
                renderItem={renderUser2}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                style={{ flex: 1 }}
              />

              <TouchableOpacity
                onPress={() => {
                  setSelectedUsers2(tempSelectedUsers2);
                  setShowDropdown2(false);
                }}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Selected Users View Modal */}
        <Modal
          visible={showSelectedModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSelectedModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { height: '40%' }]}>
              <TouchableOpacity
                onPress={() => setShowSelectedModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <FlatList
                data={selectedUsers2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.userInner2}>
                    <Image source={{ uri: item.image }} style={styles.avatar2} />
                    <Text style={styles.userName2}>{item.name}</Text>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            </View>
          </View>
        </Modal>
      </CustomSafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  righttop: {
    alignItems: 'center',
    width: '25%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addtask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 18,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  dropdownText2: {
    fontSize: 16,
    marginRight: 10,
  },
  image2: {
    width: 18,
    height: 18,
    resizeMode: 'cover',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    height: '60%',
    borderRadius: 10,
    padding: 16,
    paddingTop: 40,
  },
  doneButton: {
    marginTop: 16,
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
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
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  crossIcon2: {
    fontSize: 8,
    color: '#999',
    paddingHorizontal: 4,
  },
  userContainer2: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    borderRadius: 12,
    padding: 10,
  },
  userInner2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar2: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  userName2: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewScreen;
