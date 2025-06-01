import { Handle, Position, NodeProps } from 'reactflow';
import { useEffect, useState } from 'react';

export default function InputSliderNode({ data, selected }: NodeProps) {
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState(data.range || { min: 0, max: 100 });
  const [value, setValue] = useState(data.value ?? range.min);
  const [minText, setMinText] = useState(range.min.toString());
  const [maxText, setMaxText] = useState(range.max.toString());
  const [name, setName] = useState(data.name || 'InputSlider'); // ✅

  const isRunMode = data.mode === 'run';

  useEffect(() => {
    data.value = value;
    data.range = range;
    data.name = name; // ✅
  }, [value, range, name]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.input-slider-modal')) {
        setShowModal(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinText(val);
    const num = parseInt(val);
    if (!isNaN(num)) setRange((r) => ({ ...r, min: num }));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxText(val);
    const num = parseInt(val);
    if (!isNaN(num)) setRange((r) => ({ ...r, max: num }));
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

      <div
        className="w-full"
        data-no-drag
        style={{ pointerEvents: 'auto' }}
      >
        <input
          type="range"
          min={range.min}
          max={range.max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (e.currentTarget.setPointerCapture) {
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          className="w-full"
        />
      </div>

      <div className="text-xs mt-1">Wert: {value}</div>

      {!isRunMode && (
        <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
      )}

      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-white border border-gray-400 rounded p-2 shadow z-10 input-slider-modal">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-bold">Eigenschaften</div>
            <button onClick={() => setShowModal(false)} className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300">
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

            <label className="block text-xs">
              Min:
              <input
                type="text"
                value={minText}
                onChange={handleMinChange}
                className="border p-1 w-full"
              />
            </label>

            <label className="block text-xs">
              Max:
              <input
                type="text"
                value={maxText}
                onChange={handleMaxChange}
                className="border p-1 w-full"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}