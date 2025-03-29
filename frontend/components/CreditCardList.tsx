import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { CreditCard } from "../types/CreditCard";
import CardInfoModal from "./CardInfoModal";

interface CreditCardListProps {
  cards: CreditCard[];
}

export default function CreditCardList({ cards }: CreditCardListProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleCardPress = (card: CreditCard) => {
    setSelectedCard(card);
    setInfoModalVisible(true);
  };

  const closeInfoModal = () => {
    setInfoModalVisible(false);
  };

  const maskCardNumber = (number: string) => {
    // Remove any spaces from the number
    const cleaned = number.replace(/\s/g, "");
    // Get last 4 digits
    const lastFour = cleaned.slice(-4);
    // For Amex (15 digits) or regular cards (16 digits)
    const maskLength = cleaned.length - 4;
    // Create masked part with proper spacing using medium bullet point •
    const masked = "•".repeat(maskLength).replace(/(.{4})/g, "$1 ");
    // Return masked number with last 4 digits
    return `${masked}${lastFour}`;
  };

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={card.id}
          onPress={() => handleCardPress(card)}
          activeOpacity={0.8}
        >
          <Animated.View
            entering={FadeInUp.delay(index * 200)}
            style={[styles.card, { backgroundColor: card.color }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{card.cardName}</Text>
              <Text style={styles.cardType}>{card.type}</Text>
            </View>
            <Text style={styles.cardNumber}>{maskCardNumber(card.number)}</Text>
            <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
      
      <CardInfoModal
        visible={infoModalVisible}
        onClose={closeInfoModal}
        card={selectedCard}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  card: {
    width: width - 40,
    height: 180,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    flexShrink: 1,
    maxWidth: "70%",
  },
  cardType: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    fontWeight: "500",
    textAlign: "right",
  },
  cardNumber: {
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 20,
    fontFamily: "System",
  },
  cardExpiry: {
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
