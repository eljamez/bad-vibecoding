import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch top scores
export async function GET() {
  try {
    const topScores = await prisma.snakeScore.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 10,
    });
    
    return NextResponse.json(topScores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

// POST - Submit a new score
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, score } = body;

    if (!playerName || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data: playerName and score are required' },
        { status: 400 }
      );
    }

    const newScore = await prisma.snakeScore.create({
      data: {
        playerName,
        score,
      },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}

