import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const mockCards = [
  {
    id: 1,
    name: 'Sapphire Reserve',
    number: '••••  ••••  ••••  4589',
    expiry: '12/25',
    type: 'Visa Infinite',
    color: '#0047AB',
    logo: require('../assets/card-logos/visa.png'),
    apr: '16.99% - 23.99%',
    creditLimit: '$25,000',
    benefits: [
      '5x points on travel through Chase Ultimate Rewards',
      '3x points on dining and select streaming services',
      '1x points on all other purchases',
      'Global Entry or TSA PreCheck credit',
      'Priority Pass airport lounge access'
    ],
    annualFee: '$550',
    introOffer: '60,000 bonus points after spending $4,000 in first 3 months'
  },
  {
    id: 2,
    name: 'Platinum Card',
    number: '••••  ••••  ••••  3782',
    expiry: '03/26',
    type: 'American Express',
    color: '#1E1E1E',
    logo: require('../assets/card-logos/amex.png'),
    apr: 'N/A (Charge Card)',
    creditLimit: 'No preset spending limit',
    benefits: [
      '5x points on flights booked directly with airlines',
      '5x points on prepaid hotels through AmexTravel.com',
      'Centurion Lounge access',
      'Global Entry or TSA PreCheck credit',
      '$200 airline fee credit',
      '$200 Uber credit annually'
    ],
    annualFee: '$695',
    introOffer: '80,000 points after spending $6,000 in first 6 months'
  },
  {
    id: 3,
    name: 'Freedom Unlimited',
    number: '••••  ••••  ••••  6011',
    expiry: '09/24',
    type: 'Visa Signature',
    color: '#00008B',
    logo: require('../assets/card-logos/visa.png'),
    apr: '14.99% - 23.74%',
    creditLimit: '$8,000',
    benefits: [
      '5% cash back on travel through Chase Ultimate Rewards',
      '3% cash back on dining and drugstores',
      '1.5% cash back on all other purchases',
      'No annual fee'
    ],
    annualFee: '$0',
    introOffer: '$200 bonus after spending $500 in first 3 months'
  },
  {
    id: 4,
    name: 'Freedom Unlimited',
    number: '••••  ••••  ••••  6012',
    expiry: '09/24',
    type: 'Visa Signature',
    color: '#00008B',
    logo: require('../assets/card-logos/mastercard.png'),
    apr: '14.99% - 23.74%',
    creditLimit: '$8,000',
    benefits: [
      '5% cash back on travel through Chase Ultimate Rewards',
      '3% cash back on dining and drugstores',
      '1.5% cash back on all other purchases',
      'No annual fee'
    ],
    annualFee: '$0',
    introOffer: '$200 bonus after spending $500 in first 3 months'
  },
];

interface CardDetailsModalProps {
  card: typeof mockCards[0];
  visible: boolean;
  onClose: () => void;
}

function CardDetailsModal({ card, visible, onClose }: CardDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: card.color }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{card.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>APR</Text>
              <Text style={styles.infoValue}>{card.apr}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Credit Limit</Text>
              <Text style={styles.infoValue}>{card.creditLimit}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Annual Fee</Text>
              <Text style={styles.infoValue}>{card.annualFee}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Intro Offer</Text>
              <Text style={styles.infoValue}>{card.introOffer}</Text>
            </View>
            
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Key Benefits</Text>
              {card.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CreditCardList() {
  const [selectedCard, setSelectedCard] = useState<typeof mockCards[0] | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Top Cards</Text>
      {mockCards.map((card, index) => (
        <TouchableOpacity
          key={card.id}
          onPress={() => setSelectedCard(card)}
        >
          <Animated.View 
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
        </TouchableOpacity>
      ))}
      
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          visible={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    maxHeight: '80%',
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  benefitsSection: {
    marginTop: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
});