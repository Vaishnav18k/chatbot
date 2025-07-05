
// app/api/habits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    let habits;
    if (date) {
      habits = await convex.query(api.habits.getHabitsByDate, { date });
    } else {
      habits = await convex.query(api.habits.getTodayHabits);
    }
    
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { habitName, timestamp } = await req.json();
    
    if (!habitName || !timestamp) {
      return NextResponse.json(
        { error: 'habitName and timestamp are required' },
        { status: 400 }
      );
    }
    
    const habitId = await convex.mutation(api.habits.addHabit, {
      habitName: habitName.trim(),
      timestamp,
    });
    
    return NextResponse.json({ 
      id: habitId, 
      habitName: habitName.trim(), 
      timestamp,
      success: true 
    });
  } catch (error) {
    console.error('Error adding habit:', error);
    return NextResponse.json(
      { error: 'Failed to add habit' },
      { status: 500 }
    );
  }
}