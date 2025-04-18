import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CarbonSummaryCardProps {
  totalTons: number;
  flights: number;
  kilometers: number;
}

const CarbonSummaryCard: React.FC<CarbonSummaryCardProps> = ({ totalTons, flights, kilometers }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={require('../assets/images/co2.png')} style={styles.icon} />
        <Text style={styles.equalSign}>=</Text>
        <Image source={require('../assets/images/plane.png')} style={styles.icon} />
        <Text style={styles.text}>{flights} Paris-New York</Text>
        <Text style={styles.equalSign}>=</Text>
        <Image source={require('../assets/images/car.png')} style={styles.icon} />
        <Text style={styles.text}>{kilometers.toLocaleString()} Kms</Text>
      </View>
      <Text style={styles.total}>{totalTons} Tonnes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  equalSign: {
    fontSize: 18,
    marginHorizontal: 4,
    color: '#555',
  },
  text: {
    fontSize: 12,
    color: '#333',
    marginHorizontal: 4,
  },
  total: {
    marginTop: 4,
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default CarbonSummaryCard;
