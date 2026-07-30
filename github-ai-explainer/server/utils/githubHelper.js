/**
 * Utility to extract owner and repo name from a GitHub URL.
 * Example inputs:
 * - https://github.com/facebook/react
 * - https://github.com/facebook/react.git
 */
const parseGitHubUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length < 2) {
      return null;
    }

    const owner = pathSegments[0];
    let repo = pathSegments[1];

    // Remove trailing .git if present
    if (repo.endsWith(".git")) {
      repo = repo.slice(0, -4);
    }

    return { owner, repo };
  } catch (error) {
    return null;
  }
};

module.exports = { parseGitHubUrl };