import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/native")({ component: NativePage });

function NativePage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Xcode</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Native iOS</h1>
      </header>
      <p className="text-sm leading-relaxed text-muted">
        This builder cannot compile Swift. The product lives in the SoundsSage folder as a native
        architecture for Xcode. This web surface is a prototype of the same models — not a substitute
        for AVAudioSession.
      </p>
      <ul className="space-y-3 text-sm leading-relaxed text-muted">
        <li>Open SoundsSage/README.md on a Mac.</li>
        <li>Create an iOS app target, enable Audio, AirPlay, and Picture in Picture.</li>
        <li>Wire IOSAudioAdapter to AVAudioSession. Do not use private APIs.</li>
        <li>Test speaker, wired, Bluetooth, AirPods, AirPlay, calls, Siri, lock, and background on hardware.</li>
        <li>Safari Web Extension is a later phase and cannot control native apps.</li>
      </ul>
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-2xl">Still required</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Mac, Xcode, Apple Developer Program, physical iPhones, AirPods or Bluetooth headphones,
          and the commercial apps you want to observe (Music, Spotify, TikTok, YouTube). Simulator
          is not enough.
        </p>
      </section>
    </main>
  );
}
