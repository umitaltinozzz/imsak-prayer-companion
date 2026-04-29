# Imsak Prayer Companion

**Expo mobile app prototype for Ramadan prayer times, Quran reading, Qibla direction, and daily Islamic utility tools.**

[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/State-Zustand-FF4154?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Paused-orange?style=for-the-badge)]()

---

## Overview

Imsak Prayer Companion is a mobile app prototype built around Ramadan and daily prayer workflows. It includes prayer time screens, notification planning, Quran reading flows, Qibla direction, dhikr, Esma-ul Husna, qada prayer tracking, and zakat calculation screens.

The project started from a client request shortly before Ramadan. The requested delivery window was very tight, and publishing would have required a developer account and store setup process that the client did not have ready. Because of that timing constraint, the project was paused and is kept public as a portfolio prototype.

## Problem

For Ramadan-focused mobile apps, the technical challenge is not only showing prayer times. The experience also needs:

- Reliable city/location-based prayer time data
- Timely reminders and notification settings
- Quran reading access during Ramadan
- Qibla direction tools
- Lightweight religious utility screens
- A mobile-first interface that can be shipped quickly

This prototype explores that product direction in an Expo app structure.

## Features

- Prayer time screen with location selection flow
- Local notification scheduling structure for prayer reminders
- Quran chapter and verse reading screens
- Qibla direction screen using device sensors/location context
- Dhikr counter and Esma-ul Husna screens
- Qada prayer tracking screen
- Zakat calculator screen
- Zustand-based state management
- MMKV-backed local storage helpers
- Expo configuration for Android/iOS builds

## Project Status

Paused client-request prototype. The app was requested shortly before Ramadan, but store publishing was deferred because the required developer account and release setup were not ready in time.

This public repository is a cleaned portfolio version. Real API keys, push notification secrets, local Expo state, agent configuration, and internal planning notes are intentionally excluded.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Expo, React Native, TypeScript |
| Navigation | React Navigation |
| State | Zustand, React hooks |
| Storage | react-native-mmkv |
| APIs | Axios |
| Device Features | Expo Location, Notifications, Sensors |
| Push Setup | OneSignal-ready configuration |

## Local Development

```bash
npm install
npm start
```

Run on a device or emulator:

```bash
npm run android
npm run ios
```

Copy `.env.example` to `.env` and provide your own API credentials before testing API-backed features.

## Environment Variables

```bash
EXPO_PUBLIC_QURAN_API_KEY=
EXPO_PUBLIC_PRAYER_API_EMAIL=
EXPO_PUBLIC_PRAYER_API_PASSWORD=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
```

## License

MIT License. See [LICENSE](LICENSE).
