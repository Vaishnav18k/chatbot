
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
      system: 'You are a habit tracking assistant. Interpret user requests to log habits (e.g., "Log Running" or "Log Meditation") or retrieve today\'s habits (e.g., "Show today\'s habits"). Use the logHabit tool to log any habit with the current timestamp in ISO format (e.g., 2023-10-10T10:00:00). Use getTodayHabits to retrieve habits. Only use displayWeather or getStockPrice if explicitly requested (e.g., "Get weather for New York" or "Get stock price for AAPL").',
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













