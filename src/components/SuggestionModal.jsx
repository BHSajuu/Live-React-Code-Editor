import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

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
    <div className="fixed right-0 top-0 h-full z-50 shadow-2xl">
      <div
        className={`absolute left-0 top-0 h-full w-1.5 cursor-col-resize z-50 ${
          darkMode ? "hover:bg-purple-400" : "hover:bg-purple-600"
        } transition-colors`}
        onMouseDown={handleMouseDown}
      />

      <div
        style={{ width: `${width}px` }}
        className={`h-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        } flex flex-col border-l ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition-[width] duration-100 ease-in-out`}>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3
            className={`text-xl font-semibold ${
              darkMode ? "text-purple-400" : "text-purple-600"
            } font-mono`}>
            ✨ AI Suggestions
          </h3>
          <button
            onClick={onClose}
            className={`p-2 hover:opacity-70 transition-opacity ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div
          className={`flex-1 overflow-auto ${
            darkMode ? "bg-gray-900" : "bg-gray-50"
          }`}>
          <SyntaxHighlighter
            language="javascript"
            style={darkMode ? vscDarkPlus : vs}
            customStyle={{
              padding: "1.5rem",
              background: "none",
              margin: 0,
              fontSize: "0.875rem",
            }}>
            {suggestion}
          </SyntaxHighlighter>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            Discard
          </button>
          <button
            onClick={onApply}
            className={`px-4 py-2 rounded-lg transition-colors bg-gradient-to-r ${
              darkMode
                ? "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            } text-white`}>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
