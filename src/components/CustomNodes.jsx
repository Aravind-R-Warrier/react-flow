import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { FaPlay, FaCog, FaQuestion } from "react-icons/fa"; // ✅ Import Icons

const nodeStyle = {
  padding: 10,
  borderRadius: 5,
  color: "white",
  textAlign: "center",
  minWidth: 100,
  position: "relative",
  border: "1px solid black",
  display: "flex",
  alignItems: "center",
  gap: "8px", // ✅ Space between icon & text
  justifyContent: "center",
};

const StartNode = ({ data }) => (
  <div style={{ ...nodeStyle, background: "#4CAF50" }}>
    <FaPlay />
    <div>{data.label || "Start"}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const ProcessNode = ({ data }) => (
  <div style={{ ...nodeStyle, background: "#2196F3" }}>
    <Handle type="target" position={Position.Left} />
    <FaCog />
    <div>{data.label || "Process"}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const DecisionNode = ({ data }) => (
  <div style={{ ...nodeStyle, background: "#FFC107", color: "black" }}>
    <Handle type="target" position={Position.Left} />
    <FaQuestion />
    <div>{data.label || "Decision"}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

export const nodeTypes = {
  Start: StartNode,
  Process: ProcessNode,
  Decision: DecisionNode,
};
