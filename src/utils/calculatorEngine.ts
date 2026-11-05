import { CalculatorState, Operator } from '../types';

export const INITIAL_STATE: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  lastOperation: null,
  expression: '',
};

const MAX_DIGITS = 9;

/**
 * Strips formatting commas and returns pure numeric string
 */
export function unformatNumber(formattedStr: string): string {
  return formattedStr.replace(/,/g, '');
}

/**
 * Accurately formats a number or input string with thousands separators
 * while preserving typing state (e.g. trailing "." or "0")
 */
export function formatDisplay(raw: string): string {
  if (raw === 'Error' || raw === 'NaN' || raw === 'Infinity' || raw === '-Infinity') {
    return 'Error';
  }

  // Handle scientific notation e.g. 1.234e+10
  if (raw.toLowerCase().includes('e')) {
    const num = parseFloat(raw);
    if (isNaN(num)) return 'Error';
    return num.toExponential(4).replace('e+', 'e');
  }

  const isNegative = raw.startsWith('-');
  const unsigned = isNegative ? raw.slice(1) : raw;

  const parts = unsigned.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1];

  // Format integer part with commas
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = (isNegative ? '-' : '') + formattedInt;
  if (parts.length > 1) {
    result += '.' + decimalPart;
  }
  return result;
}

/**
 * Formats a raw calculation result number to fit standard display constraints
 */
export function formatResultNumber(val: number): string {
  if (!isFinite(val) || isNaN(val)) {
    return 'Error';
  }

  // Very large or very small numbers use scientific notation
  const abs = Math.abs(val);
  if (abs >= 1e9 || (abs > 0 && abs < 1e-7)) {
    return val.toExponential(4).replace('e+', 'e');
  }

  // Fix floating point precision bugs like 0.1 + 0.2 = 0.30000000000000004
  const precisionStr = val.toPrecision(10);
  const rounded = parseFloat(precisionStr);

  // Limit total digits to max display length
  let str = rounded.toString();
  if (str.length > MAX_DIGITS + 1) {
    str = rounded.toPrecision(MAX_DIGITS - 2);
  }
  return parseFloat(str).toString();
}

/**
 * Executes a single arithmetic operation
 */
export function calculate(first: number, second: number, operator: Operator): number {
  switch (operator) {
    case '+':
      return first + second;
    case '−':
      return first - second;
    case '×':
      return first * second;
    case '÷':
      if (second === 0) {
        return NaN; // Error state
      }
      return first / second;
    default:
      return second;
  }
}

/**
 * Handles typing a numeric digit (0-9)
 */
export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  const { displayValue, waitingForOperand, expression, operator } = state;

  if (displayValue === 'Error') {
    return {
      ...INITIAL_STATE,
      displayValue: digit,
    };
  }

  if (waitingForOperand) {
    return {
      ...state,
      displayValue: digit,
      waitingForOperand: false,
    };
  }

  const raw = unformatNumber(displayValue);
  const digitCount = raw.replace(/[-.]/g, '').length;

  if (digitCount >= MAX_DIGITS) {
    return state; // Reached maximum digits
  }

  const newDisplay = raw === '0' ? digit : raw + digit;
  return {
    ...state,
    displayValue: newDisplay,
  };
}

/**
 * Handles decimal point (.) input
 */
export function inputDecimal(state: CalculatorState): CalculatorState {
  const { displayValue, waitingForOperand } = state;

  if (displayValue === 'Error' || waitingForOperand) {
    return {
      ...state,
      displayValue: '0.',
      waitingForOperand: false,
    };
  }

  const raw = unformatNumber(displayValue);
  if (!raw.includes('.')) {
    return {
      ...state,
      displayValue: raw + '.',
      waitingForOperand: false,
    };
  }

  return state;
}

/**
 * Handles toggling sign (+/-)
 */
export function toggleSign(state: CalculatorState): CalculatorState {
  const { displayValue } = state;
  if (displayValue === 'Error' || displayValue === '0') return state;

  const raw = unformatNumber(displayValue);
  const toggled = raw.startsWith('-') ? raw.slice(1) : '-' + raw;
  return {
    ...state,
    displayValue: toggled,
  };
}

/**
 * Handles percentage (%) calculation
 */
export function calculatePercentage(state: CalculatorState): CalculatorState {
  const { displayValue, previousValue, operator } = state;
  if (displayValue === 'Error') return state;

  const currentNum = parseFloat(unformatNumber(displayValue));
  if (isNaN(currentNum)) return state;

  let resultNum: number;
  if (previousValue !== null && operator !== null) {
    // E.g. 200 + 10% => 10% of 200 = 20
    const prevNum = parseFloat(unformatNumber(previousValue));
    if (operator === '+' || operator === '−') {
      resultNum = (prevNum * currentNum) / 100;
    } else {
      resultNum = currentNum / 100;
    }
  } else {
    resultNum = currentNum / 100;
  }

  return {
    ...state,
    displayValue: formatResultNumber(resultNum),
    waitingForOperand: false,
  };
}

