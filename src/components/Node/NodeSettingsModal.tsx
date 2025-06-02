import { useEffect, useState } from 'react';
import { Node } from 'reactflow';

type NodeData = {
  name: string;
  type: string;
  range?: {
    min: number;
    max: number;
  };
  value?: number;
  [key: string]: any;
};

type NodeSettingsModalProps = {
  node: Node<NodeData>;
  onClose: () => void;
  onUpdate: (data: NodeData) => void;
};

export default function NodeSettingsModal({
  node,
  onClose,
  onUpdate,
}: NodeSettingsModalProps) {
  const [localData, setLocalData] = useState<NodeData>(node.data);

  useEffect(() => {
    setLocalData(node.data);
  }, [node]);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [onClose]);


  const handleSave = () => {
    onUpdate(localData);
    onClose();
  };

  return (
    

<div
  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  onClick={onClose}
>
  <div
    className="bg-white p-4 rounded shadow-md w-96 max-w-full"
    onClick={(e) => e.stopPropagation()}
  >
        <h2 className="text-lg font-bold mb-4">Einstellungen: {node.data.type}</h2>

        {/* Gemeinsames Feld: Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={localData.name}
            onChange={(e) =>
              setLocalData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border rounded p-1"
          />
        </div>

        {/* Typ-spezifisch: Slider Node */}
        {node.data.type === 'slide' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Min:</label>
              <input
                type="number"
                value={localData.range?.min ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setLocalData((prev) => ({
                      ...prev,
                      range: {
                        min: val,
                        max: prev.range?.max ?? 100,
                      },
                    }));
                  }
                }}
                className="w-full border rounded p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Max:</label>
              <input
                type="number"
                value={localData.range?.max ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setLocalData((prev) => ({
                      ...prev,
                      range: {
                        min: prev.range?.min ?? 0,
                        max: val,
                      },
                    }));
                  }
                }}
                className="w-full border rounded p-1"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}