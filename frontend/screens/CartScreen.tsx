import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import KnotSDKModal from '../components/KnotSDKModal';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../contexts/UserContext';
import ProductCard from '../components/ProductCard';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [isKnotSDKVisible, setIsKnotSDKVisible] = useState(false);
  const [isPriceBreakdownVisible, setIsPriceBreakdownVisible] = useState(false);
  const NJ_TAX_RATE = 0.06625;
  const { user } = useUser();

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

      console.log("Cards refreshed after Knot SDK:", cardData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItemContainer}>
      <ProductCard
        productName={item.productName}
        productPrice={item.productPrice}
        imageUrl={item.imageUrl}
        quantity={item.quantity}
        onQuantityChange={(newQuantity) => updateQuantity(item.productName, newQuantity)}
        onDelete={() => removeFromCart(item.productName)}
        isCartItem={true}
      />
    </View>
  );

  const totalPrice = getTotalPrice() || 0;
  const subtotal = typeof totalPrice === 'number' ? totalPrice : 0;
  const tax = subtotal * NJ_TAX_RATE;
  const total = subtotal + tax;
  const formattedSubtotal = `$${subtotal.toFixed(2)}`;
  const formattedTax = `$${tax.toFixed(2)}`;
  const formattedTotal = `$${total.toFixed(2)}`;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.productName}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <AntDesign name="shoppingcart" size={64} color="#8E8E93" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        )}
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.priceBreakdownButton}
            onPress={() => setIsPriceBreakdownVisible(!isPriceBreakdownVisible)}
          >
            <View style={styles.priceHeader}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{formattedTotal}</Text>
            </View>
            <Text style={styles.tapText}>
              {isPriceBreakdownVisible ? 'Tap to collapse' : 'Tap to expand'}
            </Text>
            {isPriceBreakdownVisible && (
              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal:</Text>
                  <Text style={styles.priceValue}>{formattedSubtotal}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Tax (6.625%):</Text>
                  <Text style={styles.priceValue}>{formattedTax}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => setIsKnotSDKVisible(true)}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
      <KnotSDKModal
        visible={isKnotSDKVisible}
        onClose={() => setIsKnotSDKVisible(false)}
      />
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
    paddingBottom: 100,
  },
  cartItemContainer: {
    marginBottom: 8,
  },
  cartControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  priceBreakdownButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceBreakdown: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  priceValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  totalLabel: {
    fontSize: 18,
    color: '#8E8E93',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  tapText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default CartScreen; 