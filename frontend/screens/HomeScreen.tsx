import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from "react-native";
import CreditCardList from "../components/CreditCardList";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import SettingsInterface from "../components/SettingsInterface";
import AddCardButton from "../components/AddCardButton";
import CardDetailsModal from "../components/CardDetailsModal";
import { CreditCard } from "../types/CreditCard";

const initialCards: CreditCard[] = [
  {
    id: 1,
    cardName: "Chase Sapphire Reserve",
    holderName: "Alex Smith",
    number: "4532 7589 4521 4589",
    expiry: "12/25",
    type: "Visa Infinite",
    color: "#0A84FF", // iOS Blue
    securityCode: "123",
  },
  {
    id: 2,
    cardName: "American Express Platinum",
    holderName: "Alex Smith",
    number: "3782 123456 93782",
    expiry: "03/26",
    type: "American Express",
    color: "#1C1C1E", // Dark Gray/Almost Black
    securityCode: "1234",
  },
  {
    id: 3,
    cardName: "Capital One Venture",
    holderName: "Alex Smith",
    number: "5412 7532 4521 5678",
    expiry: "09/24",
    type: "Mastercard",
    color: "#2C2C2E", // Slightly Lighter Gray
    securityCode: "123",
  },
  // ... other initial cards
];

export default function HomeScreen() {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cards, setCards] = useState<CreditCard[]>(initialCards);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const showSettings = () => {
    setIsSettingsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 85,
      friction: 9,
      velocity: 1,
    }).start();
  };

  const hideSettings = () => {
    setIsSettingsVisible(false);
    Animated.spring(slideAnim, {
      toValue: 400,
      useNativeDriver: true,
      tension: 85,
      friction: 9,
      velocity: 1,
    }).start();
  };

  const addNewCard = (cardDetails: Omit<CreditCard, "id">) => {
    let cardColor = "#0A84FF";

    const firstDigit = cardDetails.number.charAt(0);
    switch (firstDigit) {
      case "4":
        cardColor = "#0A84FF"; // iOS Blue for Visa
        break;
      case "5":
        cardColor = "#2C2C2E"; // Gray for Mastercard
        break;
      case "3":
        cardColor = "#1C1C1E"; // Dark Gray/Almost Black for Amex
        break;
      default:
        cardColor = "#3A3A3C"; // Different shade of gray for others
    }

    const newCard: CreditCard = {
      id: Date.now(),
      cardName: "Credit Card", // The displayed name of the card product
      holderName: cardDetails.holderName, // The user's name (stored but not displayed)
      number: cardDetails.number,
      expiry: cardDetails.expiry,
      type: "Visa Infinite",
      color: cardColor,
      securityCode: cardDetails.securityCode,
    };

    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20avatar&aspect=1:1",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good evening, Alex</Text>
              <Text style={styles.subtitle}>Premium Member</Text>
            </View>
          </View>
          <TouchableOpacity onPress={showSettings}>
            <MaterialIcons name="settings" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Top Cards</Text>
          <AddCardButton onPress={() => setIsAddCardVisible(true)} />
        </View>
        <CreditCardList cards={cards} />
      </ScrollView>
      <Modal
        visible={isSettingsVisible}
        animationType="none"
        transparent={true}
        onRequestClose={hideSettings}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContentContainer}>
            <TouchableOpacity
              style={styles.modalLeftSection}
              activeOpacity={1}
              onPress={hideSettings}
            />
            <TouchableOpacity
              style={styles.modalRightSection}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateX: slideAnim }],
                    opacity: slideAnim.interpolate({
                      inputRange: [0, 400],
                      outputRange: [1, 0],
                    }),
                  },
                ]}
              >
                <SettingsInterface onClose={hideSettings} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <CardDetailsModal
        visible={isAddCardVisible}
        onClose={() => setIsAddCardVisible(false)}
        cardName={cardName}
        setCardName={setCardName}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        onAddCard={addNewCard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    backgroundColor: "#1A1A1A",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#0A84FF",
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#0A84FF",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  modalLeftSection: {
    flex: 1,
  },
  modalRightSection: {
    width: "85%",
  },
  modalContent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    borderLeftWidth: 1,
    borderLeftColor: "#222222",
    paddingTop: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
