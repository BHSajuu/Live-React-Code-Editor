import { useEffect, useRef, useState } from "react";

export default function SuggestionModal({
  suggestion,
  onApply,
  onClose,
  darkMode,
}) {
  const [width, setWidth] = useState(400);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(400);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = startX.current - e.clientX;
    const newWidth = startWidth.current + deltaX;
    setWidth(Math.min(Math.max(300, newWidth), 800));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full z-50 shadow-xl">
      {/* Resize handle */}
      <div
        className={`absolute left-0 top-0 h-full w-2 cursor-col-resize z-50
          ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-300"}`}
        onMouseDown={handleMouseDown}
      />

      <div
        style={{ width: `${width}px` }}
        className={`h-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        } flex flex-col border-l ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
            AI Code Suggestions
          </h3>
          <button
            onClick={onClose}
            className={`p-2 hover:opacity-70 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
            ×
          </button>
        </div>

        <div
          className={`flex-1 overflow-auto p-4 ${
            darkMode ? "text-gray-100 bg-gray-900" : "text-gray-800 bg-gray-50"
          }`}>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {suggestion}
          </pre>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}>
            Close
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
