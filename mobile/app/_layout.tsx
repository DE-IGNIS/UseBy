import { Stack } from "expo-router";
// import "./globals.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      {/* Hides the clock and battery on screen */}
      {/* <StatusBar hidden={true} /> */}

      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "UseBy",
          headerTitleAlign: "center",

          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
