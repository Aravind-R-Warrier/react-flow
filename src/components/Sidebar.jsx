import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPalette, FaShapes } from "react-icons/fa";
import { GiCog } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { MdOutlineStart } from "react-icons/md";

const ICONS = {
  Start: <MdOutlineStart size={16} />,
  Process: <GiCog size={16} />,
  Decision: <AiOutlineQuestionCircle size={16} />,
  Shapes: <FaShapes size={16} />,
};

const DEFAULTS = [
  { id: "Start", label: "Start", color: "#4CAF50", iconKey: "Start" },
  { id: "Process", label: "Process", color: "#2196F3", iconKey: "Process" },
  { id: "Decision", label: "Decision", color: "#FFC107", iconKey: "Decision" },
];

const STORAGE_KEY = "customNodeTypes_v1";

const Sidebar = ({ onDragStart }) => {
  const [customTypes, setCustomTypes] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#888888");
  const [iconKey, setIconKey] = useState("Shapes");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setCustomTypes(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setCustomTypes([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customTypes));
  }, [customTypes]);

  const builtins = DEFAULTS;

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return alert("Please enter a name for the node type.");
    const id = `${trimmed.replace(/\s+/g, "-")}-${Date.now()}`;
    const newType = { id, label: trimmed, color, iconKey };
    setCustomTypes((s) => [newType, ...s]);
    setName("");
    setColor("#888888");
    setIconKey("Shapes");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this custom node type?")) return;
    setCustomTypes((s) => s.filter((t) => t.id !== id));
  };

  const NodePreview = ({ label, color, icon }) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 8,
        background: color,
        color: "#fff",
        minWidth: 120,
        justifyContent: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>{icon}</div>
      <div style={{ fontWeight: 600 }}>{label}</div>
    </div>
  );

  const handleDragStart = (event, typeId, previewProps) => {
    event.dataTransfer.setData("nodeType", typeId);
    event.dataTransfer.effectAllowed = "move";
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 40;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = previewProps.color || "#666";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(previewProps.label || typeId, 10, 24);
      event.dataTransfer.setDragImage(canvas, 80, 20);
    } catch (err) {}

    if (typeof onDragStart === "function") onDragStart(event, typeId);
  };

  return (
    <aside
      style={{
        width: 240,
        padding: 16,
        background: "#0f1720",
        color: "#e6eef8",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "2px 0 12px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Node Library</h3>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div
            title="Library"
            style={{
              padding: 6,
              borderRadius: 6,
              background: "#0b1220",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaPalette />
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: "#a8b3c7", marginBottom: 8 }}>Built-in</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {builtins.map((b) => (
            <div
              key={b.id}
              draggable
              onDragStart={(e) => handleDragStart(e, b.id, { label: b.label, color: b.color })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px",
                background: "#0b1620",
                borderRadius: 8,
                cursor: "grab",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <NodePreview label={b.label} color={b.color} icon={ICONS[b.iconKey] || <FaShapes />} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#a8b3c7" }}>Custom</div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#8da3c6" }}>
            {customTypes.length} saved
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {customTypes.length === 0 && (
            <div style={{ fontSize: 12, color: "#8092a9" }}>No custom nodes yet — create one below.</div>
          )}

          {customTypes.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => handleDragStart(e, t.id, { label: t.label, color: t.color })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px",
                background: "#07101a",
                borderRadius: 8,
                cursor: "grab",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NodePreview label={t.label} color={t.color} icon={ICONS[t.iconKey] || <FaShapes />} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleDelete(t.id)}
                  title="Delete"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ffb3b3",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <FaPlus />
          <div style={{ fontSize: 13, fontWeight: 700 }}>Create custom node</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type (e.g., Approval)"
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#07101a",
              color: "#e6eef8",
            }}
          />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Pick color"
              style={{
                width: 44,
                height: 34,
                border: "none",
                padding: 4,
                background: "transparent",
                cursor: "pointer",
              }}
            />
            <select
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "#07101a",
                color: "#e6eef8",
              }}
            >
              {Object.keys(ICONS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreate}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                border: "none",
                background: "#0ea5a0",
                color: "#052028",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#8496b0" }}>
            Tip: drag any node from above onto the canvas to create an instance.
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
