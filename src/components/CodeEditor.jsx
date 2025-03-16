import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";

export default function CodeEditor({ darkMode, initialFiles, onFilesChange }) {
  const [files, setFiles] = useState(initialFiles);
  const initialMount = useRef(true);

  // Sync with parent only on user edits, not initial mount
  useEffect(() => {
    if (!initialMount.current) {
      onFilesChange(files);
    }
  }, [files]);

  // Handle initial files and parent updates
  useEffect(() => {
    if (JSON.stringify(initialFiles) !== JSON.stringify(files)) {
      setFiles(initialFiles);
    }
    initialMount.current = false;
  }, [initialFiles]);

  const [dependencies, setDependencies] = useState({});

  const handleInstall = (packages) => {
    setDependencies((prev) => ({
      ...prev,
      ...Object.fromEntries(packages.map((pkg) => [pkg, "latest"])),
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <Sandpack
        template="react"
        files={files}
        customSetup={{ dependencies }}
        options={{
          showLineNumbers: true,
          showConsole: true,
        }}
        theme={darkMode ? "dark" : "light"}
        className="flex-1"
      />
      <Terminal onCommand={handleInstall} darkMode={darkMode} />
    </div>
  );
}
