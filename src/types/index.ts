export type Operator = '+' | '−' | '×' | '÷';

export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  lastOperation: { operator: Operator; operand: number } | null;
  expression: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonType = 'number' | 'operator' | 'function';
