import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { Sandpack } from "@codesandbox/sandpack-react";
import { ecoLight } from "@codesandbox/sandpack-themes";
import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";

export default function CodeEditor({ darkMode, initialFiles, onFilesChange }) {
  const [files, setFiles] = useState(initialFiles);
  const initialMount = useRef(true);

  useEffect(() => {
    if (!initialMount.current) {
      onFilesChange(files);
    }
  }, [files]);

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
        customSetup={{
          dependencies,
          extensions: [autocompletion(), completionKeymap],
        }}
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showConsole: true,
          showNavigator: true,
          showTabs: true,
          closableTabs: true,
          editorHeight: 480,
          autorun: false,
        }}
        theme={darkMode ? "dark" : ecoLight}
        className="flex-1"
      />
      <Terminal onCommand={handleInstall} darkMode={darkMode} />
    </div>
  );
}
