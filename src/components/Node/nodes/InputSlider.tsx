// src/components/Node/nodes/InputSlider.tsx
import { Handle, Position, NodeProps } from 'reactflow'
import { useState } from 'react'
import { NodeModule } from './types'

function InputSliderComponent({ data, selected }: NodeProps) {
  const name = data.name || 'InputSlider'
  const min = data.range?.min ?? 0
  const max = data.range?.max ?? 100

  const [value, setValue] = useState<number>(
    typeof data.value === 'number' ? data.value : min
  )

  // direkt aktualisieren
  const handleChange = (val: number) => {
    setValue(val)
    data.value = val // wird später durch evaluate() genutzt
  }

  return (
    <div
      className={`p-2 border rounded shadow text-center min-w-[140px] relative outline-none ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
      tabIndex={0}
      data-no-drag
    >
      <div className="font-bold mb-1">{name}</div>

      <div className="w-full" data-no-drag style={{ pointerEvents: 'auto' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          onPointerDown={(e) => {
            e.stopPropagation()
            if (e.currentTarget.setPointerCapture) {
              e.currentTarget.setPointerCapture(e.pointerId)
            }
          }}
          className="w-full"
        />
      </div>

      <div className="text-xs mt-1">Wert: {value}</div>

      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
    </div>
  )
}

export const InputSlider: NodeModule = {
  type: 'slide',
  label: '🎚️ Slider',
  description: 'Zahlenwert per Slider eingeben.',
  Component: InputSliderComponent,
  defaultData: {
    name: 'InputSlider',
    range: { min: 0, max: 100 },
    value: 50,
    mode: 'design',
  },
  evaluate: (_inputs, data) => {
    return data.value ?? 0 // wird in data.result geschrieben
  },
}
