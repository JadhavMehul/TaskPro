import React, { FC } from 'react';
import { TouchableOpacity, Image, ImageSourcePropType, StyleSheet, Text, GestureResponderEvent,ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TitleText from './Titletext';

type GradientButtonProps = {
  imageSource: ImageSourcePropType;
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
};

const GradientButton: FC<GradientButtonProps> = ({ imageSource, title, onPress,style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#FECC01', '#F49C16']}
        style={[styles.gradientBox, style]} 
      >
        <Image source={imageSource} style={styles.image} />
  

        <TitleText style={styles.adminboxtext}>
        {title}
                </TitleText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    gradientBox: {
        // alignSelf: 'flex-start',
        // minWidth: 171,
        width: '100%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      adminboxtext: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 16,
      },
    
    
      image: {
        width: 86,
        height: 86,
        resizeMode: 'contain',
      },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default GradientButton;
