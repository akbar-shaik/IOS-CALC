// Polyfill for Node.js < 22 to support Expo SDK 58 CLI
if (!URL.parse) {
  URL.parse = function (url, base) {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}
