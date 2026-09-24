import AppIntents

struct ActivateProfileIntent: AppIntent {
    static var title: LocalizedStringResource = "Activate Profile"
    static var description = IntentDescription("Activate Smart, Music Focus, Mix, or Custom. Own session only.")

    @Parameter(title: "Profile")
    var profile: String

    func perform() async throws -> some IntentResult {
        .result()
    }
}

struct ActivateMixIntent: AppIntent {
    static var title: LocalizedStringResource = "Activate Mix"
    func perform() async throws -> some IntentResult { .result() }
}

struct ActivateMusicFocusIntent: AppIntent {
    static var title: LocalizedStringResource = "Activate Music Focus"
    func perform() async throws -> some IntentResult { .result() }
}

struct ActivateSmartIntent: AppIntent {
    static var title: LocalizedStringResource = "Activate Smart"
    func perform() async throws -> some IntentResult { .result() }
}

struct ActivateCustomIntent: AppIntent {
    static var title: LocalizedStringResource = "Activate Custom"
    func perform() async throws -> some IntentResult { .result() }
}

struct StartSplitIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Split"
    @Parameter(title: "Split") var name: String
    func perform() async throws -> some IntentResult { .result() }
}

struct StopSplitIntent: AppIntent {
    static var title: LocalizedStringResource = "Stop Split"
    @Parameter(title: "Split") var name: String
    func perform() async throws -> some IntentResult { .result() }
}

struct EnableSplitIntent: AppIntent {
    static var title: LocalizedStringResource = "Enable Split"
    @Parameter(title: "Split") var name: String
    func perform() async throws -> some IntentResult { .result() }
}

struct DisableSplitIntent: AppIntent {
    static var title: LocalizedStringResource = "Disable Split"
    @Parameter(title: "Split") var name: String
    func perform() async throws -> some IntentResult { .result() }
}

struct SoundsSageShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        [
            AppShortcut(intent: ActivateMixIntent(), phrases: ["Activate Mix in \(.applicationName)"]),
            AppShortcut(intent: ActivateMusicFocusIntent(), phrases: ["Activate Music Focus in \(.applicationName)"]),
            AppShortcut(intent: ActivateSmartIntent(), phrases: ["Activate Smart in \(.applicationName)"])
        ]
    }
}
