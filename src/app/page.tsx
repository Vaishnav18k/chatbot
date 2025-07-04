'use client';

import { ToolInvocation } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit, addToolResult } = useChat({
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Card Container */}
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-lg mt-6 mb-6">
        {/* Header */}
        <header className="p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Chatbot</h1>
          <button
            onClick={() => router.push('/weather')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Weather
          </button>
        </header>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } mb-3`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case 'step-start':
                      return index > 0 ? (
                        <div key={index} className="text-gray-300 my-2">
                          <hr className="border-gray-200" />
                        </div>
                      ) : null;

                    case 'text':
                      return (
                        <span key={index} className="block text-sm">
                          {part.text}
                        </span>
                      );

                    case 'tool-invocation': {
                      const callId = part.toolInvocation.toolCallId;
                      switch (part.toolInvocation.toolName) {
                        case 'askForConfirmation':
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div key={callId} className="space-y-2">
                                  <p className="text-sm">{part.toolInvocation.args.message}</p>
                                  <div className="flex gap-2">
                                    <button
                                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                                      onClick={() =>
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'Yes, confirmed.',
                                        })
                                      }
                                    >
                                      Yes
                                    </button>
                                    <button
                                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                                      onClick={() =>
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'No, denied',
                                        })
                                      }
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="text-sm">
                                  Location access: {part.toolInvocation.result}
                                </div>
                              );
                          }
                          break;

                        case 'getLocation':
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div key={callId} className="text-sm text-gray-500 italic">
                                  Getting location...
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="text-sm">
                                  Location: {part.toolInvocation.result}
                                </div>
                              );
                          }
                          break;

                        case 'getWeatherInformation':
                          switch (part.toolInvocation.state) {
                            case 'partial-call':
                              return (
                                <pre key={callId} className="text-xs bg-gray-100 p-2 rounded">
                                  {JSON.stringify(part.toolInvocation, null, 2)}
                                </pre>
                              );
                            case 'call':
                              return (
                                <div key={callId} className="text-sm text-gray-500 italic">
                                  Getting weather for {part.toolInvocation.args.city}...
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="text-sm">
                                  Weather in {part.toolInvocation.args.city}: {part.toolInvocation.result}
                                </div>
                              );
                          }
                          break;
                      }
                    }

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}