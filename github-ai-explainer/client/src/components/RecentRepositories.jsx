import { useState, useEffect } from 'react';

export function RecentRepositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentRepos() {
      try {
        setLoading(true);
        // Replace with your actual API endpoint or custom hook (e.g., TanStack Query)
        const response = await fetch('/api/repositories/recent');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentRepos();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Recent Repositories
          </h2>
          <p className="text-sm text-muted-foreground">
            Projects you've worked on or visited recently.
          </p>
        </div>
        <a 
          href="/repositories" 
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-32 rounded-lg bg-muted/50 animate-pulse border border-border" 
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              No recent repositories found.
            </p>
          )}
        </div>
      )}
    </section>
  );
}