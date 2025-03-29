import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { CreditCard } from "../types/CreditCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, PermissionStatus, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";

interface CardDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  cardName: string;
  setCardName: (name: string) => void;
  cardNumber: string;
  setCardNumber: (number: string) => void;
  onAddCard: (card: Omit<CreditCard, "id">) => void;
}

const lookupBIN = async (bin: string) => {
  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}

export default function CardDetailsModal({
  visible,
  onClose,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  onAddCard,
}: CardDetailsModalProps) {
  const [step, setStep] = useState(1);
  const [expiry, setExpiry] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardType, setCardType] = useState("");
  const insets = useSafeAreaInsets();
  
  // New state variables for benefits step
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [aprRate, setAprRate] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);
  
  // Camera permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Request camera permission when needed
  const ensureCameraPermission = async () => {
    if (!cameraPermission?.granted) {
      const permissionResult = await requestCameraPermission();
      if (!permissionResult.granted) {
        Alert.alert(
          "Camera Permission",
          "We need camera access to scan your card. Please enable camera permissions in your device settings.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  // Handle showing camera
  const handleShowCamera = async () => {
    const hasPermission = await ensureCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
    }
  };

  // Handle camera ready state
  const handleCameraReady = () => {
    console.log("Camera is ready");
    setCameraReady(true);
  };

  // Validation functions
  const formatCardNumber = (input: string) => {
    // Remove any non-digit characters
    const cleaned = input.replace(/\D/g, "");
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    // Limit to 16 digits plus spaces
    return formatted.slice(0, 19);
  };

  const formatExpiry = (input: string) => {
    // Remove any non-digit characters
    const cleaned = input.replace(/\D/g, "");
    // Add slash after 2 digits (MM/YY)
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const isExpiryValid = (expiry: string) => {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Convert to numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Validate month range
    if (monthNum < 1 || monthNum > 12) return false;

    // Check if card is expired
    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  // Update the input handlers
  const handleCardNumberChange = async (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);

    // If we have at least 8 digits (BIN length), look up the card info
    const cleaned = formatted.replace(/\D/g, "");
    if (cleaned.length >= 8) {
      const binInfo = await lookupBIN(cleaned.substring(0, 8));
      if (binInfo) {
        // Set card type and brand based on BIN lookup
        setCardType(binInfo.scheme ? binInfo.scheme.toUpperCase() : "");
      }
    }
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setExpiry(formatted);
  };

  const handleSecurityCodeChange = (text: string) => {
    // Only allow numbers and limit to 4 digits (for Amex)
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    setSecurityCode(cleaned);
  };

  // Update validation
  const isStep1Valid =
    cardName.trim() !== "" && cardNumber.replace(/\s/g, "").length >= 15;
  const isStep2Valid = isExpiryValid(expiry) && securityCode.length >= 3;
  const isStep3Valid = aprRate.trim() !== "" && benefits.some(benefit => benefit.trim() !== "");

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Create new card with BIN-based information and benefits
      onAddCard({
        cardName: cardType,
        holderName: cardName, // The user's input name
        number: cardNumber,
        expiry: expiry,
        type: cardType,
        color: getCardColor(cardType),
        securityCode: securityCode,
        benefits: benefits.filter(benefit => benefit.trim() !== ""),
        apr: aprRate,
      });

      // Reset form
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setSecurityCode("");
      setCardType("");
      setBenefits([""]);
      setAprRate("");
      setStep(1);

      onClose();
    }
  };

  const getCardColor = (type: string): string => {
    switch (type.toUpperCase()) {
      case "VISA":
        return "#1A1F71"; // Visa blue
      case "MASTERCARD":
        return "#EB001B"; // Mastercard red
      case "AMERICAN EXPRESS":
        return "#1E1E1E"; // Amex black
      default:
        return "#006B54"; // Default green
    }
  };

  // Handle adding and removing benefit fields
  const addBenefitField = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefitField = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    if (newBenefits.length === 0) {
      newBenefits.push("");
    }
    setBenefits(newBenefits);
  };

  const updateBenefit = (text: string, index: number) => {
    const newBenefits = [...benefits];
    newBenefits[index] = text;
    setBenefits(newBenefits);
  };

  // Handle taking picture and sending to backend
  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        setIsLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        setShowCamera(false);
        await processCardImage(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
        setIsLoading(false);
        setShowCamera(false);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    } else {
      Alert.alert("Error", "Camera is not ready. Please try again.");
      setShowCamera(false);
      setIsLoading(false);
    }
  };

  const processCardImage = async (imageUri: string) => {
    try {
      // Call both endpoints in parallel
      await Promise.all([
        identifyCardFromImage(imageUri),
        scanCardFromImage(imageUri)
      ]);
      
      // After successful scan, move to step 2
      if (cardNumber) {
        setStep(2);
      }
    } catch (error) {
      console.error("Error processing card:", error);
      Alert.alert("Error", "Failed to process card. Please try again or enter details manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const scanCardFromImage = async (imageUri: string) => {
    try {
      // Create a FormData object to send the image
      const formData = new FormData();
      
      // For mobile, we need to handle the image file differently than on web
      if (Platform.OS !== 'web') {
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        } as any);
      } else {
        // Web implementation
        const filename = 'photo.png';
        const file = DataURIToBlob(imageUri);
        formData.append('image', file, filename);
      }
      
      // Send the request to the scan-card endpoint
      const response = await fetch('https://capitalx.onrender.com/scan-card', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // If the card was scanned successfully, update the form fields
        setCardNumber(formatCardNumber(data.cardNumber));
        setCardName(data.cardholderName);
        setExpiry(data.expirationDate);
      }
    } catch (error) {
      console.error("Error scanning card:", error);
      throw error;
    }
  };

  const identifyCardFromImage = async (imageUri: string) => {
    try {
      // Create a FormData object to send the image
      const formData = new FormData();
      
      // For mobile, we need to handle the image file differently than on web
      if (Platform.OS !== 'web') {
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        } as any);
      } else {
        // Web implementation
        const filename = 'photo.png';
        const file = DataURIToBlob(imageUri);
        formData.append('image', file, filename);
      }
      
      // Send the request to the backend
      const response = await fetch('https://capitalx.onrender.com/identify-card', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.couldIdentify) {
        // If the card was identified, populate the benefits fields
        setAprRate(data.details.apr || "");
        setBenefits(data.details.benefits.length > 0 ? data.details.benefits : [""]);
        setCardType(data.name);
      }
    } catch (error) {
      console.error("Error identifying card:", error);
      throw error;
    }
  };

  const renderStep1 = () => (
    <View style={styles.content}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Scanning card information...</Text>
        </View>
      ) : showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onCameraReady={handleCameraReady}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowCamera(false)}
              >
                <MaterialIcons name="cancel" size={30} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.captureButton, !cameraReady && styles.captureButtonDisabled]} 
                onPress={takePicture}
                disabled={!cameraReady}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Verify and complete your card information
          </Text>
          
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={handleShowCamera}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan card to auto-fill</Text>
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
              value={cardName}
              onChangeText={setCardName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Credit Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your card number"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              maxLength={19} // 16 digits + 3 spaces
            />
          </View>
        </>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.content}>
      <Text style={styles.subtitle}>Enter card expiry and security code</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Expiry Date</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          value={expiry}
          onChangeText={handleExpiryChange}
          maxLength={5} // MM/YY format
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Security Code</Text>
        <TextInput
          style={styles.input}
          placeholder="CVV"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          value={securityCode}
          onChangeText={handleSecurityCodeChange}
          maxLength={4} // Allow for Amex cards which have 4 digits
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.content}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Identifying card benefits...</Text>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.subtitle}>Enter your card benefits</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>APR Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter APR Rate (e.g. 17.99%)"
              placeholderTextColor="#8E8E93"
              value={aprRate}
              onChangeText={setAprRate}
            />
          </View>
          
          <Text style={styles.inputLabel}>Benefits</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitInputRow}>
              <TextInput
                style={styles.benefitInput}
                placeholder="Enter a card benefit"
                placeholderTextColor="#8E8E93"
                value={benefit}
                onChangeText={(text) => updateBenefit(text, index)}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeBenefitField(index)}
              >
                <MaterialIcons name="remove-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton} onPress={addBenefitField}>
            <MaterialIcons name="add-circle" size={24} color="#34C759" />
            <Text style={styles.addButtonText}>Add another benefit</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
      <View style={styles.modalContainer}>
      
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (step === 1) {
                  onClose();
                } else if (showCamera) {
                  setShowCamera(false);
                } else {
                  setStep(step - 1);
                }
              }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Card Details</Text>
            {step === 3 ? (
              <TouchableOpacity
                style={[
                  styles.doneButton,
                  (!isStep3Valid || isLoading || showCamera) && styles.nextButtonDisabled,
                ]}
                disabled={!isStep3Valid || isLoading || showCamera}
                onPress={handleNext}
              >
                <Text
                  style={[
                    styles.doneText,
                    (!isStep3Valid || isLoading || showCamera) && styles.doneTextDisabled,
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  ((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)) && styles.nextButtonDisabled,
                ]}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                onPress={handleNext}
              >
                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color={(step === 1 && isStep1Valid) || (step === 2 && isStep2Valid) ? "#FFFFFF" : "#8E8E93"}
                />
              </TouchableOpacity>
            )}
          </View>
          {step === 1 
            ? renderStep1() 
            : step === 2 
              ? renderStep2() 
              : renderStep3()}
        
      </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  backButton: {
    padding: 10,
  },
  nextButton: {
    padding: 10,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  doneButton: {
    padding: 10,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  doneTextDisabled: {
    opacity: 0.5,
  },
  // New styles for benefits step
  benefitInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitInput: {
    flex: 1,
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  addButtonText: {
    color: "#34C759",
    marginLeft: 8,
    fontSize: 16,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A84FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    padding: 20,
  },
  captureButton: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
});
