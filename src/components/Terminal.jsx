import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function TerminalComponent({ onCommand, darkMode }) {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(new FitAddon());
  const [isInitialized, setIsInitialized] = useState(false);
  const inputBuffer = useRef([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const welcomeShown = useRef(false);

  // Initial welcome message and prompt
  const showWelcomeMessage = (term) => {
    if (!welcomeShown.current) {
      term.writeln("\r\nWelcome to the package installer.");
      term.writeln('Type "npm install <package-name>" to install packages.');
      term.write("\r\n$ ");
      welcomeShown.current = true;
    }
  };

  const handleInput = (term, data) => {
    const buffer = inputBuffer.current;

    if (data === "\x7f") {
      if (buffer.length > 0) {
        buffer.pop();
        term.write("\x1B[D \x1B[D");
      }
      return;
    }

    if (data === "\r") {
      handleEnter(term);
      return;
    }

    buffer.push(data);
    term.write(data);
  };

  useEffect(() => {
    if (!terminalRef.current || isInitialized || !showTerminal) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: darkMode ? "#1a1a1a" : "#ffffff",
        foreground: darkMode ? "#ffffff" : "#1a1a1a",
        cursor: darkMode ? "#ffffff" : "#1a1a1a",
      },
      cursorStyle: "block",
      allowProposedApi: true,
      rows: 20,
    });

    terminalInstance.current = term;
    term.loadAddon(fitAddon.current);

    const initTerminal = () => {
      try {
        term.open(terminalRef.current);
        showWelcomeMessage(term);
        fitAddon.current.fit();
        term.focus();
        setIsInitialized(true);
      } catch (error) {
        console.error("Terminal initialization error:", error);
      }
    };

    const timeoutId = setTimeout(initTerminal, 100);

    term.onData((data) => handleInput(term, data));

    return () => {
      clearTimeout(timeoutId);
      term.dispose();
      welcomeShown.current = false;
      setIsInitialized(false);
    };
  }, [showTerminal]);

  useEffect(() => {
    if (!terminalInstance.current) return;

    terminalInstance.current.options.theme = {
      background: darkMode ? "#1a1a1a" : "#ffffff",
      foreground: darkMode ? "#ffffff" : "#1a1a1a",
      cursor: darkMode ? "#ffffff" : "#1a1a1a",
    };

    requestAnimationFrame(() => {
      try {
        showWelcomeMessage(terminalInstance.current);
        fitAddon.current.fit();
      } catch (error) {
        console.error("Terminal refresh error:", error);
      }
    });
  }, [darkMode]);

  const handleEnter = (term) => {
    try {
      const command = inputBuffer.current.join("").trim();
      inputBuffer.current = [];

      if (command.startsWith("npm install")) {
        const packages = command.split(" ").slice(2);
        onCommand(packages);
        term.write("\r\n Package Installed.");
      } else {
        term.write("\r\nUnknown command");
      }

      term.write("\r\n$ ");
    } catch (error) {
      console.error("Command handling error:", error);
      toast.error("Could not process command");
      term.write("\r\nError: Could not process command");
    }
  };

  return (
    <div>
      {!showTerminal ? (
        <div className="h-48 mt-1">
          <button
            onClick={() => setShowTerminal(true)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none transition-all flex items-center gap-3 group relative overflow-hidden">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-mono text-sm">Launch Terminal</span>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-cyan-500/50 animate-progress" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowTerminal(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-500/20 transition-colors z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500 hover:text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            ref={terminalRef}
            className={`h-48 relative p-4 ${
              darkMode ? "bg-gray-900" : "bg-white border border-gray-200"
            }`}
            style={{
              minHeight: "12rem",
              width: "100%",
              overflow: "hidden",
            }}
          />
        </div>
      )}
    </div>
  );
}
