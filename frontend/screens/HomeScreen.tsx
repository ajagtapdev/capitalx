import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  ActivityIndicator,
} from "react-native";
import CreditCardList from "../components/CreditCardList";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import SettingsInterface from "../components/SettingsInterface";
import AddCardButton from "../components/AddCardButton";
import CardDetailsModal from "../components/CardDetailsModal";
import { CreditCard } from "../types/CreditCard";
import { useUser } from "../contexts/UserContext";
import { supabase } from "../lib/supabase";

export default function HomeScreen({ setIsAuthenticated }) {
  const { user } = useUser();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Function to get card color based on type
  const getCardColor = (cardNumber: string): string => {
    // First digit of card number determines card type
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
      case "4":
        return "#1A1F71"; // Visa blue
      case "5":
        return "#EB001B"; // Mastercard red
      case "3":
        return "#1E1E1E"; // Amex black
      default:
        return "#006B54"; // Default green
    }
  };

  // Function to determine card type based on card number
  const getCardType = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
      case "4":
        return "VISA";
      case "5":
        return "MASTERCARD";
      case "3":
        return "AMERICAN EXPRESS";
      default:
        return "UNKNOWN";
    }
  };

  // Function to fetch cards from Supabase
  const fetchCards = async () => {
    try {
      if (!user?.id) return;

      const { data: cardData, error } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cards:", error);
        return;
      }

      // Transform the database cards into the CreditCard interface format
      const transformedCards: CreditCard[] = cardData.map((dbCard) => ({
        id: dbCard.id,
        cardName: getCardType(dbCard.number), // Derive card name from number
        holderName: dbCard.cardholder_name,
        number: dbCard.number,
        expiry: dbCard.expiry,
        type: getCardType(dbCard.number),
        color: getCardColor(dbCard.number),
        securityCode: dbCard.security,
        creditLimit: dbCard.credit_limit,
        benefits: dbCard.benefits,
        apr: dbCard.apr,
      }));

      setCards(transformedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cards when component mounts and when user changes
  useEffect(() => {
    fetchCards();
  }, [user]);

  const addNewCard = (cardDetails: Omit<CreditCard, "id">) => {
    const newCard: CreditCard = {
      id: Date.now(), // This will be replaced by the database ID
      ...cardDetails,
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
              <Text style={styles.greeting}>
                Good evening, {user?.name ?? "Guest"}
              </Text>
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
          <Text style={styles.sectionTitle}>Your Cards</Text>
          <AddCardButton onPress={() => setIsAddCardVisible(true)} />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <CreditCardList cards={cards} />
        )}
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
                <SettingsInterface
                  onClose={hideSettings}
                  setIsAuthenticated={setIsAuthenticated}
                />
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
