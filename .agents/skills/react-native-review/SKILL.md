---
name: react-native-review
description: Build or review React Native / Expo mobile apps - navigation, lists, performance, storage, permissions, push notifications, offline, security, testing, store publishing. Use for any mobile app task, Expo setup, FlatList slowness, app store release prep, or the mobile section of a TDD.
---
# React Native / Expo review

- **Setup**: Expo (managed) by default; dev builds/prebuild when native modules require; TypeScript strict; Expo Router or React Navigation; env via Expo config + secure handling.
- **Lists**: `FlatList`/`SectionList` (or FlashList) with `keyExtractor`, `getItemLayout` when fixed height, `windowSize` tuned, memoized `renderItem`, no inline lambdas/objects, pagination, `removeClippedSubviews` evaluation.
- **Performance**: avoid re-renders (memo, stable props), keep JS thread free (Reanimated for animation on UI thread, InteractionManager), image caching and right sizes, Hermes enabled, inline requires / RAM bundles when startup is slow, profile with DevTools/Flipper/Perf Monitor, test on a low-end Android.
- **Offline & network**: connectivity awareness, retry/backoff, optimistic UI with queue, cache with TanStack Query persistence; compression; low-bandwidth friendly (important for Ghana).
- **Storage**: `expo-secure-store` for tokens/secrets; AsyncStorage/MMKV/SQLite for non-secret data; never store secrets in plain AsyncStorage.
- **Security**: HTTPS only, certificate pinning for high-risk apps, no secrets in the bundle, deep-link validation, jailbreak/root awareness for finance, biometric gate optional.
- **UX**: SafeAreaView, KeyboardAvoidingView, platform-specific code via `Platform`, touch targets >= 44, accessibility labels/roles, dark mode, haptics sparingly.
- **Permissions & notifications**: ask in context with rationale; handle denial; push via Expo Notifications/FCM/APNs; deep link from notification; SMS/USSD fallback for feature-phone reach.
- **Testing**: Jest + React Native Testing Library; Detox/Maestro/Appium for E2E.
- **Release**: EAS Build/Submit, versioning (semver + build numbers), store metadata/screenshots/privacy labels, staged rollout, OTA updates with care, crash reporting (Sentry), analytics consent.
