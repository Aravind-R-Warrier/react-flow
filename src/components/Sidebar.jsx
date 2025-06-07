import React from "react";

const Sidebar = ({ onDragStart }) => {
  return (
    <aside style={{ width: 200, padding: 10, background: "#eee" }}>
      <h4>Nodes</h4>
      {["Start", "Process", "Decision"].map((type) => (
        <div
          key={type}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData("nodeType", type);
            event.dataTransfer.effectAllowed = "move"; // ✅ Ensure correct behavior
          }}
          style={{
            padding: 10,
            marginBottom: 10,
            background: "#ddd",
            cursor: "grab",
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          {type} Node
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
