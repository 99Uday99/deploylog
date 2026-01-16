import React from 'react';

type Stage = {
  id: string;
  name: string;
  status: string;
  startedAt: string;
  endedAt?: string;
};

type Deployment = {
  id: string;
  commitHash: string;
  stages: Stage[];
};

export function StageView({ deployments }: { deployments: Deployment[] }) {
  const stageNames = ['Lint', 'Test', 'Build'];

  const getDuration = (start: string, end?: string) => {
    if (!end) return 'Running...';
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    return `${Math.round(durationMs / 1000)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      case 'running':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Commit</th>
            {stageNames.map((name) => (
              <th key={name} className="px-6 py-3 text-center">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deployments.map((deployment) => (
            <tr key={deployment.id} className="bg-white border-b">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                #{deployment.commitHash.slice(0, 7)}
              </td>
              {stageNames.map((stageName) => {
                const stage = deployment.stages.find(
                  (s) => s.name === stageName
                );
                return (
                  <td key={stageName} className="p-2">
                    {stage ? (
                      <div
                        className={`p-4 rounded-lg border flex flex-col items-center justify-center ${getStatusColor(stage.status)}`}
                      >
                        <span className="font-bold text-gray-700">
                          {getDuration(stage.startedAt, stage.endedAt)}
                        </span>
                        {stage.status === 'failed' && (
                          <span className="text-xs text-red-600 font-bold mt-1">
                            Failed
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-gray-50 border border-transparent"></div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
