import { Handle, Position, NodeProps } from 'reactflow';

export default function AddNode({ data, selected }: NodeProps) {
  const inputs = data.inputs || {};
  const result = (Object.values(inputs) as number[]).reduce((sum, val) => sum + val, 0);
  data.result = result;

  const handleInput = (id: string, value: number) => {
    data.inputs = { ...data.inputs, [id]: value };
  };

  return (
    <div
      className={`p-2 border rounded shadow text-center min-w-[120px] relative outline-none ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
      tabIndex={0}
      data-no-drag
    >
      <div className="font-bold mb-1">{data.name || 'Add'}</div>
      <div className="text-xs mb-1">Summe: {result}</div>

      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: '30%' }}
        onConnect={(_) => handleInput('in-1', 0)}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: '70%' }}
        onConnect={(_) => handleInput('in-2', 0)}
      />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  );
}