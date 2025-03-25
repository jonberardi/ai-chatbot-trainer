import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCriteria,
  getCriterionById,
  getCriteriaByPersonaId,
  createCriterion,
  updateCriterion,
  deleteCriterion
} from '../../../lib/criteria-service';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const personaId = searchParams.get('personaId');
  
  try {
    const db = request.cf.env.DB;
    
    if (id) {
      const criterion = await getCriterionById(db, parseInt(id));
      return NextResponse.json({ success: true, data: criterion });
    } else if (personaId) {
      const criteria = await getCriteriaByPersonaId(db, parseInt(personaId));
      return NextResponse.json({ success: true, data: criteria });
    } else {
      const criteria = await getAllCriteria(db);
      return NextResponse.json({ success: true, data: criteria });
    }
  } catch (error) {
    console.error('Error in criteria API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch criteria' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = request.cf.env.DB;
    const criterionData = await request.json();
    
    const result = await createCriterion(db, criterionData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating criterion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create criterion' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = request.cf.env.DB;
    const { id, ...criterionData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Criterion ID is required' },
        { status: 400 }
      );
    }
    
    const result = await updateCriterion(db, id, criterionData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating criterion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update criterion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Criterion ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const db = request.cf.env.DB;
    const result = await deleteCriterion(db, parseInt(id));
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting criterion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete criterion' },
      { status: 500 }
    );
  }
}
