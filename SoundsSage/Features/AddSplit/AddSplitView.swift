import SwiftUI

struct AddSplitView: View {
    @EnvironmentObject private var store: SageStore
    @Environment(\.dismiss) private var dismiss

    @State private var name = "Audio Split"
    @State private var musicApp = "spotify"
    @State private var musicOut: OutputIntent = .bluetooth
    @State private var socialApp = "tiktok"
    @State private var socialOut: OutputIntent = .speaker
    @State private var musicPolicy: MusicPolicy = .duck
    @State private var foregroundPolicy: ForegroundPolicy = .normalWhenForeground
    @State private var reduce = 0.4
    @State private var restore: RestorePolicy = .restoreSoundsSageSession
    @State private var priority: PriorityLevel = .normal

    private var musicSource: AudioSource {
        SourceCatalog.music.first { $0.appId == musicApp } ?? SourceCatalog.spotify
    }

    private var socialSource: AudioSource {
        SourceCatalog.social.first { $0.appId == socialApp } ?? SourceCatalog.tiktok
    }

    var draft: Split {
        ProfileCatalog.makeTwoSided(
            name: name,
            profile: .custom,
            music: musicSource,
            musicOut: musicOut,
            social: socialSource,
            socialOut: socialOut,
            musicPolicy: musicPolicy,
            foregroundPolicy: foregroundPolicy,
            restore: restore,
            priority: priority,
            actions: derivedActions
        )
    }

    private var derivedActions: [ActionKind] {
        var list: [ActionKind] = [.showRoutePicker]
        switch musicPolicy {
        case .keepNormal: list.append(.mixWithOthers)
        case .reduce, .duck: list.append(.duckOthers)
        case .pause: list.append(.interruptSpokenAndMix)
        }
        if musicOut != socialOut { list.append(.routeAppIndependently) }
        list.append(.setThirdPartyVolume)
        list.append(.identifySourceApp)
        return list
    }

    var results: [CapabilityResult] { CapabilityRegistry.evaluate(split: draft) }
    var savable: Bool { CapabilityRegistry.isSavable(results, split: draft) }

    var body: some View {
        Form {
            Section("Name") {
                TextField("Name", text: $name)
            }
            Section("Step 1 · Music app") {
                Picker("Music app", selection: $musicApp) {
                    ForEach(SourceCatalog.music, id: \.appId) { app in
                        Text(app.name).tag(app.appId)
                    }
                }
            }
            Section("Step 2 · Music output") {
                Picker("Music output", selection: $musicOut) {
                    ForEach(OutputIntent.allCases, id: \.self) { intent in
                        Text(intent.label).tag(intent)
                    }
                }
                Text("Requested output. iOS has one system route.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Section("Step 3 · Social / video app") {
                Picker("Social app", selection: $socialApp) {
                    ForEach(SourceCatalog.social, id: \.appId) { app in
                        Text(app.name).tag(app.appId)
                    }
                }
            }
            Section("Step 4 · Social output") {
                Picker("Social output", selection: $socialOut) {
                    ForEach(OutputIntent.allCases, id: \.self) { intent in
                        Text(intent.label).tag(intent)
                    }
                }
            }
            Section("Step 5 · When social audio plays") {
                Picker("Music behavior", selection: $musicPolicy) {
                    ForEach(MusicPolicy.allCases, id: \.self) { policy in
                        Text(policy.label).tag(policy)
                    }
                }
                if musicPolicy == .reduce || musicPolicy == .duck {
                    Slider(value: $reduce, in: 0.1...0.8)
                    Text("Music while watching: \(Int(reduce * 100))% (preview simulation)")
                        .font(.caption)
                }
            }
            Section("Step 6 · Social audio") {
                Picker("Foreground behavior", selection: $foregroundPolicy) {
                    ForEach(ForegroundPolicy.allCases, id: \.self) { policy in
                        Text(policy.label).tag(policy)
                    }
                }
            }
            Section("Step 7 · When foreground audio ends") {
                Picker("Restore", selection: $restore) {
                    Text("Restore previous music state").tag(RestorePolicy.restoreSoundsSageSession)
                    Text("Keep current state").tag(RestorePolicy.none)
                }
            }
            Section("Step 8 · Priority") {
                Picker("Priority", selection: $priority) {
                    Text("Low").tag(PriorityLevel.low)
                    Text("Normal").tag(PriorityLevel.normal)
                    Text("High").tag(PriorityLevel.high)
                    Text("Critical").tag(PriorityLevel.critical)
                }
                .pickerStyle(.segmented)
            }
            Section("Step 9 · Capability check") {
                VStack(alignment: .leading, spacing: 8) {
                    summaryRow("\(musicSource.name) → \(musicOut.label)", .partiallySupported)
                    summaryRow("\(socialSource.name) → \(socialOut.label)", .partiallySupported)
                    summaryRow("Third-party app audio separation", .unsupported)
                    summaryRow("Independent \(socialSource.name) volume", .unsupported)
                    summaryRow("Capture another app's audio", .unsupported)
                    summaryRow("Audio session ducking", .partiallySupported)
                }
                ForEach(results, id: \.capabilityId) { result in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(CapabilityRegistry.lookup(result.capabilityId).name)
                            Spacer()
                            Text(result.status.rawValue)
                                .font(.caption)
                        }
                        Text(result.explanation).font(.caption).foregroundStyle(.secondary)
                    }
                }
                Text("This Split can be saved as intended pairing. Unsupported native behavior is not executed.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Button("Save Split") {
                if store.addSplit(draft) { dismiss() }
            }
            .disabled(!savable)
        }
        .navigationTitle("Add Audio Split")
    }

    func summaryRow(_ label: String, _ status: CapabilityStatus) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(status.rawValue).font(.caption)
        }
    }
}
