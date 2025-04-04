import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useUserDataStore } from '../store/userDataStore';

const categoryData = [
  { key: 'housing', icon: require('../assets/images/house.png'), color: '#f97316' },
  { key: 'transport', icon: require('../assets/images/car.png'), color: '#3b82f6' },
  { key: 'travel', icon: require('../assets/images/plane.png'), color: '#fde047' },
  { key: 'purchases', icon: require('../assets/images/shopping.png'), color: '#8ce67a' },
];

const ImpactBreakdown = () => {
  const { categoryDetails, totalImpact } = useUserDataStore();

  return (
    <View style={styles.breakdownContainer}>

      <View style={styles.barChart}>
        {categoryData.map(({ key, icon, color }) => {
          const value = categoryDetails[key] ?? 0;
          const percent = totalImpact > 0 ? (value / totalImpact) * 100 : 0;
          const barHeight = Math.min(100, percent * 2);

          return (
            <View key={key} style={styles.barItem}>
              <Text style={styles.kgText}>{value.toFixed(0)} kg Co₂</Text>
              <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
              <View style={styles.iconWrapper}>
                <Image source={icon} style={styles.icon} resizeMode="contain" />
              </View>
              <Text style={styles.percentText}>{percent.toFixed(0)}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  breakdownContainer: {
    alignItems: 'center',
    width: '100%',
  },
  breakdownTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  strong: {
    color: 'darkred',
    fontWeight: 'bold',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: 180,
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 70,
    height: '100%',
  },
  bar: {
    width: 30,
    borderRadius: 5,
    marginBottom: 5,
  },
  kgText: {
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    width: 30,
    height: 30,
  },
  percentText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    marginTop: 6,
  },
});

export default ImpactBreakdown;
