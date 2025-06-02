// types.ts

import { NodeProps } from 'reactflow'

export interface NodeModule {
  type: string
  label: string
  description: string
  Component: React.FC<NodeProps>
  defaultData: Record<string, any>
  evaluate: (inputs: Record<string, any>, data: Record<string, any>) => any
}