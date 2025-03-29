import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AddCardButtonProps {
  onPress: () => void;
}

export default function AddCardButton({ onPress }: AddCardButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8E8E93",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8E8E93",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
