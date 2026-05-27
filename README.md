# UseBy

> Track expiry dates. Reduce waste. Stay organized.

---

## About

**UseBy** is a cross-platform mobile application designed to help individuals track product expiration dates and drastically reduce household waste. Whether managing groceries in your pantry, medications in your cabinet, or cosmetics in your bathroom, UseBy keeps your household organized by sending timely, automated notifications before your items expire.

By combining rapid barcode scanning with seamless manual entry, UseBy serves as a privacy-first personal tracker that ensures you use what you buy—saving money and reducing environmental impact.

## Features

* **📷 Intelligent Barcode Scanning:** Rapidly log commercial products using your device's built-in camera.
* **✍️ Flexible Manual Entry:** Seamlessly add homegrown, un-barcoded, or custom items with user-defined expiry windows.
* **🔔 Localized Smart Notifications:** Receive proactive, configurable alerts before products reach their expiration thresholds.
* **🏡 Tailored for Personal Use:** Zero business overhead or complex logistics—optimized entirely for fast, individual household tracking.
* **📊 Minimalist UI:** Clear, glanceable dashboards sorted by urgency so you know exactly what to use next.

## Tech Stack

UseBy is built on modern, scalable mobile technologies ensuring a fast, lightweight user experience:

* **Framework:** React Native
* **Tooling & Runtime:** Expo (SDK 51+)
* **Navigation:** Expo Router / React Navigation
* **Database:** SQLite (via `expo-sqlite`) for secure, local-first data persistence
* **Scanner:** `expo-camera` / `expo-barcode-scanner`
* **Notifications:** `expo-notifications` for scheduling local, on-device alerts

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Expo Go](https://www.google.com/search?q=https://expo.dev/client) app installed on your physical iOS/Android device for testing, or an Android Emulator / iOS Simulator configured via Android Studio / Xcode.

## Installation

Follow these steps to clone the repository and spin up the local development server:

```bash
# 1. Clone the repository
git clone https://github.com/darsyn/useby.git

# 2. Navigate into the project directory
cd useby

# 3. Install project dependencies
npm install
# or if you use yarn: yarn install

# 4. Start the Expo development server
npx expo start

```

Once the development server starts, scan the QR code printed in your terminal using your phone's camera (iOS) or the Expo Go app (Android) to open the app.

## Future Improvements

- Cloud sync / backup
- Shared household tracking
- AI-based expiry prediction
- Product recognition improvements

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file

---
