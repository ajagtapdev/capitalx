import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ImageSlideshow from '../components/ImageSlideshow';
import { useCart } from '../context/CartContext';

interface ProductScreenProps {
  product: {
    productName: string;
    productPrice: string;
    productRating: string;
    imageUrl: string[];
    description: string;
    productCategory: string;
    productSeller: string;
    deliveryDate: string;
  };
  onClose: () => void;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ product, onClose }) => {
  const { addToCart, items, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      productName: product.productName,
      productPrice: product.productPrice,
      imageUrl: product.imageUrl,
      quantity: quantity,
      productRating: product.productRating,
      description: product.description,
      productCategory: product.productCategory,
      productSeller: product.productSeller,
      deliveryDate: product.deliveryDate,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const existingItem = items.find(item => item.productName === product.productName);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <ImageSlideshow 
          images={product.imageUrl}
          height={400}
          autoPlay={true}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{product.productName}</Text>
          <Text style={styles.price}>{product.productPrice}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, index) => (
                <AntDesign
                  key={index}
                  name="star"
                  size={16}
                  color={index < Math.floor(parseFloat(product.productRating)) ? '#FFD700' : '#8E8E93'}
                />
              ))}
            </View>
            <Text style={styles.rating}>{product.productRating}</Text>
          </View>

          <Text style={styles.seller}>Sold by: {product.productSeller}</Text>
          <Text style={styles.category}>Category: {product.productCategory}</Text>
          <Text style={styles.delivery}>Delivery: {product.deliveryDate}</Text>
          
          <Text style={styles.descriptionTitle}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {existingItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(product.productName, existingItem.quantity - 1)}
            >
              <AntDesign name="minus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{existingItem.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(product.productName, existingItem.quantity + 1)}
            >
              <AntDesign name="plus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addToCartContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity - 1)}
              >
                <AntDesign name="minus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity + 1)}
              >
                <AntDesign name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A84FF',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 16,
    color: '#8E8E93',
  },
  seller: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  delivery: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 80,
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
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    height: 50,
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductScreen; 