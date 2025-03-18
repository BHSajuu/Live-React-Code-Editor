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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const currentCode = code["/App.js"] || "";
      const prompt = `Analyze the following React component and provide an improved version with these enhancements:
                      1. Utilize existing imported packages/libraries to their full potential
                      2. Maintain and enhance current functionality rather than replacing it
                      3. Follow modern React best practices with proper component structure
                      4. Enhance accessibility features based on current implementation
                      5. Improve UI/UX using existing Tailwind CSS patterns
                      6. Add meaningful code comments where appropriate
                      7. Keep all existing functionality but implement it better

                      Return ONLY the updated code without any explanations.
                      Current code:
                      ${currentCode}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedCode = text
        .replace(/^```(jsx|javascript|typescript)\n?/gm, "")
        .replace(/```$/gm, "")
        .trim();
      setSuggestion(cleanedCode);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gemini API error:", error);
      toast.error(
        "Failed to get suggestions. Check API key or model availability."
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
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
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
