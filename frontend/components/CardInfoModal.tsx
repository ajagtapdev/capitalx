import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { CreditCard } from "../types/CreditCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CardInfoModalProps {
  visible: boolean;
  onClose: () => void;
  card: CreditCard | null;
}

export default function CardInfoModal({
  visible,
  onClose,
  card,
}: CardInfoModalProps) {
  const insets = useSafeAreaInsets();

  if (!card) return null;

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Card Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Card Preview */}
          <View style={[styles.cardPreview, { backgroundColor: card.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{card.cardName}</Text>
              <Text style={styles.cardType}>{card.type}</Text>
            </View>
            <Text style={styles.cardNumber}>{maskCardNumber(card.number)}</Text>
            <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
            <Text style={styles.cardHolderName}>{card.holderName}</Text>
          </View>

          {/* Card Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Card Information</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Card Type</Text>
              <Text style={styles.detailValue}>{card.type}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Card Number</Text>
              <Text style={styles.detailValue}>{maskCardNumber(card.number)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cardholder</Text>
              <Text style={styles.detailValue}>{card.holderName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{card.expiry}</Text>
            </View>
            
            {card.apr && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>APR</Text>
                <Text style={styles.detailValue}>{card.apr}</Text>
              </View>
            )}
          </View>

          {/* Card Benefits */}
          {card.benefits && card.benefits.length > 0 && (
            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Card Benefits</Text>
              
              {card.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <MaterialIcons name="check-circle" size={18} color="#34C759" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cardPreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
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
    marginBottom: 16,
  },
  cardExpiry: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 12,
  },
  cardHolderName: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 8,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  detailLabel: {
    fontSize: 16,
    color: "#8E8E93",
  },
  detailValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  benefitText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
    flex: 1,
  },
}); 