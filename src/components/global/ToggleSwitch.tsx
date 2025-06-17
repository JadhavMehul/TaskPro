import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientToggleSwitchProps {
  isOn: boolean;
  toggleSwitch: () => void;
  knobPosition: Animated.Value;
}

const ToggleSwitch: React.FC<GradientToggleSwitchProps> = ({
  isOn,
  toggleSwitch,
  knobPosition,
}) => {
  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      activeOpacity={0.8}
      style={styles.container}
    >
      {isOn ? (
        <LinearGradient
          colors={['#FECC01', '#F49C16']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.background}
        />
      ) : (
        <View style={[styles.background, { backgroundColor: '#E9E4DC' }]} />
      )}

      <Animated.View
        style={[
          styles.knob,
          {
            left: knobPosition,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 25,
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 2,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  knob: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 5,
  },
});

export default ToggleSwitch;
