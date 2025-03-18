import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { toast } from "react-toastify";
import SuggestionModal from "./SuggestionModal";

export default function CodeSuggestions({ code, setCode, darkMode }) {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const currentCode = code["/App.js"] || "";
      const prompt = `Analyze this React component and suggest improved version with:
      1. If the code using any package or libray then give suggestion align with that
      2. Modern React best practices
      3. Enhanced accessibility features
      4. Optimized component structure
      5. Advanced Tailwind CSS techniques
      6. improved UI/UX by doing necessary changes ,you may also chnage the content for the betterment of the UI/UX
      Return ONLY the updated code without explanations. Original code:
      ${currentCode}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedCode = text
        .replace(/^```(jsx|javascript|typescript)/gm, "")
        .replace(/```$/gm, "")
        .replace(/^${currentCode}$/gm, "")
        .trim();
      setSuggestion(cleanedCode);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gemini API error:", error);
      toast.error(
        "Failed to get suggestions. Check API key/model availability"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    setCode((prev) => ({ ...prev, "/App.js": suggestion }));
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={getSuggestions}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
        {isLoading ? "Generating..." : "Get AI Suggestions"}
      </button>

      {isModalOpen && (
        <SuggestionModal
          suggestion={suggestion}
          onApply={handleApply}
          onClose={() => setIsModalOpen(false)}
          darkMode={darkMode}
        />
      )}
    </>
  );
}
