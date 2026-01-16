'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VisualModePage() {
  const [activeTab, setActiveTab] = useState('Stageview');

  const tabs = ['Stageview', 'Pipeline graph', 'AI Mode'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10">
      {/* Toggle Tab */}
      <div className="bg-gray-200 p-1 rounded-full flex relative">
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

      {/* Content Area */}
      <div className="flex-1 w-full max-w-4xl p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
        <p className="text-gray-600 mb-8">
          {activeTab === 'Stageview' &&
            'Detailed breakdown of deployment stages goes here.'}
          {activeTab === 'Pipeline graph' &&
            'Visual graph representation of the pipeline.'}
          {activeTab === 'AI Mode' && 'AI-powered insights and analysis.'}
        </p>

        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
