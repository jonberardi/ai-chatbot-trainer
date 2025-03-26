import { D1Database } from '@cloudflare/workers-types';
import { EvaluationCriterion } from './types';

/**
 * Get all evaluation criteria.
 */
export async function getAllCriteria(db: D1Database): Promise<EvaluationCriterion[]> {
  const { results } = await db
    .prepare('SELECT * FROM evaluation_criteria ORDER BY persona_id, weight DESC')
    .all();

  return (results || []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    weight: Number(row.weight),
    persona_id: Number(row.persona_id),
    created_at: String(row.created_at),
  }));
}

/**
 * Get a criterion by ID.
 */
export async function getCriterionById(
  db: D1Database,
  id: number
): Promise<EvaluationCriterion | null> {
  const row = await db
    .prepare('SELECT * FROM evaluation_criteria WHERE id = ?')
    .bind(id)
    .first();

  if (!row) return null;

  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    weight: Number(row.weight),
    persona_id: Number(row.persona_id),
    created_at: String(row.created_at),
  };
}

/**
 * Get criteria by persona ID.
 */
export async function getCriteriaByPersonaId(
  db: D1Database,
  personaId: number
): Promise<EvaluationCriterion[]> {
  const { results } = await db
    .prepare('SELECT * FROM evaluation_criteria WHERE persona_id = ? ORDER BY weight DESC')
    .bind(personaId)
    .all();

  return (results || []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    weight: Number(row.weight),
    persona_id: Number(row.persona_id),
    created_at: String(row.created_at),
  }));
}

/**
 * Create a new criterion.
 */
export async function createCriterion(
  db: D1Database,
  criterionData: Partial<EvaluationCriterion>
): Promise<{ success: boolean; error?: string }> {
  const { name, description, weight, persona_id } = criterionData;

  if (!name || !description || weight === undefined || !persona_id) {
    return { success: false, error: 'Missing required fields' };
  }

  await db
    .prepare(
      'INSERT INTO evaluation_criteria (name, description, weight, persona_id) VALUES (?, ?, ?, ?)'
    )
    .bind(name, description, weight, persona_id)
    .run();

  return { success: true };
}

/**
 * Update an existing criterion.
 */
export async function updateCriterion(
  db: D1Database,
  id: number,
  criterionData: Partial<EvaluationCriterion>
): Promise<{ success: boolean }> {
  const { name, description, weight } = criterionData;

  await db
    .prepare(
      'UPDATE evaluation_criteria SET name = ?, description = ?, weight = ? WHERE id = ?'
    )
    .bind(name, description, weight, id)
    .run();

  return { success: true };
}

/**
 * Delete a criterion by ID.
 */
export async function deleteCriterion(
  db: D1Database,
  id: number
): Promise<{ success: boolean }> {
  await db
    .prepare('DELETE FROM evaluation_criteria WHERE id = ?')
    .bind(id)
    .run();

  return { success: true };
}