// components/subBilder/BildLink.tsx
import { useState } from "react";
import { ClipboardCopy } from "lucide-react";

interface BildLinkProps {
  url: string;
}

export function BildLink({ url }: BildLinkProps) {
  const [showNotification, setShowNotification] = useState(false);

  const kopiereBildUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // Nach 2 Sekunden wieder ausblenden
    } catch (error) {
      console.error("Fehler beim Kopieren der URL:", error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 relative">
      <div className="flex items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-800 text-sm"
          title="Bild in neuem Tab öffnen"
        >
          {url.split('/utils/images/')[1]?.replace(/\\/g, '/').replace(/\/+/g, '/')}
        </a>

        <button
          onClick={kopiereBildUrl}
          type="button"
          title="Bild-URL kopieren"
          className="text-gray-600 hover:text-green-600"
        >
          <ClipboardCopy size={18} />
        </button>
      </div>

      {showNotification && (
        <div className="absolute top-0 right-0 mt-2 p-2 bg-green-100 text-green-800 rounded shadow text-sm">
          URL kopiert!
        </div>
      )}
    </div>
  );
}