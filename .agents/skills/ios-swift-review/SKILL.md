---
name: ios-swift-review
description: Build or review native iOS apps with Swift - SwiftUI/UIKit, architecture (MVVM/TCA), async/await and Combine, Core Data/SwiftData, networking, Keychain, testing, CI/CD, TestFlight and App Store release. Use for any iOS task, SwiftUI state bugs, memory leaks, or the iOS section of a TDD.
---
# iOS (Swift) review

- **UI**: SwiftUI by default, UIKit where needed (interop via representables); follow Human Interface Guidelines; Dynamic Type, VoiceOver labels, dark mode, safe areas, Auto Layout for UIKit. State: `@State`, `@Binding`, `@StateObject/@Observable`, `@Environment`; single source of truth; keep views small and declarative.
- **Architecture**: MVVM (or TCA for strict unidirectional flow); coordinators/navigation stack (`NavigationStack`, typed paths) for routing; protocols at seams; dependency injection via initializers/environment.
- **Concurrency**: async/await and actors preferred; `@MainActor` for UI; structured concurrency (`TaskGroup`), cancellation; avoid GCD callback pyramids; Combine for streams when useful.
- **Memory**: avoid retain cycles (`[weak self]` in escaping closures, delegates weak); value types by default; profile with Instruments (Leaks, Allocations, Time Profiler).
- **Data**: SwiftData/Core Data (migrations), `UserDefaults` only for small preferences, Keychain for tokens/secrets, file system for documents; Codable for JSON.
- **Networking**: URLSession (+ async API), typed endpoints, retry/backoff, timeouts, reachability handling, App Transport Security (HTTPS), certificate pinning for high-risk apps; push via APNs.
- **Errors**: typed `Error`s, `Result`/throws, user-friendly messages, no force-unwraps (`!`) or `try!` outside tests.
- **Quality**: SwiftLint + SwiftFormat, XCTest unit tests, UI tests, test plans and coverage, Swift Package Manager for dependencies.
- **CI/CD & release**: Xcode Cloud/GitHub Actions/Fastlane; signing and provisioning managed (match/automatic); TestFlight beta; App Store metadata, privacy nutrition labels, review guideline compliance, phased release; ASO basics (title, keywords, screenshots).
- **Platform**: needs a Mac + Apple developer account; note cost and device-share realities for Ghana when advising on iOS-first vs Android-first.
