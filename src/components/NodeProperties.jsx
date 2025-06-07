import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNode, removeNode } from "../store/workflowSlice";

const NodeProperties = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow.selectedNode);
  const [label, setLabel] = useState("");

  // ✅ Sync local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || "");
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  // ✅ Update local state while typing
  const handleChange = (event) => {
    setLabel(event.target.value);
  };

  // ✅ Dispatch update only when input loses focus
  const handleBlur = () => {
    dispatch(
      updateNode({
        ...selectedNode,
        data: { ...selectedNode.data, label },
      })
    );
  };

  const handleDelete = () => {
    dispatch(removeNode(selectedNode.id));
  };

  return (
    <div style={{ height: "60vh", padding: 10, background: "#eee", width: 250 }}>
      <h4>Edit Node</h4>
      <input
        type="text"
        value={label}
        onChange={handleChange} // ✅ Only updates local state
        onBlur={handleBlur} // ✅ Dispatch to Redux only when done typing
      />
      <button
        onClick={handleDelete}
        style={{
          marginTop: 10,
          color: "white",
          background: "red",
          padding: 5,
          border: "none",
          borderRadius: 5,
        }}
      >
        Delete Node
      </button>
    </div>
  );
};

export default NodeProperties;
