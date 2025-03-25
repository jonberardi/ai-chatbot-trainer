'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const studentTrainingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

const StudentTrainingSession = ({ persona, criteria, onStartSession }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentTrainingSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const processSubmit = (data) => {
    onStartSession(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Start Training Session</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{persona?.name || 'AI Persona'}</h3>
        <p className="text-gray-700 mb-2">{persona?.background || 'Background information not available'}</p>
        <p className="text-gray-700 mb-4">Expertise: {persona?.expertise || 'Not specified'}</p>
        
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Evaluation Criteria:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {criteria && criteria.length > 0 ? (
              criteria.map((criterion) => (
                <li key={criterion.id} className="text-gray-700">
                  <span className="font-medium">{criterion.name}</span>
                  {criterion.description && (
                    <span className="text-gray-600"> - {criterion.description}</span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No evaluation criteria defined</li>
            )}
          </ul>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
            <span className="ml-1 text-xs text-gray-500">For tracking your progress</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email (optional)"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !persona || !criteria || criteria.length === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Starting...' : 'Start Training Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentTrainingSession;
