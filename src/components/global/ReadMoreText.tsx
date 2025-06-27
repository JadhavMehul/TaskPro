// ReadMoreText.tsx
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

interface ReadMoreTextProps {
  text: string;
  numberOfLines?: number;
  style?: any;
  toggleTextStyle?: any;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  numberOfLines = 3,
  style,
  toggleTextStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Text numberOfLines={expanded ? undefined : numberOfLines} style={style}>
        {text}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={[styles.toggleText, toggleTextStyle]}>
          {expanded ? 'Read less' : 'Read more'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleText: {
    color: 'blue',
    marginTop: 5,
  },
});

export default ReadMoreText;
