import { useState } from "react";
import { FileEntry } from "./types";

interface FileTreeProps {
  entry: FileEntry;
  onSelect: (fullPath: string) => void;
  selectedPath?: string;
}

const getFileSymbol = (entry: FileEntry, isOpen: boolean): string => {
  const ext = entry.name.toLowerCase();
  if (entry.children && entry.children.length > 0) {
    return isOpen ? "🎞️" : "🎞️"; // oder ➖/➕
  } else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png")) {
    return "📷";
  } else {
    return "📄";
  }
};

export default function FileTree({ entry, onSelect, selectedPath }: FileTreeProps) {
  const [open, setOpen] = useState(entry.isExpanded ?? false);
  const isSelected = selectedPath === entry.fullPath;
  const hasChildren = entry.children && entry.children.length > 0;

  const getShortName = (name: string, fullPath: string, sizeMB: string) => {
    const parts = fullPath.split("/");
    const parent = parts.length > 1 ? parts[parts.length - 2] : "";
    if (name.startsWith(parent)) {
      let short = name.slice(parent.length);
      if (short.startsWith("_")) short = short.slice(1);
      return (
        <>
          <span style={{ color: "silver" }}>{sizeMB}MB</span> ...{short}
        </>
      );
    }
    return name;
  };

  const symbol = getFileSymbol(entry, open);

  return (
    <div className="pl-2">
      {/* Hauptzeile: Symbol + Name (mit beidem interaktiv) */}
      <div
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
          isSelected
            ? "bg-blue-200 text-blue-900 font-semibold"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        title={
          `${entry.name}` +
          (entry.specs
            ? `\nResolution: ${entry.specs.width}x${entry.specs.height}` +
              `\nFPS: ${entry.specs.fps}` +
              `\nFrames: ${entry.specs.frames}` +
              `\nDuration: ${entry.specs.duration}`
            : "")
        }
        onClick={() => onSelect(entry.fullPath)}
      >
        <span
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation(); // Symbol-Klick nur zum Auf-/Zuklappen
              setOpen(!open);
            }
          }}
          className="cursor-pointer"
        >
          {symbol}
        </span>
        <span>{getShortName(entry.name, entry.fullPath, entry.sizeMB)}</span>
      </div>

      {/* Rekursive Darstellung der Children (nur wenn offen) */}
      {hasChildren && open && (
        <div className="pl-4">
          {entry.children!.map((child, idx) => (
            <FileTree
              key={idx}
              entry={child}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}