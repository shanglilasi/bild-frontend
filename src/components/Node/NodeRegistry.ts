// nodeRegistry.ts
import { NodeModule } from './nodes/types'

import { AddNode } from './nodes/AddNode'
import { MaxNode } from './nodes/MaxNode'
import { ConcatNode } from './nodes/ConcatNode'
import { InputSlider } from './nodes/InputSlider'

export const nodeRegistry: NodeModule[] = [
  AddNode,
  ConcatNode,
  InputSlider,
  MaxNode,
]