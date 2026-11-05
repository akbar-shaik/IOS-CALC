# 📱 iOS Calculator App

A simple, clean, elegant, and authentic iOS Calculator app built with React Native and Expo (SDK 58). Designed for seamless development and testing directly from your Windows laptop to your iPhone.

---

## ✨ Features

- **Iconic Apple iOS Aesthetic**: True OLED deep black (`#000000`) theme, iOS rounded circular and pill-shaped zero buttons, vibrant Apple orange (`#FF9F0A`) operators, and light gray utility buttons.
- **Active Operator State**: Selected operators highlight in inverted high-contrast white with orange text until the next operand is pressed.
- **Dynamic Font Scaling**: Numbers automatically scale down as digits grow so calculations never clip or wrap awkwardly.
- **Native Gesture - Swipe to Delete**: Swipe left or right across the display numbers to erase the last entered digit, matching Apple's native gesture.
- **Tap / Long-Press to Copy**: Tap or long-press the readout to copy the current value to your clipboard with an iOS toast banner.
- **Accurate Floating Point Engine**: Prevents JavaScript floating-point artifacts (e.g. `0.1 + 0.2 = 0.30000000000000004` is cleanly calculated as `0.3`).
- **Full Calculation History**: Dedicated iOS slide-up modal sheet tracking recent expressions, timestamps, and results. Tap any past calculation to restore or reuse it.
- **Repeated Equals (`=`)**: Pressing `=` multiple times automatically repeats the last operation with the last operand (e.g., `5 + 2 = 7 = 9 = 11`).
- **Tactile iOS Haptic Feedback**: Native tactile impacts on iOS devices using `expo-haptics` with light, medium, and heavy vibration styles.

---

## 🚀 Quick Start & Testing

### 1. Test Instantly on Your Laptop (Web Preview)

You can launch and test the calculator directly in your web browser:

```bash
npm run web
```
The browser will open with an authentic mobile-proportioned calculator view.

---

### 2. Test Live on Your Physical iPhone (Expo Go)

1. **Install Expo Go**: Download the free **Expo Go** app from the [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
2. **Start Dev Server**: In your project directory, run:
   ```bash
   npx expo start
   ```
3. **Connect**:
   - Ensure your iPhone and laptop are connected to the same Wi-Fi network (or use `npx expo start --tunnel`).
   - Open your iPhone's **Camera** app and scan the QR code displayed in your terminal.
   - Tap the banner to open the app in Expo Go.
   - Any code changes you save will instantly hot-reload on your iPhone!

---

### 3. Verify Health & Run Tests

```bash
# Run unit tests on the math engine
npm test

# Typecheck code
npm run typecheck

# Verify Expo dependencies and configuration
npm run doctor
```

---

## 🛠️ Tools Installed for Future iOS App Development on Windows

Since macOS Xcode cannot run directly on Windows, the following industry-standard tools have been configured for you:

1. **EAS CLI (`eas-cli`)**:
   - Installed globally.
   - Allows you to compile native iOS binaries (`.ipa`) in the cloud on Apple Silicon hardware without owning a Mac.
   - Configured with `eas.json` for development, preview (simulator), and production builds.
   - Run: `eas.cmd build --platform ios` (or `npx eas build --platform ios`).

2. **Expo SDK 58**:
   - Modern React Native architecture with React 19 and New Architecture support.
   - Full cross-platform compatibility across iOS, Android, and Web.

3. **Safe Area & Device Adaptation**:
   - Integrated `react-native-safe-area-context` to automatically support the iOS Dynamic Island, Home Indicator, and notch across all iPhone models.

---

## 📂 Project Architecture

```
Calculator/
├── src/
│   ├── components/
│   │   ├── CalculatorButton.tsx   # iOS circular & pill buttons with haptics
│   │   ├── Display.tsx            # Dynamic typography, swipe-to-delete & copy
│   │   └── HistoryModal.tsx       # Slide-up history sheet with timestamped items
│   ├── types/
│   │   └── index.ts               # State, operators, and history types
│   └── utils/
│       ├── calculatorEngine.ts    # Precision math, percentage & formatting logic
│       └── testRunner.ts          # Automated verification test suite
├── App.tsx                        # Main application container & responsive layout
├── app.json                       # iOS bundle identifier, orientation & assets config
├── eas.json                       # Cloud build profiles for iOS
└── package.json                   # Dependencies and npm scripts
```
