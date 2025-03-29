import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const mockCards = [
  {
    id: 1,
    name: 'Sapphire Reserve',
    number: '••••  ••••  ••••  4589',
    expiry: '12/25',
    type: 'Visa Infinite',
    color: '#0047AB',
    logo: require('../assets/card-logos/visa.png'),
  },
  {
    id: 2,
    name: 'Platinum Card',
    number: '••••  ••••  ••••  3782',
    expiry: '03/26',
    type: 'American Express',
    color: '#1E1E1E',
    logo: require('../assets/card-logos/amex.png'),
  },
  {
    id: 3,
    name: 'Freedom Unlimited',
    number: '••••  ••••  ••••  6011',
    expiry: '09/24',
    type: 'Visa Signature',
    color: '#00008B',
    logo: require('../assets/card-logos/visa.png'),
  },
  {
    id: 4,
    name: 'Freedom Unlimited',
    number: '••••  ••••  ••••  6012',
    expiry: '09/24',
    type: 'Visa Signature',
    color: '#00008B',
    logo: require('../assets/card-logos/mastercard.png'),
  },
];

export default function CreditCardList() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Top Cards</Text>
      {mockCards.map((card, index) => (
        <Animated.View 
          key={card.id}
          entering={FadeInUp.delay(index * 200)}
          style={[styles.card, { backgroundColor: card.color }]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{card.name}</Text>
            <Image source={card.logo} style={styles.cardLogo} resizeMode="contain" />
          </View>
          <Text style={styles.cardNumber}>{card.number}</Text>
          <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  card: {
    width: width - 40,
    height: 180,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardLogo: {
    width: 40,
    height: 40,
  },
  cardNumber: {
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 20,
    fontFamily: 'System',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
});