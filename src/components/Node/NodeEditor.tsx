import { useCallback, useEffect, useRef, useState } from 'react';
import { detectCycle, propagateSignalsRecursively } from './signalPropagation';
import NodeTypeSelectorModal from './nodes/NodeTypeSelectorModal';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
} from 'reactflow';

import 'reactflow/dist/style.css';
import NodeSettingsModal from './NodeSettingsModal';
import { nodeRegistry } from './NodeRegistry';

const nodeTypes = Object.fromEntries(
  nodeRegistry.map(({ type, Component }) => [type, Component])
);

export default function NodeEditor() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const [pendingType, setPendingType] = useState<string | null>(null);
  const [isRunMode, setIsRunMode] = useState(false);
  const [activeNodeForModal, setActiveNodeForModal] = useState<Node | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { getNodes, getEdges, deleteElements } = useReactFlow();

  const updateNodes = (changedNodes: Node[]) => {
    if (detectCycle(changedNodes, edges)) {
      alert('⚠️ Zyklus entdeckt!');
      return;
    }
    const updated = propagateSignalsRecursively(changedNodes, edges);
    setNodes(updated);
  };

  const handleNodeChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((prevNodes) => {
        const safeChanges = changes.map((change) => {
          // Nur Positions- oder Selektions-Änderungen blockieren im Run-Modus
          if (isRunMode && ['position', 'select', 'dimensions'].includes(change.type)) {
            return { ...change, position: undefined, selected: undefined };
          }
          return change;
        });

        const changed = applyNodeChanges(safeChanges, prevNodes);
        updateNodes(changed);
        return changed;
      });
    },
    [edges, isRunMode]
  );

  const handleEdgeChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        updateNodes(nodes);
        return updated;
      });
    },
    [nodes]
  );

  const handleConnect = (connection: Connection) => {
    const { source, sourceHandle, target, targetHandle } = connection;

    if (!source || !target || !sourceHandle || !targetHandle) return;
    if (source === target) {
      alert('Selbstverbindungen sind nicht erlaubt.');
      return;
    }

    const isAlreadyConnected = edges.some(
      (e) => e.target === target && e.targetHandle === targetHandle
    );
    if (isAlreadyConnected) {
      alert(`Der Eingang "${targetHandle}" ist bereits verbunden.`);
      return;
    }

    setEdges((eds) => addEdge(connection, eds));
  };

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

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (isRunMode || !pendingType || !reactFlowWrapper.current) return;
      if (pendingType === 'select') return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const module = nodeRegistry.find((mod) => mod.type === pendingType);
      if (!module) return;

      const id = `node-${nodes.length}`;

      const newNode: Node = {
        id,
        type: pendingType,
        position,
        data: {
          ...module.defaultData,
          type: pendingType,
          mode: 'design',
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

  const exportGraph = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
      type: 'application/json',
    });
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
            name: n.data.name,
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
        <button onClick={() => !isRunMode && setPendingType('select')}>
          ➕ Neue Node
        </button>
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

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChange}
        onEdgesChange={!isRunMode ? handleEdgeChange : undefined}
        onConnect={handleConnect}
        onNodesDelete={isRunMode ? () => false : undefined}
        onEdgesDelete={isRunMode ? () => false : undefined}
        nodeTypes={nodeTypes}
        fitView
        onNodeDoubleClick={(event, node) => {
          event.stopPropagation();
          setActiveNodeForModal(node);
        }}
      >
        <Controls />
        <Background />
      </ReactFlow>

      {activeNodeForModal && (
        <NodeSettingsModal
          node={activeNodeForModal}
          onClose={() => setActiveNodeForModal(null)}
          onUpdate={(updatedData) => {
            setNodes((nodes) => {
              const updated = nodes.map((n) =>
                n.id === activeNodeForModal.id
                  ? { ...n, data: { ...n.data, ...updatedData } }
                  : n
              );
              const propagated = propagateSignalsRecursively(updated, edges);
              return propagated;
            });
          }}
        />
      )}

      {pendingType === 'select' && (
        <NodeTypeSelectorModal
          onSelect={(type) => setPendingType(type)}
          onClose={() => setPendingType(null)}
        />
      )}
    </div>
  );
}