import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ProductCardProps {
  productName: string;
  productPrice: string;
  productRating: string;
  imageUrl: string[];
  description?: string;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productPrice,
  productRating,
  imageUrl,
  description,
  onPress,
}) => {
  const renderStars = () => {
    const rating = parseFloat(productRating || '0');
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        // Full star
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
        // Partial star
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
        // Empty star
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl?.[0] || '' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {productName || 'Untitled Product'}
          </Text>
          
          {description && (
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{productPrice || '$0.00'}</Text>
          <View style={styles.ratingContainer}>
            {renderStars()}
            <Text style={styles.rating}> {productRating || '0.0'}</Text>
          </View>
        </View>
      </View>
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
  imageContainer: {
    width: 140,
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
    aspectRatio: 1,
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
});

export default ProductCard; 