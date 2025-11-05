import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        text: text.trim(),
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ 
      error: 'Failed to create todo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


