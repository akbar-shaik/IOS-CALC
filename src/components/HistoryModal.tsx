import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CalculationHistoryItem } from '../types';

interface HistoryModalProps {
  visible: boolean;
  history: CalculationHistoryItem[];
  onSelectResult: (result: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  history,
  onSelectResult,
  onClearHistory,
  onClose,
}) => {
  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Haptics.impactAsync(style);
      } catch {
        // no-op
      }
    }
  };

  const handleSelect = (result: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    onSelectResult(result);
    onClose();
  };

  const handleClear = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    onClearHistory();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleClear}
              disabled={history.length === 0}
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.pressed,
                history.length === 0 && styles.disabled,
              ]}
            >
              <Text style={[styles.clearText, history.length === 0 && styles.disabledText]}>
                Clear
              </Text>
            </Pressable>

            <Text style={styles.title}>History</Text>

            <Pressable
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>

          {/* History List */}
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Recent Calculations</Text>
              <Text style={styles.emptySubtitle}>
                Completed calculations will automatically appear here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.result)}
                  style={({ pressed }) => [
                    styles.historyItem,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
                  </View>
                  <Text style={styles.itemExpression}>{item.expression}</Text>
                  <Text style={styles.itemResult}>{item.result}</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '45%',
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  doneText: {
    color: '#FF9F0A',
    fontSize: 17,
    fontWeight: '600',
  },
  clearText: {
    color: '#FF453A',
    fontSize: 17,
    fontWeight: '400',
  },
  disabledText: {
    color: '#545458',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.6,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  historyItem: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTime: {
    color: '#8E8E93',
    fontSize: 13,
  },
  itemExpression: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'right',
  },
  itemResult: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'right',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
