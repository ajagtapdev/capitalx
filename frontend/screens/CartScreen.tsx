import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import ImageSlideshow from '../components/ImageSlideshow';
import ProductScreen from './ProductScreen';
import KnotSDKModal from '../components/KnotSDKModal';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [isKnotSDKVisible, setIsKnotSDKVisible] = useState(false);

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
              onPress={() => setIsKnotSDKVisible(true)}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <KnotSDKModal
        visible={isKnotSDKVisible}
        onClose={() => setIsKnotSDKVisible(false)}
        totalAmount={getTotalPrice()}
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
});

export default CartScreen; 