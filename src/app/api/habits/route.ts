// app/api/habits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const toolsDir = path.join(process.cwd(), 'tools');
const habitsFilePath = path.join(toolsDir, 'habits.json');

// Helper to log detailed error information
function logError(context: string, error: unknown, extra: Record<string, any> = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  console.error(`[${new Date().toISOString()}] ${context}`, {
    error: errorMessage,
    stack: errorStack,
    ...extra,
  });
}

// Ensure the tools directory and habits file exist
async function ensureHabitsFile() {
  try {
    console.log(`Ensuring directory exists: ${toolsDir}`);
    await fs.mkdir(toolsDir, { recursive: true });
    
    try {
      await fs.access(habitsFilePath);
      console.log(`Habits file exists at: ${habitsFilePath}`);
    } catch (error) {
      console.log(`Creating new habits file at: ${habitsFilePath}`);
      await fs.writeFile(habitsFilePath, '[]', 'utf-8');
      console.log('Created new habits file');
    }
    
    // Verify file permissions
    try {
      await fs.access(habitsFilePath, fs.constants.R_OK | fs.constants.W_OK);
      console.log('Verified file has read/write permissions');
    } catch (error) {
      logError('File permission error', error, { path: habitsFilePath });
      throw new Error(`Cannot access file at ${habitsFilePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
  } catch (error) {
    logError('Error in ensureHabitsFile', error, { toolsDir, habitsFilePath });
    throw error;
  }
}

export async function GET() {
  try {
    console.log('GET /api/habits - Starting');
    await ensureHabitsFile();
    
    console.log(`Reading habits from: ${habitsFilePath}`);
    const habitsData = await fs.readFile(habitsFilePath, 'utf-8');
    
    try {
      const habits = JSON.parse(habitsData);
      console.log(`Successfully parsed ${habits.length} habits`);
      return NextResponse.json(habits);
    } catch (parseError) {
      logError('Failed to parse habits JSON', parseError, { habitsData });
      throw new Error('Invalid habits data format');
    }
    
  } catch (error) {
    logError('GET /api/habits failed', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch habits',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/habits - Starting');
    await ensureHabitsFile();
    
    let newHabit;
    try {
      newHabit = await req.json();
      console.log('Received habit data:', newHabit);
    } catch (parseError) {
      logError('Failed to parse request body', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate the incoming habit data
    if (!newHabit?.habitName || !newHabit?.timestamp) {
      return NextResponse.json(
        { 
          error: 'Invalid habit data',
          required: ['habitName', 'timestamp'],
          received: Object.keys(newHabit || {})
        },
        { status: 400 }
      );
    }
    
    console.log('Reading existing habits...');
    const habitsData = await fs.readFile(habitsFilePath, 'utf-8');
    
    let habits;
    try {
      habits = JSON.parse(habitsData);
      if (!Array.isArray(habits)) {
        throw new Error('Habits data is not an array');
      }
    } catch (parseError) {
      logError('Failed to parse existing habits', parseError, { habitsData });
      // Try to recover by resetting to empty array
      habits = [];
    }
    
    // Add the new habit with metadata
    const habitWithId = {
      ...newHabit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Adding new habit:', habitWithId);
    habits.push(habitWithId);
    
    console.log('Writing updated habits to file...');
    await fs.writeFile(habitsFilePath, JSON.stringify(habits, null, 2), 'utf-8');
    
    console.log('Habit saved successfully');
    return NextResponse.json({ 
      success: true,
      message: 'Habit logged successfully',
      habit: habitWithId
    });
    
  } catch (error) {
    logError('POST /api/habits failed', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save habit',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  }
}