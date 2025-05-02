import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CarbonSummaryCardProps {
  totalTons: number;
  flights: number;
  kilometers: number;
}

const CarbonSummaryCard: React.FC<CarbonSummaryCardProps> = ({
  totalTons,
  flights,
  kilometers,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.block}>
          <Image source={require('../assets/images/co2.png')} style={styles.icon} />
          <Text style={styles.textImpact}>{totalTons} Tonnes</Text>
        </View>

        <Text style={styles.equalSign}>=</Text>

        <View style={styles.block}>
          <Image source={require('../assets/images/plane.png')} style={styles.icon} />
          <Text style={styles.text}>{flights} Paris-New York</Text>
        </View>

        {/* <Text style={styles.equalSign}>=</Text>

        <View style={styles.block}>
          <Image source={require('../assets/images/car.png')} style={styles.icon} />
          <Text style={styles.text}>{kilometers.toLocaleString()} km</Text>
        </View> */}
      </View>
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
    flexWrap: 'nowrap', // NE PAS PERMETTRE de passer à la ligne
  },
  block: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4, // espace entre les blocs
  },
  icon: {
    width: 25,
    height: 25,
  },
  textImpact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 4,
  },
  text: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  equalSign: {
    fontSize: 18,
    marginHorizontal: 6,
    color: '#555',
  },
});

export default CarbonSummaryCard;
