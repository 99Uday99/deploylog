'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VisualModePage() {
  const [activeTab, setActiveTab] = useState('Pipeline graph');

  const tabs = ['Pipeline graph', 'AI Mode'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 p-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      </Link>

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
          {activeTab === 'Pipeline graph' &&
            'Visual graph representation of the pipeline.'}
          {activeTab === 'AI Mode' && 'AI-powered insights and analysis.'}
        </p>
      </div>
    </div>
  );
}
