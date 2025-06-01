// NodeEditor.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import AddNode from './nodes/AddNode';
import IfNode from './nodes/IfNode';

const nodeTypes = {
  add: AddNode,
  if: IfNode,
};

export default function NodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingType, setPendingType] = useState<string | null>(null);
  const { getNodes, deleteElements } = useReactFlow();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.sourceHandle?.startsWith("out") && connection.targetHandle?.startsWith("in")) {
      setEdges((eds) => addEdge(connection, eds));
    } else {
      alert("❌ Verbindung nicht erlaubt (nur Ausgang → Eingang)");
    }
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (pendingType) {
      const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const id = `node-${nodes.length}`;
      const newNode = {
        id,
        type: pendingType,
        position,
        data: { type: pendingType },
      };
      setNodes((nds) => [...nds, newNode]);
      setPendingType(null);
    }
  }, [pendingType, nodes]);

  const deleteSelected = () => {
    const selected = getNodes().filter((node) => node.selected);
    if (selected.length === 0) return;
    deleteElements({ nodes: selected });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes]);

  const exportGraph = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGraph = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
      } catch (err) {
        alert("Ungültige JSON-Datei.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }} onClick={handleCanvasClick}>
      <div className="absolute left-4 top-4 z-50 bg-white p-2 rounded shadow">
        <button onClick={() => setShowModal(true)} className="mr-2">➕ Neue Node</button>
        <button onClick={deleteSelected} className="mr-2">🗑️ Löschen</button>
        <button onClick={exportGraph} className="mr-2">⬇️ Export</button>
        <button onClick={() => inputRef.current?.click()} className="mr-2">⬆️ Import</button>
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          accept="application/json"
          onChange={importGraph}
        />
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-2 font-bold">Node-Typ wählen</h3>
            <div className="flex gap-2">
              <button onClick={() => { setPendingType('add'); setShowModal(false); }}>ADD</button>
              <button onClick={() => { setPendingType('if'); setShowModal(false); }}>IF</button>
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setShowModal(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
