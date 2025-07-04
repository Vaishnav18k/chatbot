'use client';

import { useChat } from '@ai-sdk/react';
import { Weather } from '../components/weather';
import { Stock } from '../components/stock';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center max-w-3xl mx-auto w-full">
        <h1 className="text-xl font-semibold text-gray-800">Weather & Stock Chat</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
        >
          Chat
        </button>
      </header>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((message) => (
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
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <div className="text-xs font-medium mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="text-sm">{message.content}</div>

              <div className="mt-2">
                {message.toolInvocations?.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === 'result') {
                    if (toolName === 'displayWeather') {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId} className="mt-2">
                          <Weather {...result} />
                        </div>
                      );
                    } else if (toolName === 'getStockPrice') {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId} className="mt-2">
                          <Stock {...result} />
                        </div>
                      );
                    }
                  } else {
                    return (
                      <div key={toolCallId} className="text-sm text-gray-500 italic">
                        {toolName === 'displayWeather' ? (
                          <div>Loading weather...</div>
                        ) : toolName === 'getStockPrice' ? (
                          <div>Loading stock price...</div>
                        ) : (
                          <div>Loading...</div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t shadow-sm max-w-3xl mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Type a message..."
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
  );    
}