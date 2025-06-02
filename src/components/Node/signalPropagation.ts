// components/Node/signalPropagation.ts

import { Node, Edge } from 'reactflow';

export function detectCycle(nodes: Node[], edges: Edge[]): boolean {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    const targets = graph.get(edge.source) || [];
    targets.push(edge.target);
    graph.set(edge.source, targets);
  }

  const visited = new Set<string>();
  const visiting = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (hasCycle(node.id)) return true;
  }

  return false;
}
export function propagateSignalsRecursively(nodes: Node[], edges: Edge[]): Node[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));
  const inputsMap = new Map<string, string[]>();
  const dependentsMap = new Map<string, string[]>();

  edges.forEach((e) => {
    inputsMap.set(e.target, [...(inputsMap.get(e.target) || []), e.source]);
    dependentsMap.set(e.source, [...(dependentsMap.get(e.source) || []), e.target]);
  });

  const sorted: string[] = [];
  const visited = new Set<string>();

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const dependents = dependentsMap.get(nodeId) || [];
    dependents.forEach(dfs);
    sorted.push(nodeId);
  };

  nodes.forEach((n) => dfs(n.id));
  sorted.reverse();

  const updatedNodes: Node[] = [];

  sorted.forEach((id) => {
    const node = nodeMap.get(id);
    if (!node) return;

    const incoming = edges.filter((e) => e.target === id);
    const inputs: Record<string, any> = {};
    incoming.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const value = sourceNode?.data.result ?? sourceNode?.data.value ?? 0;
      const inputId = edge.targetHandle || edge.source;
        inputs[inputId] = value;



    });

    let result = node.data.result;

    // 🔢 Addition
    if (node.type === 'add') {
      result = Object.values(inputs).reduce((a, b) => a + b, 0);
    }

    // 🔗 String-Konkatenation (ConcatNode)
    if (node.type === 'concat') {
      const inputOrder = node.data.inputOrder || Object.keys(inputs);
      const enabledInputs = node.data.enabledInputs || {};
      result = inputOrder
        .filter((id: string) => enabledInputs[id] !== false)
        .map((id: string) => String(inputs[id] ?? ''))
        .join('');
    }

    const updatedNode: Node = {
      ...node,
      data: {
        ...node.data,
        inputs,
        result,
      },
    };

    nodeMap.set(id, updatedNode);
    updatedNodes.push(updatedNode);
  });

  return updatedNodes;
}