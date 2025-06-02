// src/components/Node/nodes/AddNode.tsx
import { Handle, Position, NodeProps } from 'reactflow'
import { NodeModule } from './types'

function AddNodeComponent({ data, selected }: NodeProps) {
  const name = data.name || 'Add'
  const result = data.result ?? '–'

  return (
    <div
      className={`p-2 border rounded shadow text-center min-w-[120px] relative outline-none ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
      tabIndex={0}
      data-no-drag
    >
      <div className="font-bold mb-1">{name}</div>
      <div className="text-xs mb-1">Summe: {result}</div>

      <Handle type="target" position={Position.Left} id="in-1" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="in-2" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  )
}

export const AddNode: NodeModule = {
  type: 'add',
  label: '➕ Add',
  description: 'Addiert zwei Werte.',
  Component: AddNodeComponent,
  defaultData: { name: 'Add' },
  evaluate: (inputs) => {
    return (Object.values(inputs) as number[]).reduce((sum, val) => sum + val, 0)
  }
}