'use client';

import { useState, useEffect } from 'react';
import { DeploymentCard, Deployment } from './components/DeploymentCard';
import Link from 'next/link';

export default function Home() {
  // Define state with the correct Deployment[] type
  // Define state with the correct Deployment[] type
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        // 1. Trigger Sync
        await fetch('/api/deployments/sync');

        // 2. Fetch Local Data
        const response = await fetch('/api/deployments');
        if (response.ok) {
          const data = await response.json();
          setDeployments(data);
        }
      } catch (error) {
        console.error('Failed to fetch deployments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
    // Poll every 5 seconds
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900 tracking-tight cursor-pointer hover:text-gray-700 transition-colors"
              onClick={() => window.location.reload()}
              title="Refresh Dashboard"
            >
              DeployLog
            </h1>
            <p className="text-gray-500 mt-1 hover:text-gray-800 transition-colors duration-200 cursor-default w-fit">
              Live Deployment Feeds
            </p>
          </div>
          <Link
            href="/about"
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm active:scale-95 transition-all duration-200"
          >
            About
          </Link>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : deployments.length > 0 ? (
            // FIX: Removed ': any'. TypeScript infers 'd' is 'Deployment' automatically.
            deployments.map((d) => <DeploymentCard key={d.id} deployment={d} />)
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No deployments found.</p>
              <p className="text-sm text-gray-400 mt-1">
                Trigger one to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
