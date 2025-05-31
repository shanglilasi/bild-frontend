import { useRef, useState } from "react";

interface FileItemProps {
  file: string;
  isHovered: boolean;
  probeInfo: any;
  onHover: (file: string | null) => void;
  onSetProbeInfo: (data: any) => void;
  onSelect: (file: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function FileItem({
  file,
  isHovered,
  probeInfo,
  onHover,
  onSetProbeInfo,
  onSelect,
  scrollContainerRef,
}: FileItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [showAbove, setShowAbove] = useState(false);

  const handleMouseEnter = () => {
    onHover(file);

    if (itemRef.current && scrollContainerRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const spaceBelow = containerRect.bottom - itemRect.bottom;
      const previewHeight = 150;
      setShowAbove(spaceBelow < previewHeight);
    }
  };

  return (
    <div
      ref={itemRef}
      onClick={() => onSelect(file)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        onHover(null);
        onSetProbeInfo(null);
      }}
      className="cursor-pointer hover:bg-blue-100 p-1 border-b relative"
    >
      {file}

      {isHovered && probeInfo && !probeInfo.error && (
        <div
          className={`absolute ${showAbove ? "bottom-full mb-1" : "top-full mt-1"} left-0 bg-white border p-2 z-50 shadow text-xs w-max max-w-md`}
        >
          <div><strong>Dauer:</strong> {probeInfo.duration}</div>
          <div><strong>FPS:</strong> {probeInfo.fps}</div>
          <div><strong>Frames:</strong> {probeInfo.frames}</div>
          <div><strong>Auflösung:</strong> {probeInfo.width}×{probeInfo.height}</div>
          <div><strong>avg_frame_rate:</strong> {probeInfo.avg_frame_rate}</div>
          <div><strong>r_frame_rate:</strong> {probeInfo.r_frame_rate}</div>
          <div><strong>Framerate-Typ:</strong> {probeInfo.vfr ? "Variable (VFR)" : "Konstant (CFR)"}</div>

          {probeInfo.vfr && (
            <div className="text-red-600 font-semibold mt-2">
              ⚠️ Achtung: Dieses Video hat variable Framerate (VFR) und ist nicht für Filter wie <code>xcrossfade</code> geeignet!
            </div>
          )}
        </div>
      )}

      {isHovered && probeInfo?.error && (
        <div
          className={`absolute ${showAbove ? "bottom-full mb-1" : "top-full mt-1"} left-0 bg-red-100 border border-red-300 text-red-800 text-xs p-1`}
        >
          ⚠️ {probeInfo.error}
        </div>
      )}
    </div>
  );
}