import SwiftUI

@main
struct SoundsSageApp: App {
    @StateObject private var store = SageStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .tint(SageTheme.primary)
        }
    }
}
