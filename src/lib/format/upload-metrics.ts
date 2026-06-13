const MB = 1024 * 1024;

export function formatUploadBytes(bytes: number): string {
  if (bytes >= MB) {
    const mb = bytes / MB;
    return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return kb >= 10 ? `${Math.round(kb)} KB` : `${kb.toFixed(1)} KB`;
}

export function formatUploadSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond <= 0) return "0.0";
  return (bytesPerSecond / MB).toFixed(1);
}

export function formatUploadEta(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return "Calculating…";
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${minutes}m ${secs}s remaining`;
}

export function formatApkFileSize(bytes: number): string {
  return `${(bytes / MB).toFixed(1)} MB`;
}
