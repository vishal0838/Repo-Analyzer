// client/src/components/Hero.jsx
import { useState } from "react";
import RepoCard from "./Repocard";
import { Search, Loader2, AlertCircle } from "lucide-react";

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoData, setRepoData] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError("");
    setRepoData(null);

    try {
      const response = await fetch("http://localhost:3000/api/repository/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: repoUrl }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to analyze repository.");
      }

      console.log("🔍 FULL BACKEND RESPONSE:", result);
      console.log("📦 PARSED REPO DATA:", result.data);

      // Force a fresh object reference so React triggers a clean re-render
      setRepoData({ ...result.data });
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message || "Something went wrong. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start pt-20 px-4 pb-16">
      
      {/* Hero Header */}
      <div className="max-w-3xl text-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          GitHub Codebase AI Analyzer
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          Understand any GitHub Repository structure and codebase instantly with AI.
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleAnalyze}
        className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3 bg-gray-900/80 border border-gray-800 p-2 rounded-2xl shadow-2xl backdrop-blur-md"
      >
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 text-gray-500" size={20} />
          <input
            type="url"
            required
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full bg-transparent pl-12 pr-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 max-w-2xl w-full bg-red-950/60 border border-red-800/80 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="text-red-400 shrink-0" size={18} />
          <p>{error}</p>
        </div>
      )}

      {/* Repository Output Card */}
      {repoData && (
        <div className="mt-8 w-full flex justify-center">
          <RepoCard repo={repoData} />
        </div>
      )}

    </section>
  );
}
