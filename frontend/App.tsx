import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import HomeScreen from "./screens/HomeScreen";
import ShopScreen from "./screens/ShopScreen";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#0A84FF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabel: ({ color }) => null,
      }}
    >
      <Tab.Screen 
        name="Profile" 
        component={HomeScreen}
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
    </Tab.Navigator>
  );
}

export default function App() {  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      <TouchableOpacity style={styles.chatButton} onPress={() => {/* Handle chat */}}>
        <MaterialIcons name="chat" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBar: {
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#222222',
    elevation: 0,
    height: 60,
    paddingBottom: 8,
    position: 'relative',
  },
  chatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A84FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});