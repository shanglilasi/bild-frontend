import { useState } from "react";
import { FileEntry } from "./types";
import FileTreeActions from "./FileTreeActions"; // Import hinzufügen


interface FileTreeProps {
  entry: FileEntry;
  onSelect: (fullPath: string) => void;
  onRefresh?: () => void;
  selectedPath?: string;
}
const getFileSymbol = (entry: FileEntry, isOpen: boolean): string => {
  const ext = entry.name.toLowerCase();
  if (entry.children && entry.children.length > 0) {
    return isOpen ? "🎞️" : "🎞️🧪"; // oder ➖/➕
  } else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png")) {
    return "📷";
  } else if (ext.endsWith(".mp3") || ext.endsWith(".m4a")) {
    return "🎧";
  } else {
    return "🎞️";
  }
};

export default function FileTree({ entry, onSelect, selectedPath,onRefresh }: FileTreeProps) {
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
      {/* 👇 Nur diese Zeile ist eine `group` */}
      <div className="relative group">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
            isSelected
              ? "bg-blue-200 text-blue-900 font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          
          onClick={() => {
            console.log("✅ onSelect triggered via ROW:", entry.fullPath);
            onSelect(entry.fullPath);
          }}
        >
         <span
  onClick={(e) => {
    e.stopPropagation(); // immer stoppen, damit es nicht doppelt triggert

    if (hasChildren) {
      setOpen(!open); // Ordner auf-/zuklappen
    } else {
      onSelect(entry.fullPath); // Datei (z. B. Audio) auswählen
    }
  }}
  className="cursor-pointer"
>
  {symbol}
</span>
  
          <span>{getShortName(entry.name, entry.fullPath, entry.sizeMB)}</span>
  
          {!hasChildren && (
            <FileTreeActions
              fullPath={entry.fullPath}
              name={entry.name}
              onActionDone={() => {}}
              onRefresh={onRefresh}
            />
          )}
        </div>
  
        {/* Tooltip: erscheint nur bei Hover dieser einen Zeile */}
        {(entry.specs || entry.name) && (
        
           <div className="absolute top-full left-0 mt-1 z-30 px-2 py-1 bg-black text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none max-w-xs">
            {entry.name}
            {entry.specs && (
              <>
                {`\nResolution: ${entry.specs.width}x${entry.specs.height}`}
                {`\nFPS: ${entry.specs.fps}`}
                {`\nFrames: ${entry.specs.frames}`}
                {`\nDuration: ${entry.specs.duration}`}
              </>
            )}
          </div>
        )}
      </div>
  
      {/* Rekursion */}
      {hasChildren && open && (
        <div className="pl-4">
          {entry.children!.map((child, idx) => (
            <FileTree
              key={idx}
              entry={child}
              onSelect={onSelect}
              onRefresh={onRefresh}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}