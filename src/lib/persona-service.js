import { Persona, EvaluationCriterion, ApiResponse } from './types';

/**
 * Get all personas
 * @param {D1Database} db - D1 database instance
 * @returns {Promise<Persona[]>} - Array of personas
 */
export async function getPersonas(db) {
  try {
    const personas = await db.prepare('SELECT * FROM personas ORDER BY name').all();
    return personas.results;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw new Error('Failed to fetch personas');
  }
}

/**
 * Get a persona by ID
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Persona ID
 * @returns {Promise<Persona>} - Persona object
 */
export async function getPersonaById(db, id) {
  try {
    const persona = await db.prepare('SELECT * FROM personas WHERE id = ?').bind(id).first();
    if (!persona) {
      throw new Error('Persona not found');
    }
    return persona;
  } catch (error) {
    console.error(`Error fetching persona ${id}:`, error);
    throw new Error('Failed to fetch persona');
  }
}

/**
 * Create a new persona
 * @param {D1Database} db - D1 database instance
 * @param {Partial<Persona>} personaData - Persona data
 * @returns {Promise<ApiResponse<Persona>>} - API response with created persona
 */
export async function createPersona(db, personaData) {
  try {
    const { name, background, expertise, personality, avatar_url, conversation_style, knowledge_domains, difficulty_level } = personaData;
    
    const result = await db.prepare(`
      INSERT INTO personas (name, background, expertise, personality, avatar_url, conversation_style, knowledge_domains, difficulty_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name,
      background,
      expertise,
      personality,
      avatar_url || null,
      conversation_style,
      knowledge_domains,
      difficulty_level
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to create persona');
    }
    
    const newPersona = await getPersonaById(db, result.meta.last_row_id);
    
    return {
      success: true,
      data: newPersona
    };
  } catch (error) {
    console.error('Error creating persona:', error);
    return {
      success: false,
      error: 'Failed to create persona'
    };
  }
}

/**
 * Update an existing persona
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Persona ID
 * @param {Partial<Persona>} personaData - Updated persona data
 * @returns {Promise<ApiResponse<Persona>>} - API response with updated persona
 */
export async function updatePersona(db, id, personaData) {
  try {
    // First check if persona exists
    const existingPersona = await getPersonaById(db, id);
    
    const { name, background, expertise, personality, avatar_url, conversation_style, knowledge_domains, difficulty_level } = personaData;
    
    const result = await db.prepare(`
      UPDATE personas
      SET name = ?, background = ?, expertise = ?, personality = ?, 
          avatar_url = ?, conversation_style = ?, knowledge_domains = ?, 
          difficulty_level = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name || existingPersona.name,
      background || existingPersona.background,
      expertise || existingPersona.expertise,
      personality || existingPersona.personality,
      avatar_url !== undefined ? avatar_url : existingPersona.avatar_url,
      conversation_style || existingPersona.conversation_style,
      knowledge_domains || existingPersona.knowledge_domains,
      difficulty_level || existingPersona.difficulty_level,
      id
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to update persona');
    }
    
    const updatedPersona = await getPersonaById(db, id);
    
    return {
      success: true,
      data: updatedPersona
    };
  } catch (error) {
    console.error(`Error updating persona ${id}:`, error);
    return {
      success: false,
      error: 'Failed to update persona'
    };
  }
}

/**
 * Delete a persona
 * @param {D1Database} db - D1 database instance
 * @param {number} id - Persona ID
 * @returns {Promise<ApiResponse<{ id: number }>>} - API response with deleted persona ID
 */
export async function deletePersona(db, id) {
  try {
    // First check if persona exists
    await getPersonaById(db, id);
    
    const result = await db.prepare('DELETE FROM personas WHERE id = ?').bind(id).run();
    
    if (!result.success) {
      throw new Error('Failed to delete persona');
    }
    
    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    console.error(`Error deleting persona ${id}:`, error);
    return {
      success: false,
      error: 'Failed to delete persona'
    };
  }
}

/**
 * Get evaluation criteria for a persona
 * @param {D1Database} db - D1 database instance
 * @param {number} personaId - Persona ID
 * @returns {Promise<EvaluationCriterion[]>} - Array of evaluation criteria
 */
export async function getPersonaCriteria(db, personaId) {
  try {
    const criteria = await db.prepare('SELECT * FROM evaluation_criteria WHERE persona_id = ? ORDER BY weight DESC').bind(personaId).all();
    return criteria.results;
  } catch (error) {
    console.error(`Error fetching criteria for persona ${personaId}:`, error);
    throw new Error('Failed to fetch evaluation criteria');
  }
}
