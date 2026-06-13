import type { SupabaseClient } from "@supabase/supabase-js";
import * as tus from "tus-js-client";

export const MAX_APK_SIZE_BYTES = 300 * 1024 * 1024;

export interface UploadProgressUpdate {
  bytesUploaded: number;
  bytesTotal: number;
  percent: number;
  speedBps: number;
  etaSeconds: number | null;
}

export interface ResumableUploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress: (update: UploadProgressUpdate) => void;
  upsert?: boolean;
}

export class UploadCancelledError extends Error {
  constructor() {
    super("Upload cancelled");
    this.name = "UploadCancelledError";
  }
}

export interface ResumableUploadHandle {
  promise: Promise<void>;
  cancel: () => void;
}

function getResumableUploadEndpoint(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Supabase URL is not configured.");

  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match?.[1]) throw new Error("Invalid Supabase URL format.");

  return `https://${match[1]}.storage.supabase.co/storage/v1/upload/resumable`;
}

export async function createResumableUpload(
  supabase: SupabaseClient,
  options: ResumableUploadOptions
): Promise<ResumableUploadHandle> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be logged in to upload files.");
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("Supabase anon key is not configured.");

  const endpoint = getResumableUploadEndpoint();
  let lastBytes = 0;
  let lastTime = Date.now();
  let speedBps = 0;
  let cancelled = false;

  let resolve!: () => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const upload = new tus.Upload(options.file, {
    endpoint,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      authorization: `Bearer ${session.access_token}`,
      apikey: anonKey,
      "x-upsert": String(options.upsert ?? true),
    },
    uploadDataDuringCreation: true,
    removeFingerprintOnSuccess: true,
    metadata: {
      bucketName: options.bucket,
      objectName: options.path,
      contentType: options.file.type || "application/vnd.android.package-archive",
      cacheControl: "3600",
    },
    chunkSize: 6 * 1024 * 1024,
    onProgress(bytesUploaded, bytesTotal) {
      const now = Date.now();
      const elapsed = (now - lastTime) / 1000;

      if (elapsed >= 0.25) {
        speedBps = Math.max(0, (bytesUploaded - lastBytes) / elapsed);
        lastBytes = bytesUploaded;
        lastTime = now;
      }

      const percent = bytesTotal > 0 ? (bytesUploaded / bytesTotal) * 100 : 0;
      const remaining = bytesTotal - bytesUploaded;
      const etaSeconds = speedBps > 0 ? remaining / speedBps : null;

      options.onProgress({
        bytesUploaded,
        bytesTotal,
        percent,
        speedBps,
        etaSeconds,
      });
    },
    onError(error) {
      if (!cancelled) reject(error);
    },
    onSuccess() {
      if (!cancelled) resolve();
    },
  });

  const previous = await upload.findPreviousUploads();
  if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
  upload.start();

  return {
    promise,
    cancel() {
      cancelled = true;
      upload.abort(true);
      reject(new UploadCancelledError());
    },
  };
}
