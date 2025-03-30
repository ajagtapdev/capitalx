import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ProductCardProps {
  productName: string;
  productPrice: string;
  productRating?: string;
  imageUrl: string | string[];
  description?: string;
  onPress?: () => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onDelete?: () => void;
  isCartItem?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productPrice,
  productRating,
  imageUrl,
  description,
  onPress,
  quantity,
  onQuantityChange,
  onDelete,
  isCartItem = false,
}) => {
  const renderStars = () => {
    if (!productRating) return null;
    const rating = parseFloat(productRating);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars.push(
          <View key={i} style={styles.starContainer}>
            <AntDesign
              name="star"
              size={12}
              color="#FFD700"
              style={styles.star}
            />
          </View>
        );
      } else if (rating > i) {
        const percent = Math.max(0, Math.min(100, (rating - i) * 100));
        stars.push(
          <View key={i} style={styles.starContainer}>
            <View style={styles.starBaseContainer}>
              <AntDesign
                name="star"
                size={12}
                color="#8E8E93"
                style={styles.star}
              />
            </View>
            <View style={[styles.starFillContainer, { width: `${percent}%` }]}>
              <View style={{ position: 'absolute', left: 0, top: 0 }}>
                <AntDesign
                  name="star"
                  size={12}
                  color="#FFD700"
                />
              </View>
            </View>
          </View>
        );
      } else {
        stars.push(
          <View key={i} style={styles.starContainer}>
            <AntDesign
              name="star"
              size={12}
              color="#8E8E93"
              style={styles.star}
            />
          </View>
        );
      }
    }
    return stars;
  };

  const cardContent = (
    <View style={isCartItem ? styles.cartContainer : styles.container}>
      <View style={isCartItem ? styles.cartImageContainer : styles.imageContainer}>
        <Image
          source={{ uri: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.contentContainer}>
          <Text style={isCartItem ? styles.cartName : styles.name} numberOfLines={2}>
            {productName || 'Untitled Product'}
          </Text>
          
          {description && !isCartItem && (
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          )}
        </View>

        <View style={isCartItem ? styles.cartBottomRow : styles.bottomRow}>
          <Text style={styles.price}>{productPrice || '$0.00'}</Text>
          {!isCartItem && productRating && (
            <View style={styles.ratingContainer}>
              {renderStars()}
              <Text style={styles.rating}> {productRating}</Text>
            </View>
          )}
          {isCartItem && (
            <View style={styles.cartControls}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => onQuantityChange?.(quantity! - 1)}
                  style={styles.quantityButton}
                >
                  <AntDesign name="minus" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => onQuantityChange?.(quantity! + 1)}
                  style={styles.quantityButton}
                >
                  <AntDesign name="plus" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={onDelete}
              >
                <AntDesign name="delete" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  if (isCartItem) {
    return cardContent;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      {cardContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 12,
    height: 160,
  },
  cartContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 0,
    marginVertical: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 8,
    height: 120,
  },
  imageContainer: {
    width: 140,
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cartImageContainer: {
    width: 100,
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 22,
  },
  cartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cartBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    width: 16,
    height: 12,
    marginHorizontal: 2,
    position: 'relative',
  },
  starBaseContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  starFillContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    overflow: 'hidden',
  },
  star: {
    width: 12,
    height: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 4,
  },
});

export default ProductCard; 