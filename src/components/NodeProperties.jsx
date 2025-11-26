import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNode, removeNode } from "../store/workflowSlice";

/**
 * NodeProperties panel:
 * - local state synced from selectedNode
 * - debounced update to reduce Redux churn (commits on blur / Enter / debounce timeout)
 * - safe immutability (creates new node object)
 * - keyboard support (Enter commit, Escape revert)
 */
const DEBOUNCE_MS = 600;

const NodeProperties = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow.selectedNode);
  const [label, setLabel] = useState("");
  const initialRef = useRef(""); // to track original value for revert
  const timerRef = useRef(null);

  // sync local state when the selected node changes
  useEffect(() => {
    if (selectedNode) {
      const initial = selectedNode.data?.label || "";
      setLabel(initial);
      initialRef.current = initial;
    } else {
      setLabel("");
      initialRef.current = "";
    }

    // clear any pending debounce when node changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [selectedNode]);

  // helper to dispatch update (uses immutable clone)
  const commitUpdate = useCallback(
    (newLabel) => {
      if (!selectedNode) return;
      // don't dispatch if nothing changed
      if ((selectedNode.data?.label || "") === newLabel) return;

      const updatedNode = {
        ...selectedNode,
        data: { ...(selectedNode.data || {}), label: newLabel },
      };

      dispatch(updateNode(updatedNode));
      initialRef.current = newLabel;
    },
    [dispatch, selectedNode]
  );

  // debounced commit (called on change as a fallback)
  const scheduleDebouncedCommit = (newLabel) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      commitUpdate(newLabel);
      timerRef.current = null;
    }, DEBOUNCE_MS);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setLabel(v);
    // schedule a debounce commit so long edits eventually persist automatically
    scheduleDebouncedCommit(v);
  };

  const handleBlur = () => {
    // immediate commit on blur (cancel pending timer)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    commitUpdate(label);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // commit on Enter
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      commitUpdate(label);
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      // revert to initial value
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setLabel(initialRef.current);
    }
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    if (!window.confirm(`Delete node "${selectedNode.id}"?`)) return;
    dispatch(removeNode(selectedNode.id));
  };

  if (!selectedNode) return null;

  return (
    <div style={{ height: "60vh", padding: 10, background: "#eee", width: 250 }}>
      <h4>Edit Node</h4>

      <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#333" }}>
        Label
      </label>

      <input
        type="text"
        value={label}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Node label"
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleDelete}
        style={{
          marginTop: 10,
          color: "white",
          background: "red",
          padding: "6px 10px",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Delete Node
      </button>
    </div>
  );
};

export default NodeProperties;
