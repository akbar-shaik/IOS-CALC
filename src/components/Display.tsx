import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface DisplayProps {
  value: string;
  expression: string;
  onBackspace: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  value,
  expression,
  onBackspace,
}) => {
  const [copied, setCopied] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Determine dynamic font size based on character count
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len <= 6) return 82;
    if (len === 7) return 72;
    if (len === 8) return 62;
    if (len === 9) return 52;
    return 42;
  };

  // Copy display value to clipboard with a subtle iOS toast notification
  const handleCopy = async () => {
    if (value === 'Error') return;

    try {
      await Clipboard.setStringAsync(value);
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopied(true);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setCopied(false));
    } catch {
      // Clipboard fallback
    }
  };

  // Swipe detection to trigger backspace (iOS swipe gesture)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dy) < 40) {
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onBackspace();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Toast Notification */}
      <Animated.View
        style={[
          styles.copiedToast,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.copiedText}>Copied to Clipboard</Text>
      </Animated.View>

      {/* Secondary expression context */}
      <View style={styles.expressionContainer}>
        <Text style={styles.expressionText} numberOfLines={1} ellipsizeMode="head">
          {expression}
        </Text>
      </View>

      {/* Primary Display Readout */}
      <Pressable onLongPress={handleCopy} onPress={handleCopy} delayLongPress={300}>
        <Text
          style={[styles.displayText, { fontSize: getFontSize(value) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {value}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 16,
    justifyContent: 'flex-end',
    minHeight: 180,
  },
  expressionContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  expressionText: {
    color: '#8E8E93',
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: -0.2,
  },
  displayText: {
    color: '#FFFFFF',
    fontWeight: '200',
    textAlign: 'right',
    letterSpacing: -1,
  },
  copiedToast: {
    alignSelf: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    zIndex: 99,
  },
  copiedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
});
