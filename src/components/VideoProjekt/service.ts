//components/VideoProjekt/service.ts
import { BASE_URL } from "../../config";
import { EditableMark } from "./types";

export async function fetchRelatedFiles(bildNr: number) {
  try {
    const res = await fetch(`${BASE_URL}/utils/listFilesTree/${bildNr}`);
    if (!res.ok) throw new Error("Fehler beim Laden der Dateien.");
    const data = await res.json();
    return data.entries;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function loadMarks(videoFullPath: string): Promise<EditableMark[]> {
  try {
    const parts = videoFullPath.split("/");
    const fileName = parts.pop() || "";
    const nameWithoutExt = fileName.split(".")[0];
    const markPath = [...parts, nameWithoutExt, `${nameWithoutExt}.mark`].join("/");
    const encoded = encodeURIComponent(markPath.replaceAll("/", "|"));
    const res = await fetch(`${BASE_URL}/utils/marks/${encoded}`);

    if (res.ok) {
      const data = await res.json();
      return [...data.marks].sort((a, b) => a.time - b.time);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Marken", err);
  }
  return [];
}

export async function saveMarks(fullPath: string, marks: EditableMark[]) {
  try {
    const encoded = encodeURIComponent(fullPath.replaceAll("/", "|"));
    const res = await fetch(`${BASE_URL}/utils/marks/${encoded}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marks }),
    });
    if (!res.ok) throw new Error("Fehler beim Speichern.");
    alert("Marken gespeichert.");
  } catch (err) {
    console.error(err);
    alert("Fehler beim Speichern.");
  }
}

