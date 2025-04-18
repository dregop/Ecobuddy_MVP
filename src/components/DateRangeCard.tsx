import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DateRangeCardProps {
  year: number;
  range: string;
}

const DateRangeCard: React.FC<DateRangeCardProps> = ({ year, range }) => {
  return (
    <View style={styles.container}>
      <View style={styles.yearBox}>
        <Text style={styles.yearText}>{year}</Text>
      </View>
      <View style={styles.rangeBox}>
        <Text style={styles.rangeText}>{range}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#fff',
  },
  yearBox: {
    backgroundColor: '#F44336',
    paddingVertical: 2,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f21c0c'
  },
  yearText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rangeBox: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DateRangeCard;
