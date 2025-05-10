import { FileEntry } from "./types";

export function groupFilesByRootVideo(flatList: FileEntry[]): FileEntry[] {
  const remaining = [...flatList];

  // 1. Finde den Root: der erste .MP4 mit geringster Verzeichnistiefe
  const mp4s = remaining.filter((f) => f.fullPath.endsWith(".MP4"));  //auf alle gültigen Dateitypen erweitern
  const minDepth = Math.min(...mp4s.map((f) => f.fullPath.split("/").length));
  const root = mp4s.find((f) => f.fullPath.split("/").length === minDepth);

  if (!root) {
    return remaining; // kein Root gefunden – gib alle zurück
  }

  // Entferne Root aus remaining
  removeEntry(remaining, root.fullPath);

  // 2. Starte Rekursion ab Root
  root.children = collectChildrenRecursively(root, remaining);
  root.isExpanded = true;

  return [root, ...remaining]; // falls etwas übrig bleibt (z. B. losgelöste Einzelbilder)
}

// 🔁 Hilfsfunktion zur rekursiven Gruppierung
function collectChildrenRecursively(parent: FileEntry, list: FileEntry[]): FileEntry[] {
  const basePath = parent.fullPath.replace(/\.MP4$/i, "");

  // Alle direkten Unterdateien (liegen im Unterverzeichnis)
  const children = list.filter(
    (entry) =>
      entry.fullPath.startsWith(basePath + "/") &&
      entry.fullPath !== parent.fullPath &&
      isDirectChild(basePath, entry.fullPath)
  );

  for (const child of children) {
    removeEntry(list, child.fullPath);
    //const childBase = child.fullPath.replace(/\.(MP4|jpg)$/i, "");

    // Rekursiv alle Kinder des aktuellen Eintrags finden
    const subChildren = collectChildrenRecursively(child, list);
    if (subChildren.length > 0) {
      child.children = subChildren;
      child.isExpanded = true;
    }
  }

  return children;
}

// 🔍 Prüft, ob das Kind direkt im Unterordner des Elternteils liegt (nicht tiefer)
function isDirectChild(basePath: string, childPath: string): boolean {
  const baseDepth = basePath.split("/").length;
  const childDepth = childPath.split("/").length;
  return childDepth === baseDepth + 1;
}

// 🧹 Entfernt ein FileEntry aus der Liste anhand seines Pfads
function removeEntry(list: FileEntry[], fullPath: string): void {
  const index = list.findIndex((e) => e.fullPath === fullPath);
  if (index !== -1) list.splice(index, 1);
}