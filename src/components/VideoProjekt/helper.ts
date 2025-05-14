//components/VideoProjekt/helper.ts
import { BASE_URL } from "../../config";


export function getDisplayUrlFromFullPath(fullPath: string): string | null {
  const parts = fullPath.split("/Videos/");
  if (parts.length < 2) return null;

  const relativePath = `Videos/${parts[1]}`;
  const extension = relativePath.split(".").pop()?.toLowerCase();
  if (!extension) return null;

  if (["mp4", "mov", "avi", "mpg", "jpg", "jpeg", "png", "gif"].includes(extension)) {
    return `${BASE_URL}/utils/videos/${relativePath}`;
  } else {
    return null;
  }
}

export function gehtnicht_getDisplayUrlFromFullPath(fullPath: string): string | null {
  const relativePath = fullPath.includes("/Videos/")
    ? fullPath.split("/Videos/")[1]
    : fullPath.split("/")[fullPath.split("/").length - 1]; // letzte Komponente

  const extension = fullPath.split(".").pop()?.toLowerCase();
  if (!extension) return null;

  if (["mp4", "mov", "avi", "mpg", "jpg", "jpeg", "png", "gif"].includes(extension)) {
    //return `${BASE_URL}/utils/videos/${relativePath}`;
    return `${BASE_URL}/utils/videos/${encodeURIComponent(relativePath)}`;

  } else {
    return null;
  }
}



export function formatTime(seconds: number | null): string {
  if (seconds === null) return "--:--.--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const fraction = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, "0")}.${fraction.toString().padStart(2, "0")}`;
}