/**
 * Handles arithmetic operator (+, −, ×, ÷)
 */
export function handleOperator(state: CalculatorState, nextOperator: Operator): CalculatorState {
  const { displayValue, previousValue, operator, waitingForOperand } = state;

  if (displayValue === 'Error') {
    return INITIAL_STATE;
  }

  const inputValue = parseFloat(unformatNumber(displayValue));

  // If already waiting for operand, simply replace the pending operator
  if (operator && waitingForOperand) {
    return {
      ...state,
      operator: nextOperator,
      expression: `${unformatNumber(previousValue ?? '0')} ${nextOperator}`,
    };
  }

  if (previousValue === null) {
    return {
      ...state,
      previousValue: displayValue,
      operator: nextOperator,
      waitingForOperand: true,
      lastOperation: null,
      expression: `${displayValue} ${nextOperator}`,
    };
  }

  if (operator) {
    const prevNum = parseFloat(unformatNumber(previousValue));
    const result = calculate(prevNum, inputValue, operator);

    if (isNaN(result) || !isFinite(result)) {
      return {
        ...INITIAL_STATE,
        displayValue: 'Error',
      };
    }

    const formattedResult = formatResultNumber(result);
    return {
      ...state,
      displayValue: formattedResult,
      previousValue: formattedResult,
      operator: nextOperator,
      waitingForOperand: true,
      lastOperation: null,
      expression: `${formattedResult} ${nextOperator}`,
    };
  }

  return state;
}

/**
 * Handles equals (=)
 */
export function handleEquals(
  state: CalculatorState
): { newState: CalculatorState; completedItem?: { expression: string; result: string } } {
  const { displayValue, previousValue, operator, lastOperation } = state;

  if (displayValue === 'Error') {
    return { newState: INITIAL_STATE };
  }

  const currentNum = parseFloat(unformatNumber(displayValue));

  // Case 1: Normal calculation (operand 1, operator, operand 2)
  if (previousValue !== null && operator !== null) {
    const prevNum = parseFloat(unformatNumber(previousValue));
    const result = calculate(prevNum, currentNum, operator);

    if (isNaN(result) || !isFinite(result)) {
      return {
        newState: {
          ...INITIAL_STATE,
          displayValue: 'Error',
        },
      };
    }

    const formattedResult = formatResultNumber(result);
    const expr = `${formatDisplay(previousValue)} ${operator} ${formatDisplay(displayValue)} =`;

    return {
      newState: {
        ...state,
        displayValue: formattedResult,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        lastOperation: { operator, operand: currentNum },
        expression: expr,
      },
      completedItem: {
        expression: expr,
        result: formatDisplay(formattedResult),
      },
    };
  }

  // Case 2: Repeating equals with lastOperation
  if (lastOperation !== null) {
    const result = calculate(currentNum, lastOperation.operand, lastOperation.operator);
    if (isNaN(result) || !isFinite(result)) {
      return {
        newState: {
          ...INITIAL_STATE,
          displayValue: 'Error',
        },
      };
    }

    const formattedResult = formatResultNumber(result);
    const expr = `${formatDisplay(displayValue)} ${lastOperation.operator} ${formatResultNumber(
      lastOperation.operand
    )} =`;

    return {
      newState: {
        ...state,
        displayValue: formattedResult,
        waitingForOperand: true,
        expression: expr,
      },
      completedItem: {
        expression: expr,
        result: formatDisplay(formattedResult),
      },
    };
  }

  return { newState: state };
}

/**
 * Handles Clear (C) or All Clear (AC)
 */
export function handleClear(state: CalculatorState): CalculatorState {
  // If user is currently typing and display is not 0, clear only current display ('C' mode)
  if (state.displayValue !== '0' && !state.waitingForOperand) {
    return {
      ...state,
      displayValue: '0',
    };
  }
  // Otherwise reset all state ('AC' mode)
  return INITIAL_STATE;
}

/**
 * Handles swipe-to-delete / backspace gesture
 */
export function handleBackspace(state: CalculatorState): CalculatorState {
  const { displayValue, waitingForOperand } = state;
  if (displayValue === 'Error' || waitingForOperand) return state;

  const raw = unformatNumber(displayValue);
  if (raw.length <= 1 || (raw.length === 2 && raw.startsWith('-'))) {
    return {
      ...state,
      displayValue: '0',
    };
  }

  return {
    ...state,
    displayValue: raw.slice(0, -1),
  };
}
