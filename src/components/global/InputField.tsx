import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

interface Props extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export default function InputField({ style, value, onChangeText, ...rest }: Props) {
  const [text, setText] = useState(value || '');

  const capitalizeAfterPeriod = (input: string) => {
    return input
      .split(/(\.|\?|\!)(\s*)/) // keep punctuation and spacing
      .map((part, index, arr) => {
        // Only capitalize if it's the start or comes after punctuation
        if (
          index === 0 || // first part
          (arr[index - 1]?.match(/[\.\!\?]/) && arr[index]?.trim().length > 0)
        ) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        }
        return part;
      })
      .join('');
  };

  const handleTextChange = (input: string) => {
    const formatted = capitalizeAfterPeriod(input);
    setText(formatted);
    onChangeText?.(formatted);
  };

  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="grey"
      value={text}
      onChangeText={handleTextChange}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 16,
  },
});
