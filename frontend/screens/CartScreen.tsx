import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import ImageSlideshow from '../components/ImageSlideshow';
import ProductScreen from './ProductScreen';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';

// Define the card interface
interface CreditCard {
  id: number;
  cardName: string;
  type: string;
  number: string;
  expiry: string;
  color: string;
  rewards?: string[];
  benefits?: string[];
}

interface BestCardResponse {
  bestCard: {
    reason: string;
  }
}

interface CartScreenProps {
  navigation: any;
}

const { width } = Dimensions.get("window");

const API_URL = 'http://127.0.0.1:5000'; // Change to your Flask server URL

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [bestCard, setBestCard] = useState<BestCardResponse['bestCard'] | null>(null);
  const { user } = useUser();

  // Fetch cards when component mounts
  useEffect(() => {
    fetchUserCards();
  }, []);

  const fetchUserCards = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq("user_id", user?.id || '');

      if (error) throw error;
      if (data) setCards(data as CreditCard[]);
    } catch (error) {
      console.error('Error fetching cards:', error);
      Alert.alert('Error', 'Failed to load your cards');
    }
  };

  const getBestCard = async () => {
    setIsLoading(true);
    try {
      // Prepare data to send to backend
      const payload = {
        cards: cards.map(card => ({
          cardName: card.cardName,
          type: card.type,
          number: card.number,
          rewards: card.rewards || [],
          benefits: card.benefits || []
        })),
        cartItems: items.map(item => ({
          productName: item.productName,
          productPrice: item.productPrice,
          productCategory: item.productCategory || 'Uncategorized',
          quantity: item.quantity
        }))
      };

      // Call Flask backend using fetch
      const response = await fetch(`${API_URL}/best-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!data.bestCard) {
        setIsLoading(false);
        Alert.alert('No Card Found', 'Could not determine the best card for this purchase.');
        return;
      }
      
      setBestCard(data.bestCard);
      setIsLoading(false);
      setIsCardModalVisible(true);
    } catch (error) {
      console.error('Error getting best card:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to determine the best card for this purchase');
    }
  };

  const handleCheckout = () => {
    if (cards.length === 0) {
      Alert.alert(
        'No Cards Found',
        'You need to add at least one card to your account',
        [
          { text: 'Cancel' },
          { 
            text: 'Add Card', 
            onPress: () => navigation.navigate('Wallet') 
          }
        ]
      );
      return;
    }
    
    getBestCard();
  };

  const handleCardSelect = () => {
    setIsCardModalVisible(false);
    setIsConfirmationVisible(true);
  };

  const handleDone = () => {
    setIsConfirmationVisible(false);
    clearCart();
  };

  const handleProductPress = (item: any) => {
    navigation.navigate('Product', {
      product: {
        productName: item.productName,
        productPrice: item.productPrice,
        productRating: item.productRating || "0",
        imageUrl: item.imageUrl,
        description: item.description || "No description available",
        productCategory: item.productCategory || "Uncategorized",
        productSeller: item.productSeller || "Unknown Seller",
        deliveryDate: item.deliveryDate || "Standard Delivery",
      },
      onClose: () => navigation.goBack(),
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.cartItem}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.imageContainer}>
        <ImageSlideshow
          images={item.imageUrl}
          height={120}
          autoPlay={false}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={styles.itemPrice}>{item.productPrice}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.productName, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <AntDesign name="minus" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.productName, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <AntDesign name="plus" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.productName)}
      >
        <AntDesign name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getCardColor = (cardName: string): string => {
    // Find the card in our list and return its color
    const card = cards.find(c => c.cardName === cardName);
    return card?.color || '#0A84FF'; // Default blue if not found
  };

  const CardSelectionModal = () => (
    <Modal
      visible={isCardModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsCardModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Best Card for This Purchase</Text>
          
          {bestCard && (
            <>
              <View style={[styles.creditCard, { backgroundColor: getCardColor(bestCard.cardName) }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>Chosen Card</Text>
                </View>
                
                <Text style={styles.cardNumber}>•••• •••• •••• ••••</Text>
                <Text style={styles.cardReward}>{bestCard.reason}</Text>
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsCardModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={handleCardSelect}
                >
                  <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const LoadingModal = () => (
    <Modal
      visible={isLoading}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={styles.loadingText}>Finding best card...</Text>
        </View>
      </View>
    </Modal>
  );

  const ConfirmationModal = () => (
    <Modal
      visible={isConfirmationVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsConfirmationVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.confirmationContent}>
          <AntDesign name="checkcircle" size={60} color="#4CD964" />
          <Text style={styles.confirmationText}>Payment Confirmed!</Text>
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AntDesign name="shoppingcart" size={64} color="#8E8E93" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.productName}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
          <CardSelectionModal />
          <ConfirmationModal />
          <LoadingModal />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 120,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 16,
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    marginTop: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A84FF',
  },
  checkoutButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  creditCard: {
    width: width - 88,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    backgroundColor: '#0A84FF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    flexShrink: 1,
    maxWidth: '70%',
  },
  cardType: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 20,
    fontFamily: 'System',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  cardReward: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    backgroundColor: '#1A1A1A',
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default CartScreen; 