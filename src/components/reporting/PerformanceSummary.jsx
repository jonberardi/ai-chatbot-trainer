'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceSummary = ({ performance }) => {
  // Prepare chart data
  const chartData = {
    labels: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Unsatisfactory'],
    datasets: [
      {
        data: [
          performance.excellent || 0,
          performance.good || 0,
          performance.satisfactory || 0,
          performance.needsImprovement || 0,
          performance.unsatisfactory || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',  // green
          'rgba(59, 130, 246, 0.6)', // blue
          'rgba(234, 179, 8, 0.6)',  // yellow
          'rgba(249, 115, 22, 0.6)', // orange
          'rgba(239, 68, 68, 0.6)',  // red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Performance Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Overall Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Sessions</p>
                <p className="text-2xl font-bold">{performance.totalSessions || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold">{performance.averageScore ? performance.averageScore.toFixed(1) : '0.0'}/5</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Messages</p>
                <p className="text-2xl font-bold">{performance.totalMessages || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Improvement</p>
                <p className="text-2xl font-bold">
                  {performance.improvement > 0 ? '+' : ''}
                  {performance.improvement ? performance.improvement.toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Strengths</h3>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <ul className="list-disc pl-5 space-y-1">
                {performance.strengths && performance.strengths.length > 0 ? (
                  performance.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700">{strength}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No strengths identified yet</li>
                )}
              </ul>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {performance.areasForImprovement && performance.areasForImprovement.length > 0 ? (
                  performance.areasForImprovement.map((area, index) => (
                    <li key={index} className="text-gray-700">{area}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No areas for improvement identified yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {performance.recommendations && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{performance.recommendations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;
