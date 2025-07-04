import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import TitleText from './Titletext';

interface ChildProps {
  onSendData: (data: string) => void;
}

const TimePickerHorizontal: React.FC<ChildProps> = ({ onSendData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number | null>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(0);

  

  const handleConfirm = () => {
    setModalVisible(false);
    const notificationTimer = `${`${selectedHours}`.padStart(2, '0')}:${`${selectedMinutes}`.padStart(2, '0')}`;
    if (notificationTimer) {
      onSendData(notificationTimer)
    }
  };

  const handleReset = () => {
    setSelectedHours(0);
    setSelectedMinutes(0);
  };

  const getTimeLabel = (): string => {
    if (selectedHours || selectedMinutes) {
      const hr = selectedHours ? `${selectedHours} hr${selectedHours > 1 ? 's' : ''}` : '';
      const min = selectedMinutes ? `${selectedMinutes} min` : '';
      
      
      return `${hr} ${min}`.trim();
    }
    return 'Add Time';
  };

  const renderItem = (
    item: number,
    onPress: (val: number) => void,
    selected: number | null
  ) => (
    <TouchableOpacity
      key={item.toString()}
      onPress={() => onPress(item)}
      style={[
        styles.item,
        selected === item && styles.selectedItem,
      ]}
    >
      <Text style={[styles.itemText, selected === item && styles.selectedItemText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const showPlusIcon = !(selectedHours || selectedMinutes);
  const timeIsSet = (selectedHours || 0) > 0 || (selectedMinutes || 0) > 0;

  return (
    <View style={styles.container}>

<TouchableOpacity  onPress={() => setModalVisible(true)}>
        <View style={styles.addtask}>

        <TitleText>{getTimeLabel()}</TitleText>
          {showPlusIcon && (
             <Image
             source={require('../../assets/images/addcircle.png')}
             style={styles.image2}
           />
          )}
         
        </View>
     </TouchableOpacity>
      

     <Modal visible={modalVisible} transparent animationType="fade">
  <View style={styles.modalBackground}>
    <View style={styles.dropdown}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
            <Text style={styles.label}>Select Hours</Text>
            <FlatList
              data={[...Array(24).keys()].map(i => i + 1)}
              keyExtractor={(item) => item.toString()}
              horizontal
              renderItem={({ item }) =>
                renderItem(item, setSelectedHours, selectedHours)
              }
              showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.label}>Select Minutes</Text>
            <FlatList
              data={[...Array(60).keys()].map(i => i + 1)}
              keyExtractor={(item) => item.toString()}
              horizontal
              renderItem={({ item }) =>
                renderItem(item, setSelectedMinutes, selectedMinutes)
              }
              showsHorizontalScrollIndicator={false}
            />

            {timeIsSet && (
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimePickerHorizontal;

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#ddd',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },


  addtask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 12,
    borderRadius: 6,
  },
  container: {
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  item: {
    padding: 10,
    marginRight: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#FECC01',
  },
  itemText: {
    color: '#000',
  },
  selectedItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetText: {
    color: 'white',
    fontWeight: '600',
  },
  confirmButton: {
    marginTop: 12,
    backgroundColor: '#FECC01',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },

  image2: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
  },
});
