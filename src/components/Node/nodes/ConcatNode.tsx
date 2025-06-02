import { Handle, Position, NodeProps } from 'reactflow';
import { useState, useEffect } from 'react';

export default function ConcatNode({ data, selected }: NodeProps) {
  const [inputOrder, setInputOrder] = useState<string[]>(data.inputOrder || ['in-1', 'in-2']);
  const [enabledInputs, setEnabledInputs] = useState<Record<string, boolean>>(data.enabledInputs || {});
  const inputs = data.inputs || {};

  // Ergebnis erzeugen
  const result = inputOrder
    .filter((id) => enabledInputs[id] !== false)
    .map((id) => String(inputs[id] ?? ''))
    .join('');

  data.result = result;
  data.inputOrder = inputOrder;
  data.enabledInputs = enabledInputs;

  useEffect(() => {
    if (!data.inputOrder) {
      const initialOrder = ['in-1', 'in-2'];
      const initialEnabled: Record<string, boolean> = {
        'in-1': true,
        'in-2': true,
      };
      setInputOrder(initialOrder);
      setEnabledInputs(initialEnabled);
      data.inputOrder = initialOrder;
      data.enabledInputs = initialEnabled;
    }
  }, [data]);

  const toggleInput = (id: string) => {
    const updated = { ...enabledInputs, [id]: !enabledInputs[id] };
    setEnabledInputs(updated);
    data.enabledInputs = updated;
  };

  const addInput = () => {
    const nextIndex = inputOrder.length + 1;
    const newId = `in-${nextIndex}`;
    const newOrder = [...inputOrder, newId];
    const newEnabled = { ...enabledInputs, [newId]: true };

    setInputOrder(newOrder);
    setEnabledInputs(newEnabled);
    data.inputOrder = newOrder;
    data.enabledInputs = newEnabled;
  };

  return (
  <div
  className={`p-2 border rounded shadow text-center min-w-[120px] relative outline-none ${
    selected ? 'ring-2 ring-blue-400' : ''
  }`}
  tabIndex={0}
  data-no-drag
>
      <div className="font-bold text-center mb-2">{data.name || 'Concat'}</div>

      {inputOrder.map((id) => (
        <div key={id} className="flex items-center gap-2 text-xs relative mb-1">
          <Handle
            type="target"
            position={Position.Left}
            id={id}
            style={{ top: '50%', transform: 'translateY(-50%)', left: -8 }}
          />
          <span className="flex-1">Input {id}</span>
          <input
            type="checkbox"
            checked={enabledInputs[id] !== false}
            onChange={() => toggleInput(id)}
            title="Aktivieren / Deaktivieren"
          />
        </div>
      ))}

      <button
        onClick={addInput}
        className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
      >
        + Eingang hinzufügen
      </button>

      <div className="mt-3 text-[11px] bg-gray-100 rounded p-1 break-all border text-gray-700">
        <strong>Ergebnis:</strong> {result || <span className="italic text-gray-400">[leer]</span>}
      </div>

      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  );
}