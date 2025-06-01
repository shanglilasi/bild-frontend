import { Handle, Position, NodeProps } from 'reactflow';
import { useEffect, useState } from 'react';

export default function AddNode({ data, selected }: NodeProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(data.name || 'Add');

  const inputs = data.inputs || {};
  const result = Object.values(inputs).reduce((sum, val) => sum + val, 0);

  // 🟡 Ergebnis sofort im Datenobjekt setzen
  data.result = result;

  useEffect(() => {
    data.name = name;
  }, [name]);

  const handleInput = (id: string, value: number) => {
    data.inputs = { ...data.inputs, [id]: value };
  };

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setShowModal(true);
      }}
      className={`p-2 border rounded shadow text-center min-w-[120px] relative outline-none ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
      tabIndex={0}
      data-no-drag
    >
      <div className="font-bold mb-1">{name}</div>

      <div className="text-xs mb-1">Summe: {result}</div>

      {/* Eingänge */}
      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: '30%' }}
        onConnect={(params) => handleInput('in-1', 0)}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: '70%' }}
        onConnect={(params) => handleInput('in-2', 0)}
      />

      {/* Ausgang */}
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />

      {/* Modal */}
      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-white border border-gray-400 rounded p-2 shadow z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-bold">Eigenschaften</div>
            <button
              onClick={() => setShowModal(false)}
              className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300"
            >
              ✕
            </button>
          </div>
          <div className="border border-gray-300 rounded p-2 space-y-2">
            <label className="block text-xs">
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-1 w-full"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}