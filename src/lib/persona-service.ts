import { D1Database } from '@cloudflare/workers-types';
import { Persona } from './types';

export async function getPersonas(db: D1Database): Promise<Persona[]> {
  const { results } = await db.prepare('SELECT * FROM personas ORDER BY id DESC').all();

  return (results || []).map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    background: String(row.background),
    expertise: String(row.expertise),
    personality: String(row.personality),
    avatar_url: row.avatar_url ? String(row.avatar_url) : undefined,
    conversation_style: String(row.conversation_style),
    knowledge_domains: String(row.knowledge_domains),
    difficulty_level: String(row.difficulty_level),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}

export async function getPersonaById(db: D1Database, id: number): Promise<Persona | null> {
  const row = await db.prepare('SELECT * FROM personas WHERE id = ?').bind(id).first();

  if (!row) return null;

  return {
    id: Number(row.id),
    name: String(row.name),
    background: String(row.background),
    expertise: String(row.expertise),
    personality: String(row.personality),
    avatar_url: row.avatar_url ? String(row.avatar_url) : undefined,
    conversation_style: String(row.conversation_style),
    knowledge_domains: String(row.knowledge_domains),
    difficulty_level: String(row.difficulty_level),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function createPersona(db: D1Database, personaData: Partial<Persona>) {
  const {
    name,
    background,
    expertise,
    personality,
    avatar_url,
    conversation_style,
    knowledge_domains,
    difficulty_level
  } = personaData;

  if (!name || !background || !expertise || !personality || !conversation_style || !knowledge_domains || !difficulty_level) {
    return { success: false, error: 'Missing required fields' };
  }

  await db
    .prepare(
      'INSERT INTO personas (name, background, expertise, personality, avatar_url, conversation_style, knowledge_domains, difficulty_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(
      name,
      background,
      expertise,
      personality,
      avatar_url ?? null,
      conversation_style,
      knowledge_domains,
      difficulty_level
    )
    .run();

  return { success: true };
}

export async function updatePersona(db: D1Database, id: number, personaData: Partial<Persona>) {
  const {
    name,
    background,
    expertise,
    personality,
    avatar_url,
    conversation_style,
    knowledge_domains,
    difficulty_level
  } = personaData;

  await db
    .prepare(
      'UPDATE personas SET name = ?, background = ?, expertise = ?, personality = ?, avatar_url = ?, conversation_style = ?, knowledge_domains = ?, difficulty_level = ? WHERE id = ?'
    )
    .bind(
      name,
      background,
      expertise,
      personality,
      avatar_url ?? null,
      conversation_style,
      knowledge_domains,
      difficulty_level,
      id
    )
    .run();

  return { success: true };
}

export async function deletePersona(db: D1Database, id: number) {
  await db.prepare('DELETE FROM personas WHERE id = ?').bind(id).run();
  return { success: true };
}