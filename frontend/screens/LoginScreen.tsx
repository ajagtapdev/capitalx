import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "../contexts/UserContext";
import { supabase } from "../lib/supabase";

interface LoginScreenProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function LoginScreen({ setIsAuthenticated }: LoginScreenProps) {
  const { setUser } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignIn = async () => {
    try {
      if (!form.email.trim() || !form.password.trim()) {
        throw new Error("Please fill in all fields");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", form.email.toLowerCase())
        .single();

      if (error) {
        throw new Error("User not found");
      }

      if (data.password !== form.password) {
        throw new Error("Invalid password");
      }

      // Set the global user context
      setUser(data);
      setIsAuthenticated(true);
      console.log("Signed in successfully:", data);
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      if (!form.email.trim() || !form.fullName.trim()) {
        throw new Error("Name and email are required");
      }

      if (form.password !== form.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      // Then insert into users table with all fields
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            email: form.email,
            name: form.fullName,
            password: form.password,
            phone_number: form.phoneNumber || null,
            address: form.address || null,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      console.log("Signed up:", userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Error signing up:", error.message);
    }
  };

  const renderInitialView = () => (
    <View style={styles.formAction}>
      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => setShowSignIn(true)}
      >
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => setShowSignUp(true)}
      >
        <Text style={[styles.btnText, { color: "#0A84FF" }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpForm = () => (
    <View>
      <View style={styles.input}>
        <Text style={styles.inputLabel}>
          Full Name<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Enter your full name"
          placeholderTextColor="#6B7280"
          value={form.fullName}
          onChangeText={(text) => setForm({ ...form, fullName: text })}
          autoCapitalize="words"
          textContentType="name"
        />
      </View>

      <View style={styles.input}>
        <Text style={styles.inputLabel}>
          Email<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Enter your email"
          placeholderTextColor="#6B7280"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.input}>
        <Text style={styles.inputLabel}>
          Password<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Enter your password"
          placeholderTextColor="#6B7280"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
          autoComplete="off"
          textContentType="none"
        />
      </View>

      <View style={styles.input}>
        <Text style={styles.inputLabel}>
          Confirm Password<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Confirm your password"
          placeholderTextColor="#6B7280"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          secureTextEntry
          autoComplete="off"
          textContentType="none"
        />
      </View>

      <View style={styles.formAction}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleSignUp}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignInForm = () => (
    <View>
      <View style={styles.input}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Enter your email"
          placeholderTextColor="#6B7280"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.input}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.inputControl}
          placeholder="Enter your password"
          placeholderTextColor="#6B7280"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
          autoComplete="off"
          textContentType="none"
        />
      </View>

      <View style={styles.formAction}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleSignIn}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      >
        <Text style={styles.formFooter}>
          Don't have an account?{" "}
          <Text style={{ color: "#0A84FF", textDecorationLine: "underline" }}>
            Sign up
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (showSignUp) return renderSignUpForm();
    if (showSignIn) return renderSignInForm();
    return renderInitialView();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome to <Text style={{ color: "#0A84FF" }}>capitalX</Text>
          </Text>
          <Text style={styles.subtitle}>Your smart card selector</Text>
        </View>

        <ScrollView style={styles.form}>
          {renderContent()}

          <TouchableOpacity
            onPress={() => {
              setShowSignIn(false);
              setShowSignUp(false);
              setForm({
                email: "",
                password: "",
                confirmPassword: "",
                fullName: "",
                phoneNumber: "",
                address: "",
              });
            }}
          >
            <Text style={styles.formLink}>
              {showSignIn || showSignUp ? "Back" : "Forgot password?"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    textAlignVertical: "center",
    paddingTop: 0,
  },
  formAction: {
    marginTop: 24,
    gap: 16,
  },
  btnPrimary: {
    backgroundColor: "#0A84FF",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0A84FF",
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
  required: {
    color: "#FF453A",
    marginLeft: 4,
  },
});
