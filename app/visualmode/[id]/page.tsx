'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Deployment {
  id: string;
  projectName: string;
  status: string;
  branch: string;
  commitHash: string;
  logs: string | null;
}

export default function VisualModePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('Pipeline graph');
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = ['Pipeline graph', 'AI Mode'];

  // Fetch deployment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/deployments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDeployment(data);
        }
      } catch (error) {
        console.error('Error fetching deployment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll for updates
    return () => clearInterval(interval);
  }, [id]);

  // Helper to determine stage state
  const getStageState = (stage: string, currentStatus: string) => {
    const order = ['queued', 'linting', 'testing', 'building', 'success'];
    const stageMap: Record<string, string> = {
      Start: 'queued',
      Lint: 'linting',
      Test: 'testing',
      Build: 'building',
      End: 'success',
    };

    const targetStatus = stageMap[stage];
    const currentIndex = order.indexOf(currentStatus);
    const targetIndex = order.indexOf(targetStatus);

    if (currentStatus === 'failed') {
      // Intelligent failure detection
      let failedStage = 'Build'; // Default to late failure
      const logs = deployment?.logs || '';

      if (logs.includes('Linting: Failed') || logs.includes('Lint: Failed')) failedStage = 'Lint';
      else if (logs.includes('Tests: Failed') || logs.includes('Testing: Failed')) failedStage = 'Test';
      else if (logs.includes('Build: Failed') || logs.includes('Docker: Failed')) failedStage = 'Build';

      const outputIndex = order.indexOf(stageMap[stage]);
      const failedIndex = order.indexOf(stageMap[failedStage]);

      // If this is the failed stage
      if (stage === failedStage) return 'failed';
      // If this stage comes BEFORE the failure, it passed
      if (outputIndex < failedIndex) return 'completed';
      // If it comes AFTER, it was skipped (pending)
      return 'pending';
    }

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'active';
    return 'pending';
  };

  const stages = ['Start', 'Lint', 'Test', 'Build', 'End'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 p-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      {/* Header Info */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Visual Mode <span className="text-gray-400">#{id.slice(0, 8)}</span>
        </h1>
        {deployment && (
          <p className="text-gray-500 mt-2">
            Status: <span className="font-semibold uppercase">{deployment.status}</span>
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-gray-200 p-1 rounded-full flex relative mb-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
                relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10
                ${activeTab === tab ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                transition={{ type: 'spring', duration: 0.5 }}
                style={{ zIndex: -1 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl px-4">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : !deployment ? (
          <div className="text-center p-20 text-gray-500">Deployment not found.</div>
        ) : activeTab === 'Pipeline graph' ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 overflow-x-auto">
            {/* Graph Container */}
            <div className="flex items-center justify-between min-w-[600px] relative">
              {/* Connecting Line (Background) */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 -translate-y-1/2 rounded-full" />

              {stages.map((stage, index) => {
                const state = getStageState(stage, deployment.status);
                let colorClass = 'bg-gray-100 border-gray-300 text-gray-400'; // Pending
                let icon = <div className="w-3 h-3 bg-gray-300 rounded-full" />;

                if (state === 'completed') {
                  colorClass = 'bg-green-100 border-green-500 text-green-600';
                  icon = (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  );
                } else if (state === 'active') {
                  colorClass = 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse';
                  icon = (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  );
                } else if (state === 'failed') {
                  // Logic to check if this specific node failed would go here.
                  // For now, if global status is failed, mark non-completed as potentially failed or gray
                  if (deployment.status === 'failed') {
                    colorClass = 'bg-red-50 border-red-500 text-red-500';
                    icon = <span className="font-bold">!</span>;
                  }
                }

                // Override for 'End' node
                if (stage === 'End' && (deployment.status === 'failed')) {
                  colorClass = 'bg-red-100 border-red-500 text-red-600';
                  icon = (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  );
                }


                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${colorClass} shadow-sm`}
                    >
                      {icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${state === 'pending' ? 'text-gray-400' : 'text-gray-700'
                        }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Logs Preview */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="font-mono text-sm uppercase text-gray-500 mb-4">Pipeline Logs</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 overflow-y-auto whitespace-pre-wrap">
                {deployment.logs || '// No logs available...'}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center text-gray-500">
            <p>AI Insights module coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
