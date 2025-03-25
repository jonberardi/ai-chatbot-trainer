'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreCard = ({ score, criteria, evaluations }) => {
  // Calculate scores for each criterion
  const criteriaScores = criteria.map(criterion => {
    const criterionEvals = evaluations.filter(evaluation => evaluation.criteria_id === criterion.id);
    if (criterionEvals.length === 0) return 0;
    return criterionEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / criterionEvals.length;
  });

  // Prepare chart data
  const chartData = {
    labels: criteria.map(c => c.name),
    datasets: [
      {
        data: criteriaScores,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
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
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw.toFixed(1);
            return `${label}: ${value}/5`;
          }
        }
      }
    },
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    if (score >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get score label based on value
  const getScoreLabel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Satisfactory';
    if (score >= 1.5) return 'Needs Improvement';
    return 'Unsatisfactory';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Performance Score</h2>
          <div className="mt-2">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xl text-gray-500">/5</span>
          </div>
          <div className={`mt-1 font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </div>
        </div>

        <div className="w-48 h-48">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Criteria Breakdown</h3>
        <div className="space-y-4">
          {criteria.map((criterion) => {
            const criterionEvals = evaluations.filter(evaluation => evaluation.criteria_id === criterion.id);
            const avgScore = criterionEvals.length > 0
              ? criterionEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / criterionEvals.length
              : 0;

            return (
              <div key={criterion.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{criterion.name}</h4>
                    <p className="text-sm text-gray-500">Weight: {criterion.weight.toFixed(1)}</p>
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(avgScore)}`}>
                    {avgScore.toFixed(1)}/5
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-indigo-600"
                    style={{ width: `${(avgScore / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;