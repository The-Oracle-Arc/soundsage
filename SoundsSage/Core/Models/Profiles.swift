import Foundation

enum SourceCatalog {
    static let spotify = AudioSource(appId: "spotify", name: "Spotify", category: .music, role: .music)
    static let appleMusic = AudioSource(appId: "apple_music", name: "Apple Music", category: .music, role: .music)
    static let youtubeMusic = AudioSource(appId: "youtube_music", name: "YouTube Music", category: .music, role: .music)
    static let soundsSage = AudioSource(appId: "sounds_sage", name: "Sounds Sage", category: .music, role: .music)
    static let otherMusic = AudioSource(appId: "other_music", name: "Other music source", category: .music, role: .music)

    static let tiktok = AudioSource(appId: "tiktok", name: "TikTok", category: .social, role: .foreground)
    static let instagram = AudioSource(appId: "instagram", name: "Instagram", category: .social, role: .foreground)
    static let youtube = AudioSource(appId: "youtube", name: "YouTube", category: .social, role: .foreground)
    static let facebook = AudioSource(appId: "facebook", name: "Facebook", category: .social, role: .foreground)
    static let x = AudioSource(appId: "x", name: "X", category: .social, role: .foreground)
    static let otherSocial = AudioSource(appId: "other_social", name: "Other social / video source", category: .social, role: .foreground)

    static let music: [AudioSource] = [spotify, appleMusic, youtubeMusic, soundsSage, otherMusic]
    static let social: [AudioSource] = [tiktok, instagram, youtube, facebook, x, otherSocial]
}

enum ProfileCatalog {
    static func splits(for id: ProfileID) -> [Split] {
        switch id {
        case .smart: return smart()
        case .musicFocus: return musicFocus()
        case .mix: return mix()
        case .custom: return []
        }
    }

    private static func smart() -> [Split] {
        [
            makeTwoSided(
                name: "Smart scroll",
                profile: .smart,
                music: SourceCatalog.spotify,
                musicOut: .bluetooth,
                social: SourceCatalog.tiktok,
                socialOut: .speaker,
                musicPolicy: .duck,
                foregroundPolicy: .normalWhenForeground,
                restore: .restoreSoundsSageSession,
                priority: .normal,
                actions: [.duckOthers, .showRoutePicker, .routeAppIndependently, .setThirdPartyVolume, .identifySourceApp]
            )
        ]
    }

    private static func musicFocus() -> [Split] {
        [
            makeTwoSided(
                name: "Music Focus",
                profile: .musicFocus,
                music: SourceCatalog.spotify,
                musicOut: .bluetooth,
                social: SourceCatalog.tiktok,
                socialOut: .speaker,
                musicPolicy: .duck,
                foregroundPolicy: .normalWhenForeground,
                restore: .restoreSoundsSageSession,
                priority: .high,
                actions: [.exclusivePlayback, .duckOthers, .showRoutePicker]
            )
        ]
    }

    private static func mix() -> [Split] {
        [
            makeTwoSided(
                name: "Mix",
                profile: .mix,
                music: SourceCatalog.spotify,
                musicOut: .bluetooth,
                social: SourceCatalog.tiktok,
                socialOut: .speaker,
                musicPolicy: .keepNormal,
                foregroundPolicy: .alwaysNormal,
                restore: .restoreSoundsSageSession,
                priority: .normal,
                actions: [.mixWithOthers, .showRoutePicker]
            )
        ]
    }

    static func makeTwoSided(
        name: String,
        profile: ProfileID,
        music: AudioSource,
        musicOut: OutputIntent,
        social: AudioSource,
        socialOut: OutputIntent,
        musicPolicy: MusicPolicy,
        foregroundPolicy: ForegroundPolicy,
        restore: RestorePolicy,
        priority: PriorityLevel,
        actions: [ActionKind]
    ) -> Split {
        Split(
            id: UUID().uuidString,
            name: name,
            enabled: true,
            trigger: .init(kind: .manual, label: "I start this Split", routePort: nil, profileId: profile),
            conditions: [.init(kind: .always, routePort: nil, profileId: nil)],
            actions: actions.map { .init(kind: $0, ownGain: nil, fadeMs: nil) },
            exitCondition: .init(kind: .manual, label: "I start this Split", routePort: nil, profileId: nil),
            restorePolicy: restore,
            priority: priority,
            capabilityResults: [],
            profileId: profile,
            createdAt: Date(),
            musicSource: music,
            foregroundSource: social,
            musicOutputIntent: musicOut,
            foregroundOutputIntent: socialOut,
            musicPolicy: musicPolicy,
            foregroundPolicy: foregroundPolicy,
            musicReduceLevel: 0.4
        )
    }
}
