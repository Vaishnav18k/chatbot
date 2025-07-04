import { tools } from '@/app/ai/tools';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
// import { tools } from '@/ai/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      toolCallStreaming: true,
      tools,
      // tools: {
      //   // server-side tool with execute function:
      //   getWeatherInformation: {
      //     description: 'show the weather in a given city to the user',
      //     parameters: z.object({ city: z.string() }),

      //     execute: async ({}: { city: string }) => {
      //       const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
      //       return weatherOptions[
      //         Math.floor(Math.random() * weatherOptions.length)
      //       ];
      //     },
      //   },

      //   // client-side tool that starts user interaction:
      //   askForConfirmation: {
      //     description: 'Ask the user for confirmation.',
      //     parameters: z.object({
      //       message: z.string().describe('The message to ask for confirmation.'),
      //     }),
      //   },
      //   // client-side tool that is automatically executed on the client:
      //   getLocation: {
      //     description:
      //       'Get the user location. Always ask for confirmation before using this tool.',
      //     parameters: z.object({}),
      //   },
      // },
      maxSteps: 5,
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

export function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}




























// import { tools } from '@/app/ai/tools';
// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import { z } from 'zod';
// // import { tools } from '@/ai/tools';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: openai('gpt-3.5-turbo'),
//     messages,
//     toolCallStreaming: true,
//     tools,
//     // tools: {
//     //   // server-side tool with execute function:
//     //   getWeatherInformation: {
//     //     description: 'show the weather in a given city to the user',
//     //     parameters: z.object({ city: z.string() }),

//     //     execute: async ({}: { city: string }) => {
//     //       const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
//     //       return weatherOptions[
//     //         Math.floor(Math.random() * weatherOptions.length)
//     //       ];
//     //     },
//     //   },
    
//     //   // client-side tool that starts user interaction:
//     //   askForConfirmation: {
//     //     description: 'Ask the user for confirmation.',
//     //     parameters: z.object({
//     //       message: z.string().describe('The message to ask for confirmation.'),
//     //     }),
//     //   },
//     //   // client-side tool that is automatically executed on the client:
//     //   getLocation: {
//     //     description:
//     //       'Get the user location. Always ask for confirmation before using this tool.',
//     //     parameters: z.object({}),
//     //   },
//     // },
//     maxSteps:5,
//   });





//   return result.toDataStreamResponse(
//     {
//         getErrorMessage: errorHandler,
//       }
//   );
// }


// export function errorHandler(error: unknown) {
//     if (error == null) {
//       return 'unknown error';
//     }
  
//     if (typeof error === 'string') {
//       return error;
//     }
  
//     if (error instanceof Error) {
//       return error.message;
//     }
  
//     return JSON.stringify(error);
//   }