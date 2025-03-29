import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome to <Text style={{ color: "#0A84FF" }}>CapitalX</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formAction}>
            <TouchableOpacity>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in With Amazon</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.formFooter}>
          Don't have an account?{" "}
          <Text style={{ color: "#0A84FF", textDecorationLine: "underline" }}>
            Sign up
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#222222",
  },
  formAction: {
    marginTop: 24,
  },
  btn: {
    backgroundColor: "#0A84FF",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  formLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A84FF",
    textAlign: "center",
    marginTop: 16,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    paddingVertical: 16,
  },
});
