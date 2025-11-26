import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";
import { useSelector, useDispatch } from "react-redux";
import { addNode, setNodes, setEdges, selectNode } from "../store/workflowSlice";
import { nodeTypes as importedNodeTypes } from "./CustomNodes";
import Sidebar from "./Sidebar";
import NodeProperties from "./NodeProperties";

const WorkflowCanvas = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes);
  const edges = useSelector((state) => state.workflow.edges);

  // Memoize nodeTypes to avoid re-renders
  const nodeTypes = useMemo(() => importedNodeTypes, []);

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => {
      // create stable id for new edge
      const edge = {
        id: params.id || `e${params.source}-${params.target}-${Date.now()}`,
        ...params,
      };
      dispatch(setEdges([...edges, edge]));
    },
    [dispatch, edges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_, node) => dispatch(selectNode(node)), [dispatch]);

  // Enable node dragging (applyNodeChanges)
  const onNodesChange = useCallback(
    (changes) => dispatch(setNodes(applyNodeChanges(changes, nodes))),
    [dispatch, nodes]
  );

  // Enable edge modifications
  const onEdgesChange = useCallback(
    (changes) => dispatch(setEdges(applyEdgeChanges(changes, edges))),
    [dispatch, edges]
  );

  // Handle node drop from Sidebar (simple bounding rect approach)
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("nodeType");
      if (!type) return;

      // compute position relative to the container
      const rect = event.currentTarget.getBoundingClientRect();
      const position = { x: event.clientX - rect.left - 100, y: event.clientY - rect.top - 25 };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type },
      };

      dispatch(addNode(newNode));
    },
    [dispatch]
  );

  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges };
    localStorage.setItem("workflowData", JSON.stringify(workflow));
    alert("Workflow saved!");
  }, [nodes, edges]);

  const loadWorkflow = useCallback(() => {
    const savedData = localStorage.getItem("workflowData");
    if (savedData) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
      dispatch(setNodes(savedNodes));
      dispatch(setEdges(savedEdges));
    }
  }, [dispatch]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
        <button
          style={{ backgroundColor: "lightgreen", color: "black" }}
          onClick={saveWorkflow}
        >
          Save Workflow
        </button>
        <button
          onClick={loadWorkflow}
          style={{ marginLeft: 10, backgroundColor: "lightgrey", color: "black" }}
        >
          Load Workflow
        </button>
      </div>

      <Sidebar onDragStart={(event, type) => event.dataTransfer.setData("nodeType", type)} />

      {/* React Flow Parent Container */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ height: "100vh", width: "70vw" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: "100%", height: "100%" }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <NodeProperties />
    </div>
  );
};

export default WorkflowCanvas;
