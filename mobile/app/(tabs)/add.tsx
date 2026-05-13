import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width, height } = Dimensions.get("window");
const SCANNER_SIZE = width * 0.48;
const API_URL = "http://192.168.29.224:3001";

// Adjust HEADER_HEIGHT to match your actual global header height
const HEADER_HEIGHT = 60;
// Place scanner above the visual center of the remaining screen space
const USABLE_HEIGHT = height - HEADER_HEIGHT;
const SCANNER_TOP = HEADER_HEIGHT + USABLE_HEIGHT * 0.25 - SCANNER_SIZE / 2;

export default function Add() {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualVisible, setManualVisible] = useState(false);
  const [name, setName] = useState("");
  const [expiry, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");

  const scanAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    if (!name || !expiry || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, expiry, quantity }),
      });

      const rawText = await response.text();
      console.log("Raw server response:", rawText);

      const result = JSON.parse(rawText);
      if (result.success) {
        console.log("Item saved:", result.item);
        setName("");
        setExpiryDate("");
        setQuantity("");
        setManualVisible(false); // close modal
      }
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCANNER_SIZE - 2],
  });

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.permissionText}>
          Camera access is required to scan items.
        </Text>
        <Pressable style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const SCANNER_LEFT = (width - SCANNER_SIZE) / 2;
  const BUTTONS_TOP = SCANNER_TOP + SCANNER_SIZE + 52;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <View
        style={[
          styles.overlay,
          { top: 0, left: 0, right: 0, height: SCANNER_TOP },
        ]}
      />
      <View
        style={[
          styles.overlay,
          { top: SCANNER_TOP + SCANNER_SIZE, left: 0, right: 0, bottom: 0 },
        ]}
      />
      <View
        style={[
          styles.overlay,
          {
            top: SCANNER_TOP,
            left: 0,
            width: SCANNER_LEFT,
            height: SCANNER_SIZE,
          },
        ]}
      />
      <View
        style={[
          styles.overlay,
          {
            top: SCANNER_TOP,
            right: 0,
            width: SCANNER_LEFT,
            height: SCANNER_SIZE,
          },
        ]}
      />

      <View
        style={[styles.scannerBox, { top: SCANNER_TOP, left: SCANNER_LEFT }]}
      >
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanLineTranslate }] },
          ]}
        />
      </View>

      <View
        style={[styles.hintContainer, { top: SCANNER_TOP + SCANNER_SIZE + 14 }]}
      >
        <Text style={styles.hintText}>Align barcode within the frame</Text>
      </View>

      <View style={[styles.bottomBar, { top: BUTTONS_TOP }]}>
        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed && styles.captureButtonPressed,
          ]}
          onPress={() => {
            /* handle capture */
          }}
        >
          {/* <Text style={styles.captureButtonText}>Capture &amp; Identify</Text> */}
          <Text style={styles.captureButtonText}>Identify</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.manualButton,
            pressed && styles.manualButtonPressed,
          ]}
          onPress={() => setManualVisible(true)}
        >
          <Text style={styles.manualButtonText}>Enter Manually</Text>
        </Pressable>
      </View>

      <Modal transparent visible={manualVisible} animationType="slide">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setManualVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Item</Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Expiry Date (e.g. 31/12/2026)"
              value={expiry}
              onChangeText={setExpiryDate}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#aaa"
            />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setManualVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addBtn} onPress={handleSubmit}>
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 3;
const CORNER_COLOR = "#ffffff";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { justifyContent: "center", alignItems: "center" },

  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.62)",
  },

  scannerBox: {
    position: "absolute",
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    overflow: "hidden",
  },

  corner: { position: "absolute", width: CORNER_SIZE, height: CORNER_SIZE },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderBottomRightRadius: 4,
  },

  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: "#4ADE80",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  hintContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    letterSpacing: 0.3,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 12,
  },

  captureButton: {
    backgroundColor: "#8FAF7E",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  captureButtonPressed: { backgroundColor: "#7A9A6A" },
  captureButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  manualButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  manualButtonPressed: { backgroundColor: "rgba(255,255,255,0.28)" },
  manualButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  permissionText: {
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 32,
    marginBottom: 20,
    fontSize: 15,
  },
  grantBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  grantBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  cancelText: { color: "#FF3B30", fontSize: 15, fontWeight: "500" },
  addBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
