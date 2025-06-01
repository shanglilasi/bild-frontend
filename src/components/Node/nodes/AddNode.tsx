// src/components/nodes/AddNode.tsx
import { Handle, Position,NodeProps } from 'reactflow';

export default function AddNode({ selected }: NodeProps) {
  return (
    
      <div
      className={`p-2 border rounded shadow text-center min-w-[100px] ${
        selected ? 'bg-blue-200 border-blue-500' : 'bg-white border-gray-300'
      }`}
    >
      <div className="font-bold mb-1">ADD</div>
      <Handle type="target" position={Position.Left} id="in0" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="in1" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '45%' }} />
    </div>
  );
}
