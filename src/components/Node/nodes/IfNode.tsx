// src/components/Node/nodes/IfNode.tsx
import { Handle, Position, NodeProps } from 'reactflow';

export default function IfNode({ selected }: NodeProps) {
  return (
    <div className={`p-2 border rounded shadow min-w-[120px] text-center ${selected ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}>
      <div className="font-bold mb-1">IfNode</div>
      <Handle type="target" position={Position.Left} id="cond" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="true" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="false" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  );
}
