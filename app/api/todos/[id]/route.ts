import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { completed, text } = body;
    const { id } = await params;

    const updateData: { completed?: boolean; text?: string } = {};
    if (typeof completed === 'boolean') {
      updateData.completed = completed;
    }
    if (typeof text === 'string' && text.trim() !== '') {
      updateData.text = text.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ 
      error: 'Failed to update todo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ 
      error: 'Failed to delete todo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


