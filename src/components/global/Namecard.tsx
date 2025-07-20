import React, { useState } from 'react';
import { View, Image, StyleSheet, ViewStyle, TextStyle, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import TitleText from '@components/global/Titletext';
import ToggleSwitch from '@components/global/ToggleSwitch';
import Feather from '@react-native-vector-icons/feather';

interface NameCardProps {
  name: string;
  imageSource: any,
  isOn: boolean;
  toggleSwitch: () => void;
  knobPosition: Animated.Value;
  onDelete: () => void;
  style?: ViewStyle;
}

const NameCard: React.FC<NameCardProps> = ({
  name,
  imageSource,
  isOn,
  toggleSwitch,
  knobPosition,
  onDelete,
  style,
}) => {

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(); // parent function (async delete)
    } catch (err) {
      console.warn("Error deleting user:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (

    <TouchableOpacity>


      <View style={[styles.namecard, style]}>
        <View style={styles.row}>
          <View style={styles.circle}>
            <Image
              // source={require('../../assets/images/home_fill.png')}
              source={imageSource}
              style={styles.circleImage}
            />
          </View>

          <TitleText style={styles.personName}>{name}</TitleText>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity onPress={handleDelete}>
            {isDeleting ? (
              <ActivityIndicator size={24} color="red" />
            ) : (
              <Feather name="trash" size={24} color="red" />
            )}
          </TouchableOpacity>

          <ToggleSwitch
            isOn={isOn}
            toggleSwitch={toggleSwitch}
            knobPosition={knobPosition}
          />
        </View>


      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  namecard: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  } as ViewStyle,

  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  circle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  personName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
});

export default NameCard;
