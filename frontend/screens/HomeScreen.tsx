import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import CreditCardList from "../components/CreditCardList";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { Modal } from "react-native";
import SettingsInterface from "../components/SettingsInterface";

export default function HomeScreen() {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const showSettings = () => {
    setIsSettingsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 85,
      friction: 9,
      velocity: 1,
    }).start();
  };

  const hideSettings = () => {
    setIsSettingsVisible(false);
    Animated.spring(slideAnim, {
      toValue: 400,
      useNativeDriver: true,
      tension: 85,
      friction: 9,
      velocity: 1,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20avatar&aspect=1:1",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good evening, Alex</Text>
              <Text style={styles.subtitle}>Premium Member</Text>
            </View>
          </View>
          <TouchableOpacity onPress={showSettings}>
            <MaterialIcons name="settings" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <CreditCardList />
      </ScrollView>
      <Modal
        visible={isSettingsVisible}
        animationType="none"
        transparent={true}
        onRequestClose={hideSettings}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 400],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <SettingsInterface onClose={hideSettings} />
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    backgroundColor: "#1A1A1A",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#0A84FF",
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#0A84FF",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "85%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    borderLeftWidth: 1,
    borderLeftColor: "#222222",
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
