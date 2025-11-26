import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null, // Track selected node for editing
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    removeNode: (state, action) => {
      const nodeId = action.payload;
      // optional: keep saved workflow removed when a node is deleted
      localStorage.removeItem("workflowData");
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      // Unselect node if deleted
      if (state.selectedNode?.id === nodeId) {
        state.selectedNode = null;
      }
    },
    selectNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex((node) => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = {
          ...state.nodes[index], // Keep existing node properties
          data: {
            ...state.nodes[index].data, // Preserve other data properties
            ...action.payload.data, // Merge changes
          },
        };
      }
    },
  },
});

export const { setNodes, setEdges, addNode, addEdge, removeNode, selectNode, updateNode } =
  workflowSlice.actions;
export default workflowSlice.reducer;
