import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { CreditCard } from "../types/CreditCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CardDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  cardName: string;
  setCardName: (name: string) => void;
  cardNumber: string;
  setCardNumber: (number: string) => void;
  onAddCard: (card: Omit<CreditCard, "id">) => void;
}

const lookupBIN = async (bin: string) => {
  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export default function CardDetailsModal({
  visible,
  onClose,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  onAddCard,
}: CardDetailsModalProps) {
  const [step, setStep] = useState(1);
  const [expiry, setExpiry] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardType, setCardType] = useState("");
  const insets = useSafeAreaInsets();
  // Validation functions
  const formatCardNumber = (input: string) => {
    // Remove any non-digit characters
    const cleaned = input.replace(/\D/g, "");
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    // Limit to 16 digits plus spaces
    return formatted.slice(0, 19);
  };

  const formatExpiry = (input: string) => {
    // Remove any non-digit characters
    const cleaned = input.replace(/\D/g, "");
    // Add slash after 2 digits (MM/YY)
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const isExpiryValid = (expiry: string) => {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Convert to numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Validate month range
    if (monthNum < 1 || monthNum > 12) return false;

    // Check if card is expired
    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  // Update the input handlers
  const handleCardNumberChange = async (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);

    // If we have at least 8 digits (BIN length), look up the card info
    const cleaned = formatted.replace(/\D/g, "");
    if (cleaned.length >= 8) {
      const binInfo = await lookupBIN(cleaned.substring(0, 8));
      if (binInfo) {
        // Set card type and brand based on BIN lookup
        setCardType(binInfo.scheme ? binInfo.scheme.toUpperCase() : "");
      }
    }
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setExpiry(formatted);
  };

  const handleSecurityCodeChange = (text: string) => {
    // Only allow numbers and limit to 4 digits (for Amex)
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    setSecurityCode(cleaned);
  };

  // Update validation
  const isStep1Valid =
    cardName.trim() !== "" && cardNumber.replace(/\s/g, "").length >= 15;
  const isStep2Valid = isExpiryValid(expiry) && securityCode.length >= 3;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Create new card with BIN-based information
      onAddCard({
        cardName: `${cardType} ${
          cardType === "AMERICAN EXPRESS" ? "Platinum" : "Signature"
        }`,
        holderName: cardName, // The user's input name
        number: cardNumber,
        expiry: expiry,
        type: cardType as
          | "Visa Infinite"
          | "Visa Signature"
          | "American Express"
          | "Mastercard",
        color: getCardColor(cardType),
        securityCode: securityCode,
      });

      // Reset form
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setSecurityCode("");
      setCardType("");
      setStep(1);

      onClose();
    }
  };

  const getCardColor = (type: string): string => {
    switch (type.toUpperCase()) {
      case "VISA":
        return "#1A1F71"; // Visa blue
      case "MASTERCARD":
        return "#EB001B"; // Mastercard red
      case "AMERICAN EXPRESS":
        return "#1E1E1E"; // Amex black
      default:
        return "#006B54"; // Default green
    }
  };

  const renderStep1 = () => (
    <View style={styles.content}>
      <Text style={styles.subtitle}>
        Verify and complete your card information
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#8E8E93"
          autoCapitalize="words"
          value={cardName}
          onChangeText={setCardName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Credit Card</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your card number"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          maxLength={19} // 16 digits + 3 spaces
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.content}>
      <Text style={styles.subtitle}>Enter card expiry and security code</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Expiry Date</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          value={expiry}
          onChangeText={handleExpiryChange}
          maxLength={5} // MM/YY format
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Security Code</Text>
        <TextInput
          style={styles.input}
          placeholder="CVV"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          value={securityCode}
          onChangeText={handleSecurityCodeChange}
          maxLength={4} // Allow for Amex cards which have 4 digits
          secureTextEntry
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
      <View style={styles.modalContainer}>
      
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={step === 1 ? onClose : () => setStep(1)}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Card Details</Text>
            {step === 1 ? (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !isStep1Valid && styles.nextButtonDisabled,
                ]}
                disabled={!isStep1Valid}
                onPress={handleNext}
              >
                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color={isStep1Valid ? "#FFFFFF" : "#8E8E93"}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.doneButton,
                  !isStep2Valid && styles.nextButtonDisabled,
                ]}
                disabled={!isStep2Valid}
                onPress={handleNext}
              >
                <Text
                  style={[
                    styles.doneText,
                    !isStep2Valid && styles.doneTextDisabled,
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {step === 1 ? renderStep1() : renderStep2()}
        
      </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  backButton: {
    padding: 10,
  },
  nextButton: {
    padding: 10,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  doneButton: {
    padding: 10,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  doneTextDisabled: {
    opacity: 0.5,
  },
});
