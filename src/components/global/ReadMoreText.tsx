// import React, { useState } from 'react';
// import {
//   Text,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
// } from 'react-native';

// interface Props {
//   text: string;
//   numberOfChars?: number;
//   textStyle?: any;
//   readMoreTextStyle?: any;
// }

// const ReadMoreText: React.FC<Props> = ({
//   text,
//   numberOfChars = 150, // approx. 2 lines on most screens
//   textStyle,
//   readMoreTextStyle,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const shouldTruncate = text.length > numberOfChars;
//   const previewText = shouldTruncate ? text.slice(0, numberOfChars).trim() + '...' : text;

//   return (
//     <View>
//       <Text style={textStyle}>
//         {expanded || !shouldTruncate ? text : previewText}
//         {shouldTruncate && !expanded && (
//           <Text onPress={() => setExpanded(true)} style={[styles.readMore, readMoreTextStyle]}>
//             {' '}Read more
//           </Text>
//         )}
//       </Text>

//       {expanded && shouldTruncate && (
//         <TouchableOpacity onPress={() => setExpanded(false)}>
//           <Text style={[styles.readMore, readMoreTextStyle]}>Read less</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   readMore: {
//     color: 'orange',
//     fontWeight: 'bold',
//   },
// });

// export default ReadMoreText;


import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface Props {
  text: string;
  numberOfChars?: number;
  textStyle?: any;
  readMoreTextStyle?: any;
}

const ReadMoreText: React.FC<Props> = ({
  text,
  numberOfChars = 150,
  textStyle,
  readMoreTextStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > numberOfChars;

  let displayText = '';
  if (!expanded && shouldTruncate) {
    displayText = text.slice(0, numberOfChars).trim() + '...';
  } else {
    displayText = text;
  }

  return (
    <View>
      <Text style={textStyle}>
        {displayText}
        {shouldTruncate && (
          <Text
            onPress={() => setExpanded(!expanded)}
            style={[styles.readMore, readMoreTextStyle]}
          >
            {expanded ? ' Read less' : ' Read more'}
          </Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  readMore: {
    color: 'orange',
    fontWeight: 'bold',
  },
});

export default ReadMoreText;
