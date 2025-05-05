import { useState } from "react";
import { FileEntry } from "./types";
import { getFileIcon } from "./helper";

interface FileTreeProps {
  entry: FileEntry;
  onSelect: (fullPath: string) => void;
  selectedPath?: string; 
}

export default function FileTree({ entry, onSelect, selectedPath }: FileTreeProps) {
  const [open, setOpen] = useState(entry.isExpanded ?? false);
  const isSelected = selectedPath === entry.fullPath;

  const getShortName = (name: string, fullPath: string) => {
    const parts = fullPath.split("/");
    const parent = parts.length > 1 ? parts[parts.length - 2] : "";
    if (name.startsWith(parent)) {
      let short = name.slice(parent.length);
      if (short.startsWith("_")) short = short.slice(1); // optional: führenden _ entfernen
      return `...${short}`;
    }
    return name;
  };

  return entry.isFolder ? (
    <div className="pl-2">
      <div
        className="cursor-pointer flex items-center gap-2 font-semibold text-blue-700"
        onClick={() => setOpen(!open)}
      >
        {open ? "📂" : "📁"} {entry.name}
      </div>
      {open && entry.children && (
        <div className="pl-4">
          {entry.children.map((child, idx) => (
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
  ) : (
    <div className="pl-4 text-gray-700 space-y-1">
      <div
        className={`cursor-pointer px-2 py-1 rounded ${
          isSelected ? "bg-blue-200 text-blue-900 font-semibold" : "hover:bg-gray-100"
        }`}
        onClick={() => onSelect(entry.fullPath)}
        title={entry.name} // Tooltip mit vollem Namen
      >
        <span>
          {getFileIcon(entry.name)}
          {getShortName(entry.name, entry.fullPath)}
        </span>
      </div>
    </div>
  );
}