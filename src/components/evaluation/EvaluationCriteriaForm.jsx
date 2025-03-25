'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const criteriaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  weight: z.coerce.number().min(0.1).max(5.0),
});

const EvaluationCriteriaForm = ({ onSubmit, personaId, initialData = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(criteriaSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      weight: 1.0,
    },
  });

  const processSubmit = (data) => {
    onSubmit({ ...data, persona_id: personaId });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Criterion' : 'Add Evaluation Criterion'}</h2>
      
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Technical Accuracy"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Correctness of technical information provided"
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (0.1-5.0)
            <span className="ml-1 text-xs text-gray-500">Higher values indicate greater importance</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="5.0"
            {...register('weight')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Criterion' : 'Add Criterion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationCriteriaForm;
