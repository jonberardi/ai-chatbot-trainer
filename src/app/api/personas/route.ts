import { NextRequest, NextResponse } from 'next/server';
import {
  getPersonas,
  createPersona,
  getPersonaById,
  updatePersona,
  deletePersona
} from '../../../lib/persona-service';

// Helper to safely extract Cloudflare DB binding
const getDB = (request: NextRequest) => (request as any).cf.env.DB;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const db = getDB(request);

    if (id) {
      const persona = await getPersonaById(db, parseInt(id));
      return NextResponse.json({ success: true, data: persona });
    } else {
      const personas = await getPersonas(db);
      return NextResponse.json({ success: true, data: personas });
    }
  } catch (error) {
    console.error('Error in personas API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch personas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDB(request);
    const personaData = await request.json();

    const result = await createPersona(db, personaData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating persona:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create persona' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = getDB(request);
    const body = await request.json() as { id: number } & Record<string, any>;
    const { id, ...personaData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Persona ID is required' },
        { status: 400 }
      );
    }

    const result = await updatePersona(db, id, personaData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update persona' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Persona ID is required' },
      { status: 400 }
    );
  }

  try {
    const db = getDB(request);
    const result = await deletePersona(db, parseInt(id));

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting persona:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete persona' },
      { status: 500 }
    );
  }
}