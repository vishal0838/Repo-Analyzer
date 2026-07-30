import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 py-8 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center space-y-2">
        <h3 className="text-lg font-bold text-white tracking-wide">
          GitHub AI Explainer
        </h3>
        
        <p className="text-sm text-gray-400">
          Built with <span className="text-indigo-400 font-medium">React</span> +{" "}
          <span className="text-indigo-400 font-medium">Express</span> +{" "}
          <span className="text-indigo-400 font-medium">Gemini</span>
        </p>

        <p className="text-xs text-gray-500 pt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;