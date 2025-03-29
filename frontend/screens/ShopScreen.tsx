import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  prime: boolean;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sony WH-1000XM4',
    price: 349.99,
    rating: 4.8,
    reviews: 12453,
    image: 'https://api.a0.dev/assets/image?text=premium%20wireless%20headphones%20modern%20sleek&aspect=1:1',
    prime: true,
  },
  {
    id: '2',
    name: 'MacBook Pro M2',
    price: 1299.99,
    rating: 4.9,
    reviews: 8932,
    image: 'https://api.a0.dev/assets/image?text=modern%20laptop%20professional%20sleek&aspect=1:1',
    prime: true,
  },
  {
    id: '3',
    name: 'iPhone 15 Pro',
    price: 999.99,
    rating: 4.7,
    reviews: 15678,
    image: 'https://api.a0.dev/assets/image?text=premium%20smartphone%20titanium%20finish&aspect=1:1',
    prime: true,
  },
];

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{item.rating}</Text>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.reviews}>({item.reviews.toLocaleString()})</Text>
        </View>
        <Text style={styles.price}>${item.price}</Text>
        {item.prime && (
          <View style={styles.primeTag}>
            <Text style={styles.primeText}>PRIME</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Featured Products</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={mockProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginTop: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },  productCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  reviews: {
    color: '#8E8E93',
    marginLeft: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A84FF',
    marginBottom: 8,
  },
  primeTag: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  primeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});