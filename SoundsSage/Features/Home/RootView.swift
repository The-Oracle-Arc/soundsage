import SwiftUI
import AVKit
import MediaPlayer

enum SageTheme {
    static let primary = Color(red: 0.62, green: 0.68, blue: 0.59)
}

@MainActor
final class SageStore: ObservableObject {
    @Published var profile: ProfileID = .smart
    @Published var splits: [Split] = ProfileCatalog.splits(for: .smart)
    @Published var observation: AudioObservation
    let adapter = IOSAudioAdapter()
    lazy var engine = WorkflowEngine(adapter: adapter)

    private let storageKey = "sounds-sage-custom-splits"

    init() {
        observation = adapter.observe()
        loadCustomSplits()
    }

    func refresh() {
        observation = adapter.observe()
    }

    func addSplit(_ split: Split) -> Bool {
        let results = CapabilityRegistry.evaluate(split: split)
        guard CapabilityRegistry.isSavable(results, split: split) else { return false }
        var copy = split
        copy.capabilityResults = results
        splits.insert(copy, at: 0)
        persistCustomSplits()
        return true
    }

    func toggle(_ id: String) {
        guard let index = splits.firstIndex(where: { $0.id == id }) else { return }
        splits[index].enabled.toggle()
        persistCustomSplits()
    }

    func remove(_ id: String) {
        splits.removeAll { $0.id == id }
        persistCustomSplits()
    }

    func setProfile(_ id: ProfileID) async {
        let previous = profile
        if previous == id { return }
        let current = splits.filter { $0.enabled && ($0.profileId == previous || $0.profileId == .custom || $0.profileId == nil) }
        for split in current {
            _ = await engine.exit(split: split)
        }
        let custom = splits.filter { $0.profileId == .custom || $0.profileId == nil }
        profile = id
        splits = ProfileCatalog.splits(for: id) + custom
        _ = await engine.handleTrigger(splits: splits, kind: .profileActivated, profile: id)
        refresh()
    }

    func playOwn() async {
        do {
            try await adapter.playOwn()
            _ = await engine.handleTrigger(splits: enabledSplits(), kind: .soundsSagePlaybackStarted, profile: profile)
            refresh()
        } catch {
            refresh()
        }
    }

    func stopOwn() async {
        for split in enabledSplits() where split.exitCondition.kind == .soundsSagePlaybackStopped {
            _ = await engine.exit(split: split)
        }
        try? await adapter.stopOwn()
        _ = await engine.handleTrigger(splits: enabledSplits(), kind: .soundsSagePlaybackStopped, profile: profile)
        refresh()
    }

    private func enabledSplits() -> [Split] {
        splits.filter { $0.enabled && ($0.profileId == profile || $0.profileId == .custom || $0.profileId == nil) }
    }

    private func persistCustomSplits() {
        let custom = splits.filter { $0.profileId == .custom || $0.profileId == nil }
        if let data = try? JSONEncoder().encode(custom) {
            UserDefaults.standard.set(data, forKey: storageKey)
        }
    }

    private func loadCustomSplits() {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let custom = try? JSONDecoder().decode([Split].self, from: data)
        else { return }
        splits.append(contentsOf: custom)
    }
}

struct RootView: View {
    @EnvironmentObject private var store: SageStore
    @State private var tab = 0

    var body: some View {
        TabView(selection: $tab) {
            HomeView().tabItem { Label("Home", systemImage: "house") }.tag(0)
            SplitsView().tabItem { Label("Splits", systemImage: "square.stack.3d.up") }.tag(1)
            ProfilesView().tabItem { Label("Profiles", systemImage: "slider.horizontal.3") }.tag(2)
            SettingsView().tabItem { Label("Settings", systemImage: "gear") }.tag(3)
        }
    }
}

struct HomeView: View {
    @EnvironmentObject private var store: SageStore

    var active: Split? {
        store.splits.first(where: { $0.enabled && $0.isTwoSided }) ?? store.splits.first(where: \.isTwoSided)
    }

