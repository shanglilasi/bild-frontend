// src/components/NodeEditorWrapper.tsx
import { ReactFlowProvider } from 'reactflow';
import NodeEditor from './NodeEditor';

export default function NodeEditorWrapper() {
  return (
    <ReactFlowProvider>
      <NodeEditor />
    </ReactFlowProvider>
  );
}
