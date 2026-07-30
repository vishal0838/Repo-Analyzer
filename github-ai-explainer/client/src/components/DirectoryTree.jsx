// client/src/components/DirectoryTree.jsx

// ... keep your existing TreeNode and parseTreeData functions ...

export const DirectoryTreeModal = ({ isOpen, onClose, rawStructure }) => {
  if (!isOpen) return null;

  const treeData = parseTreeData(rawStructure);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-700">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h3 className="font-semibold text-indigo-400 text-lg">Directory Tree Structure</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold p-1 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-sm bg-gray-950">
          {Object.keys(treeData).length > 0 ? (
            Object.entries(treeData).map(([name, node]) => (
              <TreeNode key={name} name={name} node={node} />
            ))
          ) : (
            <p className="text-gray-500 italic">No directory structure available.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-700 bg-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default DirectoryTreeModal; // 👈 Guarantees both named and default imports work!