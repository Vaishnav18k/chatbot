
// // app/api/chat/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { streamText } from 'ai';
// import { openai } from '@ai-sdk/openai';
// import { tools } from '@/app/ai/tools';
// import { errorHandler } from '@/lib/error-handler';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     const result = await streamText({
//       model: openai('gpt-3.5-turbo'),
//       messages,
//       toolCallStreaming: true,
//       tools,
//       maxSteps: 5,
//       system: 'You are a habit tracking assistant. Interpret user requests to log habits (e.g., "Log Running" or "Log Meditation") or retrieve today\'s habits (e.g., "Show today\'s habits"). Use the logHabit tool to log any habit with the current timestamp in ISO format (e.g., 2023-10-10T10:00:00). Use getTodayHabits to retrieve habits. Only use displayWeather or getStockPrice if explicitly requested (e.g., "Get weather for New York" or "Get stock price for AAPL").',
//     });

//     return result.toDataStreamResponse({
//       getErrorMessage: errorHandler,
//     });
//   } catch (error) {
//     const message = errorHandler(error);
//     console.error('[CHAT_API_ERROR]', message);
//     return new Response(message, { status: 500 });
//   }
// }


// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tools } from '@/app/ai/tools';
import { errorHandler } from '@/lib/error-handler';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      toolCallStreaming: true,
      tools,
      maxSteps: 5,
      system: `You are a friendly and encouraging habit tracking assistant. Your main responsibilities are:

1. **Habit Logging**: When users want to log habits, use the logHabit tool with the habit name and current timestamp
2. **Today's Habits**: When users ask about today's habits, use getTodayHabits to show completed habits
3. **Date-specific Habits**: When users ask about habits for specific dates, use getHabitsByDate
4. **Natural Language**: Interpret various ways users might express habit tracking:
   - "Log Meditation" or "I meditated" → Log the habit
   - "Show today's habits" or "What did I do today?" → Show today's habits
   - "Did I exercise yesterday?" → Check habits for yesterday's date

**Response Style:**
- Be encouraging and positive about habit completion
- Use emojis to make responses more engaging
- Provide helpful suggestions for habit tracking
- Celebrate achievements and streaks
- If no habits are logged, encourage users to start

**Common Habits to Recognize:**
- Exercise, Meditation, Reading, Journaling, Walking, Hydration
- Yoga, Workout, Running, Cycling, Stretching, Learning
- Gratitude, Sleep Hygiene, Cooking, Cleaning

Only use displayWeather or getStockPrice if explicitly requested.`,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    const message = errorHandler(error);
    console.error('[CHAT_API_ERROR]', message);
    return new Response(message, { status: 500 });
  }
}












