"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  FileArchive,
  Loader2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  formatApkFileSize,
  formatUploadBytes,
  formatUploadEta,
  formatUploadSpeed,
} from "@/lib/format/upload-metrics";
import {
  createResumableUpload,
  MAX_APK_SIZE_BYTES,
  UploadCancelledError,
  type UploadProgressUpdate,
} from "@/lib/supabase/resumable-upload";

const BUCKET = "app-assets";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface ApkUploadPanelProps {
  appId: string;
  currentApkUrl?: string | null;
  onUploadComplete: (url: string, storagePath: string, fileSize: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const initialProgress: UploadProgressUpdate = {
  bytesUploaded: 0,
  bytesTotal: 0,
  percent: 0,
  speedBps: 0,
  etaSeconds: null,
};

export function ApkUploadPanel({
  appId,
  currentApkUrl,
  onUploadComplete,
  onUploadingChange,
}: ApkUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState<UploadProgressUpdate>(initialProgress);
  const [error, setError] = useState("");

  useEffect(() => {
    onUploadingChange(status === "uploading");
  }, [status, onUploadingChange]);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCancel = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setStatus("idle");
    setProgress(initialProgress);
    setFileName("");
    resetInput();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_APK_SIZE_BYTES) {
      setError(`APK must be 300 MB or smaller. Selected file is ${formatApkFileSize(file.size)}.`);
      setStatus("error");
      resetInput();
      return;
    }

    setError("");
    setFileName(file.name);
    setStatus("uploading");
    setProgress({ ...initialProgress, bytesTotal: file.size });

    const supabase = createClient();
    const path = `apks/${appId}/${Date.now()}-${file.name}`;

    try {
      const handle = await createResumableUpload(supabase, {
        bucket: BUCKET,
        path,
        file,
        onProgress: setProgress,
      });

      cancelRef.current = handle.cancel;
      await handle.promise;
      cancelRef.current = null;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const fileSize = formatApkFileSize(file.size);

      setProgress({
        bytesUploaded: file.size,
        bytesTotal: file.size,
        percent: 100,
        speedBps: 0,
        etaSeconds: 0,
      });
      setStatus("success");
      onUploadComplete(data.publicUrl, path, fileSize);
      resetInput();
    } catch (err) {
      cancelRef.current = null;
      if (err instanceof UploadCancelledError) {
        setStatus("idle");
        setProgress(initialProgress);
        setFileName("");
        resetInput();
        return;
      }

      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      resetInput();
    }
  };

  const isUploading = status === "uploading";

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-white/60">APK File</p>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        {status === "idle" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <FileArchive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/80">
                  {currentApkUrl ? "APK uploaded" : "No APK uploaded yet"}
                </p>
                <p className="text-xs text-white/40">Max size 300 MB · Resumable upload</p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-2.5 text-xs font-medium text-cyan-400 transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/10">
              <Upload className="h-3.5 w-3.5" />
              Choose APK
              <input
                ref={inputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {isUploading && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-400" />
                  <p className="truncate text-sm font-medium text-white">{fileName}</p>
                </div>
                <p className="mt-1 text-xs text-white/40">Uploading to Supabase Storage…</p>
              </div>
              <span className="shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-cyan-300">
                {Math.min(100, Math.round(progress.percent))}%
              </span>
            </div>

            <div className="relative h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 shadow-[0_0_16px_rgba(34,211,238,0.45)] transition-[width] duration-200 ease-out"
                style={{ width: `${Math.min(100, progress.percent)}%` }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-60"
                style={{ width: `${Math.min(100, progress.percent)}%` }}
              />
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-white/40">Transferred</p>
                <p className="mt-0.5 font-medium text-white/90">
                  {formatUploadBytes(progress.bytesUploaded)} / {formatUploadBytes(progress.bytesTotal)}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-white/40">Speed</p>
                <p className="mt-0.5 font-medium text-cyan-300">
                  {formatUploadSpeed(progress.speedBps)} MB/s
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-white/40">Time left</p>
                <p className="mt-0.5 font-medium text-white/90">
                  {formatUploadEta(progress.etaSeconds)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400 transition-colors hover:border-red-400/50 hover:bg-red-500/10 sm:w-auto"
            >
              <X className="h-3.5 w-3.5" />
              Cancel Upload
            </button>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">Upload complete</p>
                <p className="text-xs text-white/50">
                  {fileName || "APK"} · {formatUploadBytes(progress.bytesTotal || 0)}
                </p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs text-white/60 transition-colors hover:border-cyan-500/30 hover:text-cyan-400">
              <Upload className="h-3.5 w-3.5" />
              Replace APK
              <input
                ref={inputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Upload failed</p>
                <p className="mt-1 text-xs text-white/50">{error}</p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 px-4 py-2.5 text-xs text-cyan-400 hover:bg-cyan-500/10">
              <Upload className="h-3.5 w-3.5" />
              Try Again
              <input
                ref={inputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
