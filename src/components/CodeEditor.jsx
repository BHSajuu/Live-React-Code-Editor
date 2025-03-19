import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { Sandpack } from "@codesandbox/sandpack-react";
import { ecoLight } from "@codesandbox/sandpack-themes";
import { useRef, useState } from "react";
import Terminal from "./Terminal";

export default function CodeEditor({ darkMode, initialFiles, onFilesChange }) {
  const [dependencies, setDependencies] = useState({});

  const handleInstall = (packages) => {
    setDependencies((prev) => ({
      ...prev,
      ...Object.fromEntries(packages.map((pkg) => [pkg, "latest"])),
    }));
  };

  const [editorHeight, setEditorHeight] = useState(580);
  const startYRef = useRef(0);
  const startHeightRef = useRef(580);
  const draggingRef = useRef(false);

  const handleMouseDown = (e) => {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    const newHeight = startHeightRef.current + deltaY;
    if (newHeight > 100) {
      setEditorHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col h-full px-5">
      <Sandpack
        template="react"
        files={initialFiles}
        onChange={onFilesChange}
        customSetup={{
          dependencies,
          extensions: [autocompletion(), completionKeymap],
        }}
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showConsole: true,
          showConsoleButton: true,
          resetOnPreviewRestart: true,
          showNavigator: true,
          showTabs: true,
          closableTabs: true,
          editorHeight: editorHeight,
          autorun: false,
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        theme={darkMode ? "dark" : ecoLight}
        className="flex-1"
      />
      <div
        style={{ height: "5px", background: "#ccc", cursor: "row-resize" }}
        onMouseDown={handleMouseDown}
      />
      <Terminal onCommand={handleInstall} darkMode={darkMode} />
    </div>
  );
}
