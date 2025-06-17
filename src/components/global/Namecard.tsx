import React from 'react';
import { View, Image, StyleSheet, ViewStyle, TextStyle,Animated, TouchableOpacity } from 'react-native';
import TitleText from '@components/global/Titletext';
import ToggleSwitch from '@components/global/ToggleSwitch';

interface NameCardProps {
  name: string;
  imageSource: any,
  isOn: boolean;
  toggleSwitch: () => void;
  knobPosition: Animated.Value;
  style?: ViewStyle;
}

const NameCard: React.FC<NameCardProps> = ({
  name,
  imageSource,
  isOn,
  toggleSwitch,
  knobPosition,
  style,
}) => {
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

      <ToggleSwitch
        isOn={isOn}
        toggleSwitch={toggleSwitch}
        knobPosition={knobPosition}
      />
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
  } ,

  personName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
});

export default NameCard;
