'use client';

import React from 'react';
import Link from 'next/link';

const DashboardLayout = ({ children, activeTab }) => {
  const tabs = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'Personas', href: '/dashboard/personas' },
    { name: 'Evaluation Criteria', href: '/dashboard/criteria' },
    { name: 'Training Sessions', href: '/dashboard/sessions' },
    { name: 'Reports', href: '/dashboard/reports' },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.name.toLowerCase()
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
