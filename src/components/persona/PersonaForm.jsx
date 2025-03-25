'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const personaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  background: z.string().min(10, 'Background should be at least 10 characters'),
  expertise: z.string().min(10, 'Expertise should be at least 10 characters'),
  personality: z.string().min(5, 'Personality should be at least 5 characters'),
  conversation_style: z.string().min(5, 'Conversation style should be at least 5 characters'),
  knowledge_domains: z.string().min(5, 'Knowledge domains should be at least 5 characters'),
  difficulty_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  avatar_url: z.string().optional(),
});

const PersonaForm = ({ onSubmit, initialData = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personaSchema),
    defaultValues: initialData || {
      name: '',
      background: '',
      expertise: '',
      personality: '',
      conversation_style: '',
      knowledge_domains: '',
      difficulty_level: 'Intermediate',
      avatar_url: '',
    },
  });

  const processSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Persona' : 'Create New Persona'}</h2>
      
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Interview Coach"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <select
              {...register('difficulty_level')}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.difficulty_level && <p className="mt-1 text-sm text-red-600">{errors.difficulty_level.message}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <textarea
            {...register('background')}
            rows={3}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Experienced HR professional with 15 years in tech recruitment"
          ></textarea>
          {errors.background && <p className="mt-1 text-sm text-red-600">{errors.background.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
          <textarea
            {...register('expertise')}
            rows={3}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Technical interviews, behavioral questions, resume review"
          ></textarea>
          {errors.expertise && <p className="mt-1 text-sm text-red-600">{errors.expertise.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
            <input
              type="text"
              {...register('personality')}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Professional, supportive, analytical"
            />
            {errors.personality && <p className="mt-1 text-sm text-red-600">{errors.personality.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conversation Style</label>
            <input
              type="text"
              {...register('conversation_style')}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Formal with constructive feedback"
            />
            {errors.conversation_style && <p className="mt-1 text-sm text-red-600">{errors.conversation_style.message}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Domains</label>
          <input
            type="text"
            {...register('knowledge_domains')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Software engineering, data science, product management"
          />
          {errors.knowledge_domains && <p className="mt-1 text-sm text-red-600">{errors.knowledge_domains.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (Optional)</label>
          <input
            type="text"
            {...register('avatar_url')}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/avatar.png"
          />
          {errors.avatar_url && <p className="mt-1 text-sm text-red-600">{errors.avatar_url.message}</p>}
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Persona' : 'Create Persona'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonaForm;
