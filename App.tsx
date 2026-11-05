import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  Platform,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  CalculatorState,
  CalculationHistoryItem,
  Operator,
} from './src/types';
import {
  INITIAL_STATE,
  formatDisplay,
  inputDigit,
  inputDecimal,
  handleOperator,
  handleEquals,
  handleClear,
  toggleSign,
  calculatePercentage,
  handleBackspace,
} from './src/utils/calculatorEngine';
import { CalculatorButton } from './src/components/CalculatorButton';
import { Display } from './src/components/Display';
import { HistoryModal } from './src/components/HistoryModal';

// Pure React Native iOS Clock / History Icon
const HistoryIcon = ({ color = '#FF9F0A', size = 22 }: { color?: string; size?: number }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Clock hour hand */}
    <View
      style={{
        position: 'absolute',
        width: 2,
        height: size * 0.3,
        backgroundColor: color,
        top: size * 0.18,
        borderRadius: 1,
      }}
    />
    {/* Clock minute hand */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.26,
        height: 2,
        backgroundColor: color,
        left: size * 0.44,
        borderRadius: 1,
      }}
    />
  </View>
);

export default function App() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Constrain width on tablets / web for authentic iPhone frame
  const maxContentWidth = 430;
  const contentWidth = Math.min(windowWidth, maxContentWidth);

  // Dynamic layout calculations
  const horizontalPadding = 18;
  const buttonGap = contentWidth < 360 ? 10 : 14;
  const availableGridWidth = contentWidth - horizontalPadding * 2;
  const buttonSize = Math.floor((availableGridWidth - buttonGap * 3) / 4);

  // Clear button label: "C" when user has typed something, otherwise "AC"
  const clearLabel =
    state.displayValue !== '0' && !state.waitingForOperand ? 'C' : 'AC';

  // Keypad Handlers
  const onDigit = (digit: string) => {
    setState((prev) => inputDigit(prev, digit));
  };

  const onDecimal = () => {
    setState((prev) => inputDecimal(prev));
  };

  const onOperator = (op: Operator) => {
    setState((prev) => handleOperator(prev, op));
  };

  const onEquals = () => {
    const { newState, completedItem } = handleEquals(state);
    setState(newState);

    if (completedItem) {
      const newItem: CalculationHistoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        expression: completedItem.expression,
        result: completedItem.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep up to 50 recent items
    }
  };

  const onClear = () => {
    setState((prev) => handleClear(prev));
  };

  const onToggleSign = () => {
    setState((prev) => toggleSign(prev));
  };

  const onPercent = () => {
    setState((prev) => calculatePercentage(prev));
  };

  const onBackspace = () => {
    setState((prev) => handleBackspace(prev));
  };

  const onSelectHistoryResult = (result: string) => {
    setState({
      ...INITIAL_STATE,
      displayValue: result.replace(/,/g, ''),
    });
  };

  const onClearHistory = () => {
    setHistory([]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={[styles.rootContainer, { maxWidth: contentWidth }]}>
          {/* Top Bar with History Toggle */}
          <View style={styles.topBar}>
            <Text style={styles.appTitle}>Calculator</Text>
            <Pressable
              onPress={() => setIsHistoryOpen(true)}
              style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}
              hitSlop={12}
              accessibilityLabel="Calculation History"
            >
              <HistoryIcon size={24} color="#FF9F0A" />
            </Pressable>
          </View>

          {/* Display with Gesture & Expression */}
          <View style={styles.displaySection}>
            <Display
              value={formatDisplay(state.displayValue)}
              expression={state.expression}
              onBackspace={onBackspace}
            />
          </View>

          {/* Keypad Grid */}
          <View style={[styles.keypad, { paddingHorizontal: horizontalPadding, rowGap: buttonGap }]}>
            {/* Row 1 */}
            <View style={[styles.row, { columnGap: buttonGap }]}>
              <CalculatorButton
                label={clearLabel}
                type="function"
                size={buttonSize}
                gap={buttonGap}
                onPress={onClear}
              />
              <CalculatorButton
                label="±"
                type="function"
                size={buttonSize}
                gap={buttonGap}
                onPress={onToggleSign}
              />
              <CalculatorButton
                label="%"
                type="function"
                size={buttonSize}
                gap={buttonGap}
                onPress={onPercent}
              />
              <CalculatorButton
                label="÷"
                type="operator"
                size={buttonSize}
                gap={buttonGap}
                isActiveOperator={state.operator === '÷' && state.waitingForOperand}
                onPress={() => onOperator('÷')}
              />
            </View>

            {/* Row 2 */}
            <View style={[styles.row, { columnGap: buttonGap }]}>
              <CalculatorButton
                label="7"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('7')}
              />
              <CalculatorButton
                label="8"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('8')}
              />
              <CalculatorButton
                label="9"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('9')}
              />
              <CalculatorButton
                label="×"
                type="operator"
                size={buttonSize}
                gap={buttonGap}
                isActiveOperator={state.operator === '×' && state.waitingForOperand}
                onPress={() => onOperator('×')}
              />
            </View>

            {/* Row 3 */}
            <View style={[styles.row, { columnGap: buttonGap }]}>
              <CalculatorButton
                label="4"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('4')}
              />
              <CalculatorButton
                label="5"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('5')}
              />
              <CalculatorButton
                label="6"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('6')}
              />
              <CalculatorButton
                label="−"
                type="operator"
                size={buttonSize}
                gap={buttonGap}
                isActiveOperator={state.operator === '−' && state.waitingForOperand}
                onPress={() => onOperator('−')}
              />
            </View>

            {/* Row 4 */}
            <View style={[styles.row, { columnGap: buttonGap }]}>
              <CalculatorButton
                label="1"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('1')}
              />
              <CalculatorButton
                label="2"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('2')}
              />
              <CalculatorButton
                label="3"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={() => onDigit('3')}
              />
              <CalculatorButton
                label="+"
                type="operator"
                size={buttonSize}
                gap={buttonGap}
                isActiveOperator={state.operator === '+' && state.waitingForOperand}
                onPress={() => onOperator('+')}
              />
            </View>

            {/* Row 5 */}
            <View style={[styles.row, { columnGap: buttonGap }]}>
              <CalculatorButton
                label="0"
                type="number"
                size={buttonSize}
                gap={buttonGap}
                isDoubleWidth
                onPress={() => onDigit('0')}
              />
              <CalculatorButton
                label="."
                type="number"
                size={buttonSize}
                gap={buttonGap}
                onPress={onDecimal}
              />
              <CalculatorButton
                label="="
                type="operator"
                size={buttonSize}
                gap={buttonGap}
                onPress={onEquals}
              />
            </View>
          </View>
        </View>

        {/* History Modal Sheet */}
        <HistoryModal
          visible={isHistoryOpen}
          history={history}
          onSelectResult={onSelectHistoryResult}
          onClearHistory={onClearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 12 : 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    height: 44,
  },
  appTitle: {
    color: '#3A3A3C',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  historyButton: {
    padding: 6,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.6,
  },
  displaySection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypad: {
    width: '100%',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
