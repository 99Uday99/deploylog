import React from 'react';
import Link from 'next/link';

export interface Deployment {
  id: string;
  projectName: string;
  status: string;
  branch: string;
  commitHash: string;
  commitMessage: string | null;
  createdAt: string;
}

export function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const statusColors: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-800 border-gray-200',
    running: 'bg-blue-100 text-blue-800 border-blue-200',
    linting: 'bg-purple-100 text-purple-800 border-purple-200',
    testing: 'bg-orange-100 text-orange-800 border-orange-200',
    building: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:scale-[1.01] cursor-default">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">
            {deployment.projectName}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase border ${statusColors[deployment.status] || 'bg-gray-100 text-gray-600'}`}
          >
            {deployment.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <span>
            Branch:{' '}
            <span className="font-mono text-gray-700">{deployment.branch}</span>
          </span>
          <span>•</span>
          <span>
            Commit:{' '}
            <span className="font-mono text-gray-700 font-bold">
              {deployment.commitHash.slice(0, 7)}
            </span>
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(deployment.createdAt).toLocaleString()}
          {deployment.commitMessage && (
            <span className="ml-2 italic opacity-75">
              - {deployment.commitMessage}
            </span>
          )}
        </p>
      </div>
      {/^\d+$/.test(deployment.id) && (
        <div className="flex flex-col gap-2 ml-4">
          <a
            href={`https://github.com/Jay061205/deploylog/actions/runs/${deployment.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-white hover:text-blue-600 transition-colors text-center"
          >
            View Logs ↗
          </a>
          <Link
            href="/visualmode"
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Visual Mode
          </Link>
        </div>
      )}
    </div>
  );
}
