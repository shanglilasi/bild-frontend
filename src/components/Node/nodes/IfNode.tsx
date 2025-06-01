// src/components/nodes/IfNode.tsx
import { Handle, Position } from 'reactflow';

export default function IfNode({selected}) {
  return (
    <div
      className={`p-2 border rounded shadow text-center min-w-[100px] ${
        selected ? 'bg-blue-200 border-blue-500' : 'bg-white border-gray-300'
      }`}
    >
      <div className="font-bold mb-1">IF</div>
      <div className="text-xs mb-2">if (bedingung) → dann : sonst</div>
      <Handle type="target" position={Position.Left} id="cond" style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="then" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="else" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  );
}