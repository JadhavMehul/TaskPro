import React from 'react';
import { Text, TextProps, TextStyle, StyleProp, StyleSheet } from 'react-native';

interface Props extends TextProps {
  style?: StyleProp<TextStyle>;
}

const TitleText: React.FC<Props> = ({ style, children, ...rest }) => {
  return (
    <Text style={[styles.defaultText, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Manrope-Regular',
  },
});

export default TitleText;
