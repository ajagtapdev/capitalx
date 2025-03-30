import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";

interface SettingsInterfaceProps {
  onClose: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

const SettingsInterface: React.FC<SettingsInterfaceProps> = ({
  onClose,
  setIsAuthenticated,
}) => {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Settings Options */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="person" size={24} color="#FFFFFF" />
          <Text style={styles.optionText}>Account</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
          <Text style={styles.optionText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="privacy-tip" size={24} color="#FFFFFF" />
          <Text style={styles.optionText}>Privacy</Text>
          <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
        <View style={styles.settingsItemContent}>
          <Text style={[styles.settingsItemText, { color: "#FF453A" }]}>
            Log Out
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#FFFFFF",
  },
  settingsItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  settingsItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsItemText: {
    fontSize: 17,
    fontWeight: "500",
  },
});

export default SettingsInterface;
