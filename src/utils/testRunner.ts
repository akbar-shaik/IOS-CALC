import {
  INITIAL_STATE,
  inputDigit,
  inputDecimal,
  handleOperator,
  handleEquals,
  handleClear,
  toggleSign,
  calculatePercentage,
  handleBackspace,
  formatDisplay,
} from './calculatorEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running Calculator Engine Verification Suite...');

// Test 1: Simple Addition 5 + 7 = 12
let s = INITIAL_STATE;
s = inputDigit(s, '5');
assert(s.displayValue === '5', 'Input digit 5');
s = handleOperator(s, '+');
assert(s.operator === '+', 'Operator + set');
s = inputDigit(s, '7');
assert(s.displayValue === '7', 'Input digit 7');
const res1 = handleEquals(s);
s = res1.newState;
assert(s.displayValue === '12', `5 + 7 should equal 12, got ${s.displayValue}`);
console.log('✔ Test 1: 5 + 7 = 12 passed');

// Test 2: Floating point accuracy 0.1 + 0.2 = 0.3
s = INITIAL_STATE;
s = inputDigit(s, '0');
s = inputDecimal(s);
s = inputDigit(s, '1');
assert(s.displayValue === '0.1', 'Display 0.1');
s = handleOperator(s, '+');
s = inputDigit(s, '0');
s = inputDecimal(s);
s = inputDigit(s, '2');
assert(s.displayValue === '0.2', 'Display 0.2');
const res2 = handleEquals(s);
s = res2.newState;
assert(s.displayValue === '0.3', `0.1 + 0.2 should equal 0.3, got ${s.displayValue}`);
console.log('✔ Test 2: 0.1 + 0.2 = 0.3 (float precision) passed');

// Test 3: Division by zero 9 / 0 = Error
s = INITIAL_STATE;
s = inputDigit(s, '9');
s = handleOperator(s, '÷');
s = inputDigit(s, '0');
const res3 = handleEquals(s);
s = res3.newState;
assert(s.displayValue === 'Error', `9 ÷ 0 should equal Error, got ${s.displayValue}`);
console.log('✔ Test 3: 9 ÷ 0 = Error passed');

// Test 4: Repeated equals 5 + 2 = 7 = 9 = 11
s = INITIAL_STATE;
s = inputDigit(s, '5');
s = handleOperator(s, '+');
s = inputDigit(s, '2');
s = handleEquals(s).newState;
assert(s.displayValue === '7', `First = should give 7, got ${s.displayValue}`);
s = handleEquals(s).newState;
assert(s.displayValue === '9', `Second = should give 9, got ${s.displayValue}`);
s = handleEquals(s).newState;
assert(s.displayValue === '11', `Third = should give 11, got ${s.displayValue}`);
console.log('✔ Test 4: Repeated equals (5 + 2 = 7 = 9 = 11) passed');

// Test 5: Percentage 200 + 10% = 220
s = INITIAL_STATE;
s = inputDigit(s, '2');
s = inputDigit(s, '0');
s = inputDigit(s, '0');
s = handleOperator(s, '+');
s = inputDigit(s, '1');
s = inputDigit(s, '0');
s = calculatePercentage(s);
assert(s.displayValue === '20', `10% of 200 should be 20, got ${s.displayValue}`);
s = handleEquals(s).newState;
assert(s.displayValue === '220', `200 + 10% should equal 220, got ${s.displayValue}`);
console.log('✔ Test 5: 200 + 10% = 220 passed');

// Test 6: Swipe to delete / Backspace
s = INITIAL_STATE;
s = inputDigit(s, '1');
s = inputDigit(s, '2');
s = inputDigit(s, '3');
assert(s.displayValue === '123', 'Input 123');
s = handleBackspace(s);
assert(s.displayValue === '12', `123 backspace should be 12, got ${s.displayValue}`);
s = handleBackspace(s);
assert(s.displayValue === '1', `12 backspace should be 1, got ${s.displayValue}`);
s = handleBackspace(s);
assert(s.displayValue === '0', `1 backspace should be 0, got ${s.displayValue}`);
console.log('✔ Test 6: Backspace (123 -> 12 -> 1 -> 0) passed');

// Test 7: Formatting
assert(formatDisplay('1234567') === '1,234,567', 'Format 1,234,567');
assert(formatDisplay('-987654.321') === '-987,654.321', 'Format negative with decimals');
assert(formatDisplay('42.') === '42.', 'Format typing dot preserves trailing dot');
console.log('✔ Test 7: Number formatting with thousands separators passed');

console.log('All Calculator Engine verification tests passed successfully! 🎉');
