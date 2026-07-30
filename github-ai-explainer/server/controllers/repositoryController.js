// server/controllers/repositoryController.js
const axios = require("axios");
const { generateRepoAnalysis } = require("../utils/aiHelper");

const analyzeRepository = async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl || req.body.url;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repository URL is required" });
    }

    const cleanUrl = repoUrl.trim().replace(/\/$/, "");
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!match) {
      return res.status(400).json({ error: "Invalid GitHub URL format." });
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    const headers = {
      "User-Agent": "GitHub-AI-Explainer-App",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      }),
    };

    // 1. Fetch Repository Metadata
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    const repoData = repoRes.data;
    const defaultBranch = repoData.default_branch || "main";

    // 2. Fetch README
    let readmeText = "";
    try {
      const readmeRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { ...headers, Accept: "application/vnd.github.raw+json" },
      });
      readmeText = typeof readmeRes.data === "string" ? readmeRes.data : JSON.stringify(readmeRes.data);
    } catch (e) {
      readmeText = "No README.md found.";
    }

    // 3. Fetch File Tree Structure
    let fileTreeText = "";
    try {
      const treeRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        { headers }
      );
      fileTreeText = treeRes.data.tree
        .map((item) => item.path)
        .slice(0, 100)
        .join("\n");
    } catch (e) {
      fileTreeText = "File tree could not be retrieved.";
    }

    // 4. Call AI Analysis Helper
    const aiAnalysis = await generateRepoAnalysis({
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      readme: readmeText,
      fileTree: fileTreeText,
    });

    // 5. Send Payload to Frontend
    return res.status(200).json({
      success: true,
      data: {
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        htmlUrl: repoData.html_url,
        aiAnalysis,
      },
    });
  } catch (error) {
    console.error("Backend Route Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to analyze repository." });
  }
};

module.exports = { analyzeRepository };