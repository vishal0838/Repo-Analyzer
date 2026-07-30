import { useState } from "react";
import { DirectoryTreeModal } from "./DirectoryTree";
import { FolderTree, ExternalLink, Cpu, BookOpen, Layers, Star, GitFork } from "lucide-react";

export default function RepoCard({ repo }) {
  const [showTreeModal, setShowTreeModal] = useState(false);

  // Safeguard: If no repo object passed, don't crash
  if (!repo) return null;

  // Extract nested AI details safely
  const ai = repo.aiAnalysis || {};
  const repoLink = repo.htmlUrl || repo.html_url;

  return (
    <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl text-white space-y-6 text-left">
      
      {/* 1. Header & Badges */}
      <div className="border-b border-gray-700 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-2xl font-bold text-indigo-400 truncate">
            {repo.name || "Repository"}
          </h2>
          <div className="flex items-center gap-3 text-xs">
            {repo.language && (
              <span className="px-2.5 py-1 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-500/30 font-medium">
                {repo.language}
              </span>
            )}
            {repo.stars !== undefined && (
              <span className="flex items-center gap-1 text-yellow-400 font-medium">
                <Star size={14} /> {repo.stars}
              </span>
            )}
            {repo.forks !== undefined && (
              <span className="flex items-center gap-1 text-gray-400 font-medium">
                <GitFork size={14} /> {repo.forks}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300">
          {repo.description || "No description available."}
        </p>
      </div>

      {/* 2. AI Summary */}
      {ai.summary && (
        <div className="bg-gray-900/70 border border-gray-700/60 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2 mb-2">
            <BookOpen size={16} /> AI Summary
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {ai.summary}
          </p>
        </div>
      )}

      {/* 3. Tech Stack */}
      {Array.isArray(ai.techStack) && ai.techStack.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-indigo-400" /> Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {ai.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full border border-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Architecture Overview */}
      {ai.architectureOverview && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
            <Layers size={16} className="text-indigo-400" /> Architecture Overview
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/40 p-3 rounded-lg border border-gray-700/40">
            {ai.architectureOverview}
          </p>
        </div>
      )}

      {/* 5. Key Features */}
      {Array.isArray(ai.keyFeatures) && ai.keyFeatures.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Key Features</h3>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 bg-gray-900/40 p-3 rounded-lg border border-gray-700/40">
            {ai.keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Action Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={() => setShowTreeModal(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow cursor-pointer"
        >
          <FolderTree size={16} />
          <span>View Directory Tree</span>
        </button>

        {repoLink && (
          <a
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <span>GitHub</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Directory Tree Modal */}
      {DirectoryTreeModal && (
        <DirectoryTreeModal
          isOpen={showTreeModal}
          onClose={() => setShowTreeModal(false)}
          rawStructure={ai.directoryStructure || repo.directoryStructure}
        />
      )}
    </div>
  );
}
