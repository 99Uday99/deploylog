"use client";

import { useState, useEffect } from 'react';
import { DeploymentCard, Deployment } from './components/DeploymentCard';

export default function Home() {
  // Define state with the correct Deployment[] type
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/deployments');
      if (response.ok) {
        const data = await response.json();
        setDeployments(data);
      }
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
    }
  };

  useEffect(() => {
    fetchDeployments();
    // Poll every 3 seconds
    const interval = setInterval(fetchDeployments, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerDeployment = async () => {
    setLoading(true);
    try {
      await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: 'main',
          commitMessage: `Triggered from UI at ${new Date().toLocaleTimeString()}`
        })
      });
      fetchDeployments();
    } catch (error) {
      console.error('Failed to trigger deployment', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">DeployLog</h1>
            <p className="text-gray-500 mt-1">Live Deployment Feeds</p>
          </div>
          <button
            onClick={triggerDeployment}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm
              ${loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'
              }`}
          >
            {loading ? 'Starting...' : 'New Deployment'}
          </button>
        </header>

        <div className="space-y-4">
          {deployments.length > 0 ? (
            // FIX: Removed ': any'. TypeScript infers 'd' is 'Deployment' automatically.
            deployments.map((d) => (
              <DeploymentCard key={d.id} deployment={d} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No deployments found.</p>
              <p className="text-sm text-gray-400 mt-1">Trigger one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
