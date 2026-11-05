import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ButtonType } from '../types';

interface CalculatorButtonProps {
  label: string;
  type: ButtonType;
  size: number;
  gap: number;
  isDoubleWidth?: boolean;
  isActiveOperator?: boolean;
  onPress: () => void;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  type,
  size,
  gap,
  isDoubleWidth = false,
  isActiveOperator = false,
  onPress,
}) => {
  const triggerHaptic = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        if (type === 'operator') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (type === 'function') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // Fallback gracefully if haptics is unsupported
      }
    }
  };

  const handlePress = () => {
    triggerHaptic();
    onPress();
  };

  // Base Colors for iOS Calculator
  const getBackgroundColor = (pressed: boolean) => {
    if (isActiveOperator) {
      return pressed ? '#E5E5EA' : '#FFFFFF';
    }

    switch (type) {
      case 'operator':
        return pressed ? '#CC7E08' : '#FF9F0A';
      case 'function':
        return pressed ? '#D1D1D6' : '#A5A5A5';
      case 'number':
      default:
        return pressed ? '#737373' : '#333333';
    }
  };

  const getTextColor = (): TextStyle => {
    if (isActiveOperator) {
      return { color: '#FF9F0A' };
    }
    if (type === 'function') {
      return { color: '#000000' };
    }
    return { color: '#FFFFFF' };
  };

  const width = isDoubleWidth ? size * 2 + gap : size;
  const height = size;
  const borderRadius = size / 2;

  // Font sizing based on button diameter
  const fontSize = size * 0.42;

  const buttonStyle = (pressed: boolean): ViewStyle => ({
    width,
    height,
    borderRadius,
    backgroundColor: getBackgroundColor(pressed),
    justifyContent: 'center',
    alignItems: isDoubleWidth ? 'flex-start' : 'center',
    paddingLeft: isDoubleWidth ? size * 0.38 : 0,
  });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.buttonBase, buttonStyle(pressed)]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.text, getTextColor(), { fontSize }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {},
  text: {
    fontWeight: '400',
    letterSpacing: -0.5,
  },
});
