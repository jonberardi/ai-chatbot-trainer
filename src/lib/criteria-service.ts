import { EvaluationCriterion, ApiResponse } from './types';

/**
 * Get all evaluation criteria
 * @param {D1Database} db - D1 database instance
 * @returns {Promise<EvaluationCriterion[]>} - Array of evaluation criteria
 */
export async function getAllCriteria(db) {
  try {
    const criteria = await db.prepare('SELECT * FROM evaluation_criteria ORDER BY persona_id, weight DESC').all();
    return criteria.results;
  } catch (error) {
    console.error('Error fetching all criteria:', error);
    throw new Error('Failed to fetch evaluation criteria');
  }
}

/**
 * Get evaluation criteria by ID
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Criterion ID
 * @returns {Promise<EvaluationCriterion>} - Evaluation criterion
 */
export async function getCriterionById(db, id) {
  try {
    const criterion = await db.prepare('SELECT * FROM evaluation_criteria WHERE id = ?').bind(id).first();
    if (!criterion) {
      throw new Error('Evaluation criterion not found');
    }
    return criterion;
  } catch (error) {
    console.error(`Error fetching criterion ${id}:`, error);
    throw new Error('Failed to fetch evaluation criterion');
  }
}

/**
 * Get evaluation criteria for a persona
 * @param {D1Database} db - D1 database instance
 * @param {number} personaId - Persona ID
 * @returns {Promise<EvaluationCriterion[]>} - Array of evaluation criteria
 */
export async function getCriteriaByPersonaId(db, personaId) {
  try {
    const criteria = await db.prepare('SELECT * FROM evaluation_criteria WHERE persona_id = ? ORDER BY weight DESC').bind(personaId).all();
    return criteria.results;
  } catch (error) {
    console.error(`Error fetching criteria for persona ${personaId}:`, error);
    throw new Error('Failed to fetch evaluation criteria');
  }
}

/**
 * Create a new evaluation criterion
 * @param {D1Database} db - D1 database instance
 * @param {Partial<EvaluationCriterion>} criterionData - Criterion data
 * @returns {Promise<ApiResponse<EvaluationCriterion>>} - API response with created criterion
 */
export async function createCriterion(db, criterionData) {
  try {
    const { name, description, weight, persona_id } = criterionData;
    
    const result = await db.prepare(`
      INSERT INTO evaluation_criteria (name, description, weight, persona_id)
      VALUES (?, ?, ?, ?)
    `).bind(
      name,
      description,
      weight,
      persona_id
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to create evaluation criterion');
    }
    
    const newCriterion = await getCriterionById(db, result.meta.last_row_id);
    
    return {
      success: true,
      data: newCriterion
    };
  } catch (error) {
    console.error('Error creating evaluation criterion:', error);
    return {
      success: false,
      error: 'Failed to create evaluation criterion'
    };
  }
}

/**
 * Update an existing evaluation criterion
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Criterion ID
 * @param {Partial<EvaluationCriterion>} criterionData - Updated criterion data
 * @returns {Promise<ApiResponse<EvaluationCriterion>>} - API response with updated criterion
 */
export async function updateCriterion(db, id, criterionData) {
  try {
    // First check if criterion exists
    const existingCriterion = await getCriterionById(db, id);
    
    const { name, description, weight } = criterionData;
    
    const result = await db.prepare(`
      UPDATE evaluation_criteria
      SET name = ?, description = ?, weight = ?
      WHERE id = ?
    `).bind(
      name || existingCriterion.name,
      description || existingCriterion.description,
      weight !== undefined ? weight : existingCriterion.weight,
      id
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to update evaluation criterion');
    }
    
    const updatedCriterion = await getCriterionById(db, id);
    
    return {
      success: true,
      data: updatedCriterion
    };
  } catch (error) {
    console.error(`Error updating criterion ${id}:`, error);
    return {
      success: false,
      error: 'Failed to update evaluation criterion'
    };
  }
}

/**
 * Delete an evaluation criterion
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Criterion ID
 * @returns {Promise<ApiResponse<{ id: number }>>} - API response with deleted criterion ID
 */
export async function deleteCriterion(db, id) {
  try {
    // First check if criterion exists
    await getCriterionById(db, id);
    
    const result = await db.prepare('DELETE FROM evaluation_criteria WHERE id = ?').bind(id).run();
    
    if (!result.success) {
      throw new Error('Failed to delete evaluation criterion');
    }
    
    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    console.error(`Error deleting criterion ${id}:`, error);
    return {
      success: false,
      error: 'Failed to delete evaluation criterion'
    };
  }
}
