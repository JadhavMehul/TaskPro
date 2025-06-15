import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

interface Props extends TextInputProps  {
  style?: StyleProp<TextStyle>;
};

export default function InputField({ style, ...rest }: Props) {
  return <TextInput style={[styles.input, style]} {...rest} />;
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 16,
  },
});
