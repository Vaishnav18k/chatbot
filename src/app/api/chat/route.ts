// import { openai } from "@ai-sdk/openai";
// import { streamText } from "ai";
// import { z } from "zod";
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const result = streamText({
//     model: openai("gpt-3.5-turbo"),
//     messages,
//     toolCallStreaming: true,
//     tools: {
//       getWeatherInformation: {
//         description: "show the weather in a given city to the user",
//         parameters: z.object({ city: z.string() }),
//         execute: async ({}: { city: string }) => {
//           const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
//           return weatherOptions[
//             Math.floor(Math.random() * weatherOptions.length)
//           ];
//         },
//       },

//       askForConfirmation: {
//         description: "Ask the user for confirmation.",
//         parameters: z.object({
//           messages: z.string().describe("The message to ask for confirmation."),
//         }),

//         getLocation: {
//           description:
//             "Get the user location. Always ask for confirmation before using this tool.",
//           parameters: z.object({}),
//         },
//       },
//     },
//   });
//   return result.toDataStreamResponse();
// }


import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {tools } from "@/app/ai/tools"

export async function POST(req:Request) {
    const {messages} = await req.json();
    const result = streamText({
        model: openai("gpt-4o"),
        system:'You are a friendly assistant',
        messages,
        maxSteps:5,
        tools,
        // toolCallStreaming: true,
    });

    return result.toDataStreamResponse();
}