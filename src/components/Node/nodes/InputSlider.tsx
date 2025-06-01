import { Handle, Position, NodeProps } from 'reactflow';
import { useEffect, useState } from 'react';

export default function InputSliderNode({ data, selected }: NodeProps) {
  //const [ setShowModal] = useState(false);
 
  const [value, setValue] = useState(data.value ?? data.range.min);
 
  const name = data.name || 'InputSlider';
  const isRunMode = data.mode === 'run';

  useEffect(() => {
    data.value = value;
    data.range = data.range;
    data.name = name; 
  }, [value, data.range, name]);




  return (
  <div
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
          min={data.range.min}
          max={data.range.max}
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
    </div>
  );
}