import { useState } from "react";
import { ToastContainer } from "react-toastify";
import CodeEditor from "./components/CodeEditor";
import CodeSuggestions from "./components/CodeSuggestions";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState({
    "/App.js": `import React from 'react';
  export default function App() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Hello, Sandpack!</h1>
        <p>Start editing to see some magic happen!</p>
      </div>
    );
  }`,
  });

  const handleReset = () => {
    setFiles({
      "/App.js": `import React from 'react';
  export default function App() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Hello, Sandpack!</h1>
        <p>Start editing to see some magic happen!</p>
      </div>
    );
  }`,
    });
  };

  return (
    <div
      className={`h-screen w-screen ${
        darkMode ? "dark bg-gray-900" : "bg-white"
      }`}>
      <div className="container mx-auto h-full flex flex-col">
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}>
            Live React Editor
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Reset Editor
            </button>

            <CodeSuggestions
              code={files}
              setCode={setFiles}
              darkMode={darkMode}
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <CodeEditor
          darkMode={darkMode}
          initialFiles={files}
          onFilesChange={setFiles}
        />
      </div>
      <ToastContainer />
    </div>
  );
}
