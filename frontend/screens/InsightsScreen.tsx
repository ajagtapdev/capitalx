import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView, Animated } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface ChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      colors?: Array<(opacity: number) => string>;
    }>;
  };
  width: number;
  height: number;
  chartConfig: any;
  style: any;
}

interface BarChartProps extends ChartProps {
  animatedValue: Animated.Value;
  yAxisLabel: string;
  yAxisSuffix: string;
  showBarTops?: boolean;
  fromZero?: boolean;
  flatColor?: boolean;
  withCustomBarColorFromData?: boolean;
}

const AnimatedLineChart: React.FC<ChartProps & { animatedValue: Animated.Value }> = ({ 
  data, width, height, chartConfig, style, animatedValue 
}) => {
  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width]
  });

  return (
    <View style={[style, { position: 'relative' }]}>
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={{
          ...chartConfig,
          propsForDots: {
            ...chartConfig.propsForDots,
            r: '0',
          }
        }}
        bezier
        style={style}
      />
      <AnimatedSvg
        height={height}
        width={animatedWidth}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <Rect x="0" y="0" width={width} height={height} fill={chartConfig.backgroundColor} />
      </AnimatedSvg>
    </View>
  );
};

const AnimatedBarChart: React.FC<BarChartProps> = ({ 
  data, width, height, chartConfig, style, yAxisLabel, yAxisSuffix, animatedValue, ...props 
}) => {
  const animatedHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height]
  });

  return (
    <View style={[style, { position: 'relative' }]}>
      <BarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={style}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        {...props}
      />
      <AnimatedSvg
        height={animatedHeight}
        width={width}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Rect x="0" y="0" width={width} height={height} fill={chartConfig.backgroundColor} />
      </AnimatedSvg>
    </View>
  );
};

const InsightsScreen = () => {
  const lineAnimation = useRef(new Animated.Value(1)).current;
  const barAnimation = useRef(new Animated.Value(1)).current;

  const startAnimations = () => {
    // Reset animations
    lineAnimation.setValue(1);
    barAnimation.setValue(1);

    Animated.parallel([
      Animated.timing(lineAnimation, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(barAnimation, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      startAnimations();
    }, [])
  );

  // Sample data - replace with actual data from your backend
const savingsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    data: [0, 0, 4, 0, 0, 0],
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // 💙 Brighter vivid blue (system blue)
    strokeWidth: 3, // Makes the line bolder
  }],
};

const categoryData = {
  labels: ['Clothing', 'Bills', 'Food'],
  datasets: [{
    data: [74, 0, 2],
    colors: [
      (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    ],
  }],
};

const lineChartConfig = {
  backgroundColor: '#1A1A1A',
  backgroundGradientFrom: '#1A1A1A',
  backgroundGradientTo: '#1A1A1A',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`, // Same vivid blue
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
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Match vivid blue
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="insights" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Your Insights</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Savings</Text>
          <AnimatedLineChart
            data={savingsData}
            width={screenWidth - 80}
            height={220}
            chartConfig={lineChartConfig}
            style={styles.chart}
            animatedValue={lineAnimation}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="savings" size={24} color="#0A84FF" />
            <Text style={styles.statValue}>$4</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="trending-up" size={24} color="#0A84FF" />
            <Text style={styles.statValue}>-</Text>
            <Text style={styles.statLabel}>vs Last Month</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          <AnimatedBarChart
            data={categoryData}
            width={screenWidth - 80}
            height={220}
            chartConfig={barChartConfig}
            style={styles.chart}
            showBarTops={false}
            fromZero
            yAxisLabel="$"
            yAxisSuffix=""
            flatColor={true}
            withCustomBarColorFromData={true}
            animatedValue={barAnimation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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