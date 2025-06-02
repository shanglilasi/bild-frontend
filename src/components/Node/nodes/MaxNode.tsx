// src/components/Node/nodes/MaxNode.tsx
import { Handle, Position, NodeProps } from 'reactflow'
import { NodeModule } from './types'

function MaxNodeComponent({ data, selected }: NodeProps) {
  const name = data.name || 'Max'
 
  const value = data.result ?? '–'

  return (
     <div
      className={`p-2 border rounded shadow text-center min-w-[120px] relative outline-none ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
      tabIndex={0}
      data-no-drag
    >
      <div className="font-semibold mb-1">{name}</div>
      <div className="text-lg font-mono mb-1">{value}</div>

      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ top: '70%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ top: '50%' }}
      />
    </div>
  )
}

export const MaxNode: NodeModule = {
  type: 'max',
  label: '⬆ Max',
  description: 'Gibt den größeren der beiden Eingänge zurück.',
  Component: MaxNodeComponent,
  defaultData: {
    name: '⬆ Max',
    value: null,
    mode: 'design',
  },
  evaluate: (inputs) => {
    return Math.max(inputs.a ?? -Infinity, inputs.b ?? -Infinity)
  },
}