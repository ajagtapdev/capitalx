import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import ProductScreen from './ProductScreen';
import amazonProducts from '../amazon_products_new.json';

interface Product {
  productName: string;
  productPrice: string;
  productRating: string;
  imageUrl: string[];
  description: string;
  productCategory: string;
  productSeller: string;
  deliveryDate: string;
}

const ShopScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts] = useState<Product[]>(() => {
    try {
      const shuffled = [...(amazonProducts || [])].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    } catch (error) {
      console.error('Error initializing featured products:', error);
      return [];
    }
  });

  const searchAnimation = useRef(new Animated.Value(0)).current;

  const handleSearchChange = (query: string) => {
    const trimmedQuery = query?.trim() || '';
    setSearchQuery(query);
    
    if (!trimmedQuery) {
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchTerms = trimmedQuery.toLowerCase().split(' ');
      const suggestions = (amazonProducts || [])
        .filter((product: Product) => {
          if (!product) return false;
          const searchableText = `${product.productName || ''} ${product.productCategory || ''}`.toLowerCase();
          return searchTerms.some(term => searchableText.includes(term));
        })
        .slice(0, 5);

      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  const handleSearch = (query: string = searchQuery) => {
    const trimmedQuery = query?.trim() || '';
    if (!trimmedQuery) {
      setFilteredProducts([]);
      setIsSearchActive(false);
      setIsSearching(false);
      return;
    }

    try {
      const searchTerms = trimmedQuery.toLowerCase().split(' ');
      const results = (amazonProducts || []).filter((product: Product) => {
        if (!product) return false;
        const searchableText = `${product.productName || ''} ${product.productCategory || ''} ${product.description || ''}`.toLowerCase();
        return searchTerms.some(term => {
          if (term === 'technology') {
            return (
              (product.productCategory || '').toLowerCase().includes('electronics') ||
              (product.productName || '').toLowerCase().includes('apple') ||
              (product.productName || '').toLowerCase().includes('phone') ||
              (product.productName || '').toLowerCase().includes('laptop')
            );
          }
          return searchableText.includes(term);
        });
      });

      setFilteredProducts(results);
      setIsSearchActive(true);
      setIsSearching(false);
      setSearchSuggestions([]);
    } catch (error) {
      console.error('Error performing search:', error);
      setFilteredProducts([]);
      setIsSearchActive(false);
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsSearchActive(false);
      setSearchQuery('');
      setIsSearching(false);
      setSearchSuggestions([]);
    });
  };

  useEffect(() => {
    if (isSearchActive) {
      Animated.spring(searchAnimation, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    }
  }, [isSearchActive]);

  const renderHomeView = () => (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Today's Hits</Text>
      <FlatList
        data={featuredProducts}
        renderItem={({ item }) => (
          <ProductCard
            productName={item.productName}
            productPrice={item.productPrice}
            productRating={item.productRating}
            imageUrl={item.imageUrl}
            description={item.description}
            onPress={() => setSelectedProduct(item)}
          />
        )}
        keyExtractor={(item, index) => `${item.productName}-${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderSearchSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {searchSuggestions.map((item, index) => (
        <TouchableOpacity
          key={`${item.productName}-${index}`}
          style={styles.suggestionItem}
          onPress={() => {
            setSearchQuery(item.productName);
            handleSearch(item.productName);
          }}
        >
          <AntDesign name="search1" size={16} color="#8E8E93" style={styles.suggestionIcon} />
          <Text style={styles.suggestionText} numberOfLines={1}>
            {item.productName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchView = () => (
    <Animated.View 
      style={[
        styles.searchContainer,
        {
          opacity: searchAnimation,
          transform: [{
            translateX: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.searchHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <AntDesign name="left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.searchResultsTitle}>Search results</Text>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            productName={item.productName}
            productPrice={item.productPrice}
            productRating={item.productRating}
            imageUrl={item.imageUrl}
            description={item.description}
            onPress={() => setSelectedProduct(item)}
          />
        )}
        keyExtractor={(item, index) => `${item.productName}-${index}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        )}
      />
    </Animated.View>
  );

  if (selectedProduct) {
    return (
      <ProductScreen
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchInputContainer}>
        <AntDesign name="search1" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={() => handleSearch()}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              handleSearch('');
            }}
            style={styles.clearButton}
          >
            <AntDesign name="close" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching && searchSuggestions.length > 0 ? renderSearchSuggestions() : null}
      {isSearchActive ? renderSearchView() : renderHomeView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  searchResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 8,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default ShopScreen;