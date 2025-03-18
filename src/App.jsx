import { useState } from "react";
import { FiMoon, FiRefreshCw, FiSun } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import CodeEditor from "./components/CodeEditor";
import CodeSuggestions from "./components/CodeSuggestions";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [code, setCode] = useState({
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
    <div className={` w-screen ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto h-full flex flex-col">
        <header
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } bg-gradient-to-r ${
            darkMode ? "from-gray-800 to-gray-900" : "from-blue-50 to-purple-50"
          } flex justify-between items-center shadow-sm`}>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            } font-mono tracking-tight`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              React Live Studio
            </span>
          </h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleReset}
              className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-200"
                  : "hover:bg-gray-100 text-gray-600"
              } group`}>
              <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
              <span className="sr-only">Reset</span>
            </button>

            <CodeSuggestions
              code={code}
              setCode={setCode}
              darkMode={darkMode}
            />

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-yellow-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}>
              {darkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <CodeEditor
          darkMode={darkMode}
          initialFiles={code}
          onFilesChange={setCode}
        />
      </div>
      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}
