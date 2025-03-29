import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const InsightsScreen = () => {
  // Sample data - replace with actual data from your backend
  const savingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43],
    }],
  };

  const categoryData = {
    labels: ['Shopping', 'Bills', 'Food'],
    datasets: [{
      data: [300, 500, 200],
      colors: [(opacity = 1) => `rgba(10, 132, 255, ${opacity * 0.5})`, (opacity = 1) => `rgba(10, 132, 255, ${opacity * 0.5})`, (opacity = 1) => `rgba(10, 132, 255, ${opacity * 0.5})`],
    }],
  };

  const lineChartConfig = {
    backgroundColor: '#1A1A1A',
    backgroundGradientFrom: '#1A1A1A',
    backgroundGradientTo: '#1A1A1A',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const barChartConfig = {
    backgroundColor: '#1A1A1A',
    backgroundGradientFrom: '#1A1A1A',
    backgroundGradientTo: '#1A1A1A',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="insights" size={24} color="#FFFFFF" />
        <Text style={styles.headerText}>Your Insights</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Savings</Text>
        <LineChart
          data={savingsData}
          width={screenWidth - 80}
          height={220}
          chartConfig={lineChartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending by Category</Text>
        <BarChart
          data={categoryData}
          width={screenWidth - 80}
          height={220}
          chartConfig={barChartConfig}
          style={styles.chart}
          showBarTops={false}
          fromZero
          yAxisLabel="$"
          yAxisSuffix="k"
          flatColor={true}
          withCustomBarColorFromData={true}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="savings" size={24} color="#0A84FF" />
          <Text style={styles.statValue}>$1,234</Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={24} color="#0A84FF" />
          <Text style={styles.statValue}>+15%</Text>
          <Text style={styles.statLabel}>vs Last Month</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    margin: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 5,
  },
});

export default InsightsScreen; 