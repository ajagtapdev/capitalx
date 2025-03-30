import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductScreen from './ProductScreen';

interface SearchScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Sample product data - replace with your actual data source
  const products = [
    {
      productName: "iPhone 15 Pro Max",
      productPrice: "$1,199.99",
      productRating: "4.8",
      imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_US?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009284541",
      description: "Latest iPhone with A17 Pro chip",
      productCategory: "Electronics",
      productSeller: "Apple",
      deliveryDate: "2-3 days",
    },
    {
      productName: "MacBook Pro 16",
      productPrice: "$2,499.99",
      productRating: "4.9",
      imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-select-202206?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653493200207",
      description: "Powerful laptop for professionals",
      productCategory: "Electronics",
      productSeller: "Apple",
      deliveryDate: "2-3 days",
    },
    {
      productName: "AirPods Pro",
      productPrice: "$249.99",
      productRating: "4.7",
      imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
      description: "Wireless earbuds with noise cancellation",
      productCategory: "Electronics",
      productSeller: "Apple",
      deliveryDate: "2-3 days",
    },
    {
      productName: "iPad Pro 12.9",
      productPrice: "$1,099.99",
      productRating: "4.8",
      imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202104?wid=940&hei=1112&fmt=png-alpha&.v=1617126613000",
      description: "Professional tablet with M2 chip",
      productCategory: "Electronics",
      productSeller: "Apple",
      deliveryDate: "2-3 days",
    },
    {
      productName: "Apple Watch Series 9",
      productPrice: "$399.99",
      productRating: "4.6",
      imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-8s_VW_34FR_WF_CO?wid=1400&hei=1400&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1684518471234",
      description: "Advanced smartwatch with health features",
      productCategory: "Electronics",
      productSeller: "Apple",
      deliveryDate: "2-3 days",
    },
  ];

  const calculateRelevance = (query: string, product: any) => {
    const searchTerms = query.toLowerCase().split(' ');
    const productName = product.productName.toLowerCase();
    const productCategory = product.productCategory.toLowerCase();
    const productDescription = product.description.toLowerCase();
    
    let score = 0;
    
    // Check for exact matches in product name
    if (productName.includes(query.toLowerCase())) {
      score += 10;
    }
    
    // Check for partial matches in product name
    searchTerms.forEach(term => {
      if (productName.includes(term)) {
        score += 5;
      }
    });
    
    // Check for matches in category
    if (productCategory.includes(query.toLowerCase())) {
      score += 3;
    }
    
    // Check for matches in description
    if (productDescription.includes(query.toLowerCase())) {
      score += 2;
    }
    
    return score;
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      // Calculate relevance scores for all products
      const scoredProducts = products.map(product => ({
        ...product,
        relevance: calculateRelevance(searchQuery, product)
      }));
      
      // Sort by relevance and get top 3 suggestions
      const topSuggestions = scoredProducts
        .filter(product => product.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);
      
      setSuggestions(topSuggestions);
      
      // Get all matching products for search results
      const matchingProducts = scoredProducts
        .filter(product => product.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(matchingProducts);
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
  };

  const renderSuggestion = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => setSearchQuery(item.productName)}
    >
      <AntDesign name="search1" size={16} color="#8E8E93" style={styles.suggestionIcon} />
      <Text style={styles.suggestionText}>{item.productName}</Text>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: any) => (
    <ProductCard
      productName={item.productName}
      productPrice={item.productPrice}
      productRating={item.productRating}
      imageUrl={item.imageUrl}
      description={item.description}
      onPress={() => handleProductPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <AntDesign name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.productName}
              scrollEnabled={false}
            />
          </View>
        )}

        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.productName}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <AntDesign name="search1" size={64} color="#8E8E93" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No results found' : 'Search for products'}
              </Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {selectedProduct && (
        <ProductScreen
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
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
    marginTop: 16,
  },
});

export default SearchScreen; 