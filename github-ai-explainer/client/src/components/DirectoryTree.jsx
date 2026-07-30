import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";

const parseTreeData = (rawStructure) => {
  if (rawStructure && typeof rawStructure === "object" && !Array.isArray(rawStructure)) {
    return rawStructure;
  }

  if (typeof rawStructure !== "string") return {};

  return rawStructure
    .split("\n")
    .map((line) => line.replace(/^[├└│─\s*-]+/, "").trim())
    .filter(Boolean)
    .reduce((root, path) => {
      const parts = path.split("/").filter(Boolean);
      let current = root;

      parts.forEach((part, index) => {
        const isLastPart = index === parts.length - 1;
        if (isLastPart) {
          current[part] = path.endsWith("/") ? current[part] || {} : null;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });

      return root;
    }, {});
};

const TreeNode = ({ name, node, depth = 0 }) => {
  const isFolder = node !== null && typeof node === "object";
  const [isOpen, setIsOpen] = useState(depth < 2);

  return (
    <div style={{ paddingLeft: `${depth * 16}px` }}>
      <button type="button" onClick={() => isFolder && setIsOpen((open) => !open)} className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono text-sm hover:bg-gray-800 ${isFolder ? "cursor-pointer text-indigo-200" : "cursor-default text-gray-300"}`}>
        {isFolder ? <>{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}{isOpen ? <FolderOpen size={16} className="text-amber-400" /> : <Folder size={16} className="text-amber-400" />}</> : <><span className="w-4" /><FileText size={16} className="text-gray-500" /></>}
        <span>{name}</span>
      </button>
      {isFolder && isOpen && <div className="ml-3 border-l border-gray-800">{Object.entries(node).map(([childName, childNode]) => <TreeNode key={childName} name={childName} node={childNode} depth={depth + 1} />)}</div>}
    </div>
  );
};

export const DirectoryTreeModal = ({ isOpen, onClose, rawStructure }) => {
  if (!isOpen) return null;

  const treeData = parseTreeData(rawStructure);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="directory-tree-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-4">
          <div className="flex items-center gap-2"><Folder size={20} className="text-indigo-400" /><h3 id="directory-tree-title" className="text-lg font-semibold text-indigo-400">Directory Tree Structure</h3></div>
          <button type="button" aria-label="Close directory tree" onClick={onClose} className="p-1 text-2xl leading-none text-gray-400 hover:text-white">×</button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
          {Object.keys(treeData).length > 0 ? Object.entries(treeData).map(([name, node]) => <TreeNode key={name} name={name} node={node} />) : <p className="italic text-gray-500">No directory structure is available for this repository.</p>}
        </div>
        <div className="flex justify-end border-t border-gray-700 bg-gray-900 px-6 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">Close</button></div>
      </div>
    </div>
  );
};

export default DirectoryTreeModal;
