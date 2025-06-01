import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import AddNode from './nodes/AddNode';
import IfNode from './nodes/IfNode';
import InputSliderNode from './nodes/InputSlider';

const nodeTypes = {
  add: AddNode,
  if: IfNode,
  slide: InputSliderNode,
};

export default function NodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingType, setPendingType] = useState<string | null>(null);
  const [isRunMode, setIsRunMode] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { getNodes, getEdges, deleteElements } = useReactFlow();

  // 👇 Default-Namen je Node-Typ
  const getDefaultName = (type: string) => {
    switch (type) {
      case 'slide':
        return 'InputSlider';
      case 'add':
        return 'Add';
      case 'if':
        return 'If';
      default:
        return 'Node';
    }
  };

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (isRunMode || !pendingType || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = `node-${nodes.length}`;
      const newNode: Node = {
        id,
        type: pendingType,
        position,
        data: {
          type: pendingType,
          mode: 'design',
          name: getDefaultName(pendingType), // ✅ Name direkt setzen
        },
        draggable: true,
        deletable: true,
        selectable: true,
      };

      setNodes((nds) => [...nds, newNode]);
      setPendingType(null);
    },
    [pendingType, nodes, isRunMode, reactFlowInstance]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (isRunMode) return;
      if (
        connection.sourceHandle?.startsWith('out') &&
        connection.targetHandle?.startsWith('in')
      ) {
        setEdges((eds) => addEdge({ ...connection, deletable: true }, eds));
      } else {
        alert('❌ Nur Ausgang → Eingang erlaubt');
      }
    },
    [isRunMode]
  );

  const toggleMode = () => {
    const mode = !isRunMode ? 'run' : 'design';
    const isDesign = mode === 'design';
    setIsRunMode(!isRunMode);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, mode },
        draggable: isDesign,
        deletable: isDesign,
        selectable: true,
      }))
    );

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        deletable: isDesign,
        selectable: isDesign,
      }))
    );
  };

  const exportGraph = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
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
        const mode = isRunMode ? 'run' : 'design';
        const isDesign = mode === 'design';

        const patchedNodes = parsed.nodes.map((n: any) => ({
          ...n,
          data: {
            ...n.data,
            mode,
            name: n.data.name || getDefaultName(n.type), // ✅ Fallback für Namen
          },
          draggable: isDesign,
          deletable: isDesign,
          selectable: true,
        }));

        const patchedEdges = parsed.edges.map((e: any) => ({
          ...e,
          deletable: isDesign,
          selectable: isDesign,
        }));

        setNodes(patchedNodes);
        setEdges(patchedEdges);
      } catch (err) {
        alert('❌ Ungültige Datei');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && !isRunMode) {
        const selectedNodes = getNodes().filter((n) => n.selected);
        const selectedEdges = getEdges().filter((e) => e.selected);
        deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunMode]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100vw', height: '100vh' }}
      onClick={handleCanvasClick}
      className={isRunMode ? 'bg-green-100' : 'bg-gray-100'}
    >
      <div className="absolute left-4 top-4 z-50 bg-white p-2 rounded shadow flex gap-2">
        <button onClick={() => !isRunMode && setShowModal(true)}>➕ Neue Node</button>
        <button onClick={exportGraph}>⬇️ Export</button>
        <button onClick={() => inputRef.current?.click()}>⬆️ Import</button>
        <button onClick={toggleMode}>
          {isRunMode ? '🔧 Design-Modus' : '▶️ Run-Modus'}
        </button>
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
              <button onClick={() => { setPendingType('add'); setShowModal(false); }}>AddNode</button>
              <button onClick={() => { setPendingType('if'); setShowModal(false); }}>IfNode</button>
              <button onClick={() => { setPendingType('slide'); setShowModal(false); }}>InputSlider</button>
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
        onNodesChange={!isRunMode ? onNodesChange : undefined}
        onEdgesChange={!isRunMode ? onEdgesChange : undefined}
        onConnect={onConnect}
        onNodesDelete={isRunMode ? () => false : undefined}
        onEdgesDelete={isRunMode ? () => false : undefined}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}