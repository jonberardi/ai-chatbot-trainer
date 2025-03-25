'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ criteria, evaluations, sessions = [] }) => {
  // Group evaluations by session
  const sessionEvaluations = sessions.map(session => {
    const sessionEvals = evaluations.filter(evaluation => evaluation.conversation_id === session.id);
    
    // Calculate average score for each criterion in this session
    const criteriaScores = criteria.map(criterion => {
      const criterionEvals = sessionEvals.filter(evaluation => evaluation.criteria_id === criterion.id);
      if (criterionEvals.length === 0) return 0;
      return criterionEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / criterionEvals.length;
    });
    
    return {
      sessionId: session.id,
      sessionTitle: session.title || `Session ${session.id}`,
      date: new Date(session.started_at),
      scores: criteriaScores,
    };
  });
  
  // Sort sessions by date
  sessionEvaluations.sort((a, b) => a.date - b.date);
  
  // Prepare chart data
  const chartData = {
    labels: criteria.map(c => c.name),
    datasets: sessionEvaluations.map((session, index) => ({
      label: session.sessionTitle,
      data: session.scores,
      backgroundColor: getColor(index, 0.6),
      borderColor: getColor(index, 1),
      borderWidth: 1,
    })),
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Score (0-5)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Performance by Criteria Across Sessions',
      },
    },
  };
  
  // Helper function to get colors for chart
  function getColor(index, alpha) {
    const colors = [
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
    ];
    
    return colors[index % colors.length];
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Performance Trends</h2>
      
      {sessionEvaluations.length > 0 ? (
        <div className="w-full h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>No performance data available yet.</p>
          <p className="text-sm mt-2">Complete more training sessions to see performance trends.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;