    var body: some View {
        let obs = store.observation
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("SOUNDS SAGE")
                        .font(.caption)
                        .tracking(2)
                    Text("Smart Audio")
                        .font(.largeTitle.weight(.semibold))
                    Text("Music on one side. Social video on the other. Native iOS only executes public session APIs.")
                        .foregroundStyle(.secondary)
                    Text("PREVIEW MODE is the web companion. This target is the iOS product.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    status("Current Profile", store.profile.rawValue, hint: "Profiles are Splits. Same engine.")
                    if let split = active {
                        status(
                            "Active Split",
                            split.name,
                            hint: "\(split.musicSource?.name ?? "Music") · \(split.musicOutputIntent?.label ?? "System")  +  \(split.foregroundSource?.name ?? "Social") · \(split.foregroundOutputIntent?.label ?? "System")"
                        )
                        status("Music policy", split.musicPolicy?.label ?? "—", hint: split.foregroundPolicy?.label)
                    }
                    status(
                        "Current Audio",
                        obs.interruptionActive ? "Interrupted" : (obs.ownPlaying ? "Sounds Sage playing" : "Idle"),
                        hint: obs.otherAudioPlaying ? "Other audio is present (app unknown)." : "No other audio detected."
                    )
                    status("Output", obs.currentRoute.rawValue, hint: "Actual system route — not a per-app assignment.")
                    Button(obs.ownPlaying ? "Stop Sounds Sage tone" : "Play Sounds Sage tone") {
                        Task {
                            if obs.ownPlaying {
                                await store.stopOwn()
                            } else {
                                await store.playOwn()
                            }
                        }
                    }
                    .buttonStyle(.bordered)
                    NavigationLink("Add Split") { AddSplitView() }
                        .buttonStyle(.borderedProminent)
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    func status(_ label: String, _ value: String, hint: String?) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label.uppercased()).font(.caption2).foregroundStyle(.secondary)
            Text(value).font(.title2)
            if let hint {
                Text(hint).font(.caption).foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16))
    }
}

struct SplitsView: View {
    @EnvironmentObject private var store: SageStore
    var body: some View {
        NavigationStack {
            List {
                ForEach(store.splits) { split in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(split.name)
                            Spacer()
                            Text(worstStatus(split).rawValue)
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                        Text(split.trigger.label).font(.caption).foregroundStyle(.secondary)
                        if split.isTwoSided {
                            Text("\(split.musicSource?.name ?? "") · \(split.musicOutputIntent?.label ?? "")")
                                .font(.caption)
                            Text("\(split.foregroundSource?.name ?? "") · \(split.foregroundOutputIntent?.label ?? "")")
                                .font(.caption)
                            Text(split.musicPolicy?.label ?? "")
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                        HStack {
                            Button(split.enabled ? "Disable" : "Enable") { store.toggle(split.id) }
                            Button("Remove", role: .destructive) { store.remove(split.id) }
                        }
                        .font(.caption)
                    }
                }
            }
            .navigationTitle("Splits")
            .toolbar {
                NavigationLink("Add") { AddSplitView() }
            }
        }
    }

    func worstStatus(_ split: Split) -> CapabilityStatus {
        let results = split.capabilityResults.isEmpty ? CapabilityRegistry.evaluate(split: split) : split.capabilityResults
        if results.contains(where: { $0.status == .unsupported }) { return .unsupported }
        if results.contains(where: { $0.status == .partiallySupported }) { return .partiallySupported }
        if results.contains(where: { $0.status == .unverified }) { return .unverified }
        return .supported
    }
}

struct ProfilesView: View {
    @EnvironmentObject private var store: SageStore
    var body: some View {
        NavigationStack {
            List(ProfileID.allCases, id: \.self) { id in
                Button {
                    Task { await store.setProfile(id) }
                } label: {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(title(id))
                            Text(subtitle(id)).font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        if store.profile == id {
                            Text("Active").font(.caption)
                        }
                    }
                }
            }
            .navigationTitle("Profiles")
        }
    }

    func title(_ id: ProfileID) -> String {
        switch id {
        case .smart: return "Smart"
        case .musicFocus: return "Music Focus"
        case .mix: return "Mix"
        case .custom: return "Custom"
        }
    }

    func subtitle(_ id: ProfileID) -> String {
        switch id {
        case .smart: return "Music stays on while you scroll."
        case .musicFocus: return "Duck music when watching. Restore after."
        case .mix: return "Both sides stay audible. One system route."
        case .custom: return "Your Splits, same engine."
        }
    }
}

struct SettingsView: View {
    var body: some View {
        NavigationStack {
            List {
                Section("Privacy") {
                    Text("Sounds Sage does not record microphone audio.")
                    Text("Sounds Sage does not upload audio recordings.")
                    Text("Sounds Sage does not intercept private audio streams.")
                    Text("No account. Splits stay on this device.")
                }
                Section("Output") {
                    RoutePickerRepresentable()
                        .frame(height: 36)
                    VolumeRepresentable()
                        .frame(height: 36)
                }
                Section("Honesty") {
                    Text("Duck other audio is temporary and not per-app. Independent Spotify or TikTok volume is not available on stock iOS.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Settings")
        }
    }
}

struct RoutePickerRepresentable: UIViewRepresentable {
    func makeUIView(context: Context) -> AVRoutePickerView { AVRoutePickerView() }
    func updateUIView(_ uiView: AVRoutePickerView, context: Context) {}
}

struct VolumeRepresentable: UIViewRepresentable {
    func makeUIView(context: Context) -> MPVolumeView { MPVolumeView() }
    func updateUIView(_ uiView: MPVolumeView, context: Context) {}
}
