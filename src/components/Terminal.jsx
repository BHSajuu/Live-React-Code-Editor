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
    if (!terminalRef.current || isInitialized) return;

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
  }, []);

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
        term.write("\r\n Package Installed...");
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
  );
}
