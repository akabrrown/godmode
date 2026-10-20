---
name: android-kotlin-review
description: Build or review native Android apps with Kotlin and Jetpack Compose - architecture (MVVM/MVI), state, navigation, coroutines/Flow, Room, Retrofit, Hilt, WorkManager, testing, Play Store release. Use for any native Android task, Compose UI, Android performance or crashes, or the Android section of a TDD.
---
# Android (Kotlin + Compose) review

- **Language/UI**: Kotlin first; Jetpack Compose for new UI (Scaffold, NavHost, LazyColumn/Row, Material 3); XML/Fragments only for legacy. State: `remember`/`rememberSaveable` for UI state; hoist state; ViewModel exposes immutable `StateFlow<UiState>`; events as one-off effects (channel/SharedFlow); side effects via `LaunchedEffect`/`DisposableEffect` with correct keys.
- **Architecture**: MVVM (or MVI for complex flows) with a repository layer; single source of truth (Room) with network sync; domain/use-case layer when logic is non-trivial; unidirectional data flow.
- **DI**: Hilt (or Koin) - constructor injection, scoped modules, no service locators in business code.
- **Async**: coroutines + Flow (structured concurrency, `viewModelScope`, `Dispatchers.IO` for blocking work, never `GlobalScope`); handle cancellation; `collectAsStateWithLifecycle`. Background work: WorkManager with constraints and backoff.
- **Data**: Room (migrations tested), DataStore instead of SharedPreferences, Retrofit + OkHttp (timeouts, interceptors, certificate pinning if high risk), kotlinx.serialization/Moshi, pagination with Paging 3.
- **Lifecycle**: survive rotation/process death (SavedStateHandle), avoid leaking Context/Activity (LeakCanary in debug), correct permission flow with rationale.
- **Security**: encrypted storage (Keystore, EncryptedSharedPreferences/DataStore), HTTPS only with network security config, no secrets in the APK, ProGuard/R8 on, validate deep links/intents, no sensitive data in logs.
- **Performance**: stable Compose params, lazy lists with keys, avoid recomposition storms, Baseline Profiles + Macrobenchmark, test on low-end devices and slow networks (important for Ghana), offline-first behavior, small APK/AAB size.
- **Quality**: ktlint + detekt, unit tests (JUnit, MockK, Turbine for Flow), Compose UI tests/Espresso, Timber for logging, Crashlytics for crashes.
- **Release**: Gradle config with build variants and signing configs (keys out of git), versionCode discipline, AAB to Play Console, staged rollout, Firebase App Distribution for testers, data safety form, target SDK compliance.
