// Webpage-only. Never presented as native app control.
function pageMedia() {
  return Array.from(document.querySelectorAll("audio, video"));
}

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "pause") {
    pageMedia().forEach((el) => el.pause());
  }
  if (message?.type === "mute") {
    pageMedia().forEach((el) => {
      el.muted = true;
    });
  }
  return { count: pageMedia().length, note: "iOS may ignore element.volume" };
});
