// app/ai/tools.ts
import { tool as createTool } from 'ai';
import { z } from 'zod';

// Predefined habits for UI guidance (not enforced in schema)
export const predefinedHabits = [
  'Meditation',
  'Journaling',
  'Reading',
  'Exercise',
  'Hydration',
  'Walking',
  'Stretching',
  'Learning',
  'Gratitude',
  'Sleep Hygiene',
] as const;

// Helper to get the base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

// API client for habits
async function fetchHabits(date?: string) {
  const baseUrl = getBaseUrl();
  let apiUrl = `${baseUrl}/api/habits`;
  
  if (date) {
    apiUrl += `?date=${date}`;
  }
  
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch habits');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching habits:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch habits' };
  }
}

async function addHabit(habit: { habitName: string; timestamp: string }) {
  const baseUrl = getBaseUrl();
  const apiUrl = `${baseUrl}/api/habits`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        habitName: habit.habitName.trim(),
        timestamp: habit.timestamp,
      }),
      cache: 'no-store',
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to add habit');
    }
    
    return result;
  } catch (error) {
    console.error('Error adding habit:', error);
    return { error: error instanceof Error ? error.message : 'Failed to add habit' };
  }
}

export const tools = {
  logHabit: createTool({
    description: 'Track a user habit with timestamp. Any habit name is allowed. Use current timestamp if user doesn\'t specify time.',
    parameters: z.object({
      habitName: z.string().min(1, { message: 'habitName must not be empty' }),
      timestamp: z.string().optional(),
    }),
   execute: async ({ habitName, timestamp }: { habitName: string; timestamp?: string }) => {
  try {
    if (!habitName?.trim()) {
      return 'Please provide a valid habit name.';
    }
    
    // Generate current timestamp if not provided
    const finalTimestamp = timestamp || new Date().toISOString();
    
    // Validate timestamp format (more flexible)
    try {
      new Date(finalTimestamp);
    } catch {
      return 'Invalid timestamp format provided.';
    }
    
    const result = await addHabit({ 
      habitName: habitName.trim(), 
      timestamp: finalTimestamp 
    });
    
    if ('error' in result) {
      console.error('Error in logHabit:', result.error);
      return `I couldn't log your habit. Please try again.`;
    }
    
    // Format timestamp for display
    const readableTime = new Date(finalTimestamp).toLocaleString();
    return `✅ Successfully logged "${habitName}" at ${readableTime}`;
  } catch (error) {
    console.error('Unexpected error in logHabit:', error);
    return 'Sorry, I encountered an unexpected error while logging your habit.';
  }
},
  }),

  getTodayHabits: createTool({
    description: "Returns today's logged habits with detailed information",
    parameters: z.object({}),
    execute: async () => {
      try {
        const habits = await fetchHabits();
        
        if ('error' in habits) {
          console.error('Error in getTodayHabits:', habits.error);
          return 'Sorry, I encountered an error while fetching your habits. Please try again later.';
        }
        
        if (!Array.isArray(habits)) {
          console.error('Unexpected habits format:', habits);
          return 'No habits logged today.';
        }
        
        if (habits.length === 0) {
          return 'No habits logged today. You can start by logging a habit like "Log Meditation" or "Log Exercise".';
        }
        
        const habitList = habits.map((habit: any) => {
          const readableTime = new Date(habit.timestamp).toLocaleString();
          return `• ${habit.habitName} (completed at ${readableTime})`;
        }).join('\n');
        
        return `📋 Today's completed habits:\n${habitList}\n\nGreat job! You've completed ${habits.length} habit${habits.length === 1 ? '' : 's'} today.`;
      } catch (error) {
        console.error('Unexpected error in getTodayHabits:', error);
        return 'Sorry, I encountered an unexpected error while fetching your habits.';
      }
    },
  }),

  getHabitsByDate: createTool({
    description: 'Get habits for a specific date (YYYY-MM-DD format)',
    parameters: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in YYYY-MM-DD format',
      }),
    }),
    execute: async ({ date }: { date: string }) => {
      try {
        const habits = await fetchHabits(date);
        
        if ('error' in habits) {
          console.error('Error in getHabitsByDate:', habits.error);
          return 'Sorry, I encountered an error while fetching habits for that date.';
        }
        
        if (!Array.isArray(habits) || habits.length === 0) {
          return `No habits were logged on ${date}.`;
        }
        
        const habitList = habits.map((habit: any) => {
          const readableTime = new Date(habit.timestamp).toLocaleString();
          return `• ${habit.habitName} (completed at ${readableTime})`;
        }).join('\n');
        
        return `📋 Habits completed on ${date}:\n${habitList}\n\nTotal: ${habits.length} habit${habits.length === 1 ? '' : 's'}`;
      } catch (error) {
        console.error('Unexpected error in getHabitsByDate:', error);
        return 'Sorry, I encountered an unexpected error while fetching habits for that date.';
      }
    },
  }),

  displayWeather: createTool({
    description: 'Display the weather for a location',
    parameters: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async function ({ location }) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { weather: 'Sunny', temperature: 75, location };
    },
  }),

  getStockPrice: createTool({
    description: 'Get price for a stock',
    parameters: z.object({
      symbol: z.string().describe('The stock symbol to get the price for'),
    }),
    execute: async function ({ symbol }) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { symbol, price: 100 };
    },
  }),
};


















