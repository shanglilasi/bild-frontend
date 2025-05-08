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

export async function loadMarks(videoFullPath: string): Promise<{
  id: number;
  name: string;
  data: EditableMark[];
} | null> {
  try {
    const encoded = encodeURIComponent(videoFullPath.replaceAll("/", "|"));
    const url = `${BASE_URL}/utils/schnittmarkeAktiv/${encoded}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fehler beim Laden der aktiven Variante");

    const data = await res.json();

    if (!Array.isArray(data.data)) {
      console.warn("⚠️ Unerwartetes Format für 'data.data':", data.data);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      data: data.data,
    };
  } catch (err) {
    console.error("Fehler beim Laden der aktiven Marken:", err);
    return null;
  }
}





export async function saveMarks(fullPath: string, bildNr: number, marks: EditableMark[]) {
  try {
    const encoded = encodeURIComponent(fullPath.replaceAll("/", "|"));
    const res = await fetch(`${BASE_URL}/utils/marks/${bildNr}/${encoded}`, {
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


export async function fetchMarkVariants(videoPath: string, bildNr: number, all = false): Promise<string[]> {
  try {
    const encodedPath = encodeURIComponent(videoPath.replaceAll("/", "|"));
    const res = await fetch(`${BASE_URL}/utils/markVariants//${bildNr}//${encodedPath}?all=${all}`);
    if (!res.ok) throw new Error("Fehler beim Laden der Varianten");
    const data = await res.json();
    return data.variants || [];
  } catch (err) {
    console.error("Fehler bei fetchMarkVariants:", err);
    return [];
  }
}


export async function loadMarksWithVariant(videoFullPath: string, variantName: string): Promise<EditableMark[]> {
  try {
    const encoded = encodeURIComponent(videoFullPath.replaceAll("/", "|"));
    const variant = encodeURIComponent(variantName);
    const res = await fetch(`${BASE_URL}/utils/marks/${encoded}?variant=${variant}`);
    if (!res.ok) throw new Error("Fehler beim Laden");
    const data = await res.json();
    return data.marks || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

