import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import HomeScreen from "./screens/HomeScreen";
import ShopScreen from "./screens/ShopScreen";
import LoginScreen from "./screens/LoginScreen";
import InsightsScreen from "./screens/InsightsScreen";
import CartScreen from "./screens/CartScreen";
import ChatInterface from "./components/ChatInterface";
import { CartProvider, useCart } from "./context/CartContext";
import { useState } from "react";
import { UserProvider } from "./contexts/UserContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CartIcon() {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <View style={{ position: 'relative' }}>
      <MaterialIcons name="shopping-cart" size={24} color="#8E8E93" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function TabNavigator({ setIsAuthenticated }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#0A84FF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabel: ({ color }) => null,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={(props) => (
          <HomeScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: () => <CartIcon />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insights" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={(props) => (
          <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <CartProvider>
        <SafeAreaProvider style={styles.container}>
          <Toaster />
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            {isAuthenticated ? (
              <>
                <TabNavigator setIsAuthenticated={setIsAuthenticated} />
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => setIsChatVisible(true)}
                >
                  <MaterialIcons name="chat" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <AuthStack setIsAuthenticated={setIsAuthenticated} />
            )}
          </NavigationContainer>

          <Modal
            visible={isChatVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsChatVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPress={() => setIsChatVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalContent}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <ChatInterface onClose={() => setIsChatVisible(false)} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </SafeAreaProvider>
      </CartProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  tabBar: {
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#222222",
    elevation: 0,
    height: 80,
    paddingBottom: 0,
    position: "relative",
  },
  chatButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0A84FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
