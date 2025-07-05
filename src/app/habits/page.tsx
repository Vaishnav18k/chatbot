'use client';

import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function HabitsPage() {
  const router = useRouter();
  const { messages, input, setInput, handleSubmit } = useChat({
    api: '/api/chat',
  });

  const habits = useQuery(api.habits.getTodayHabits);
  const [habitStats, setHabitStats] = useState<any>(null);

  useEffect(() => {
    if (habits) {
      const stats = {
        totalHabits: habits.length,
        todayCount: habits.length,
        habitFrequency: habits.reduce((acc: any, habit: any) => {
          acc[habit.habitName] = (acc[habit.habitName] || 0) + 1;
          return acc;
        }, {}),
      };
      setHabitStats(stats);
    }
  }, [habits]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h- bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-lg mt-6 mb-6">
        <header className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Habit Tracker AI</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              Back to Chat
            </button>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Completed Habits</h2>

            {!habits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading habits...</p>
              </div>
            ) : habits.length > 0 ? (
              <div className="space-y-3">
                {habits.map((habit: any, index: number) => (
                  <div key={habit._id || index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-800">{habit.habitName}</span>
                      </div>
                      <span className="text-xs text-green-600">
                        {formatTime(habit.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm">No habits completed today</p>
                <p className="text-xs mt-1">Start by logging your first habit!</p>
              </div>
            )}

            {/* Most Frequent */}
            {habitStats?.habitFrequency && Object.keys(habitStats.habitFrequency).length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Most Frequent Habits</h3>
                <div className="space-y-2">
                  {Object.entries(habitStats.habitFrequency)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([habit, count]) => (
                      <div key={habit} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{habit}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{count as number}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2">Welcome to Habit Tracker AI!</h3>
                  <p className="text-sm mb-4">Ask me about your habits or log new ones</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>✨ Try saying: "Log Meditation"</p>
                    <p>📊 Or: "Show me today's habits"</p>
                    <p>📅 Or: "Did I exercise yesterday?"</p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 opacity-70">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="text-sm whitespace-pre-line">{message.content}</div>

                    <div className="mt-2">
                      {message.toolInvocations?.map((toolInvocation) => {
                        const { toolName, toolCallId, state } = toolInvocation;

                        if (state === 'result') {
                          return (
                            <div key={toolCallId} className="text-sm mt-2 p-2 bg-gray-100 rounded">
                              {toolInvocation.result}
                            </div>
                          );
                        } else {
                          return (
                            <div key={toolCallId} className="text-sm text-gray-500 italic mt-2">
                              {toolName === 'logHabit' && '📝 Logging habit...'}
                              {toolName === 'getTodayHabits' && '📊 Fetching today\'s habits...'}
                              {toolName === 'getHabitsByDate' && '📅 Fetching habits for date...'}
                              {!['logHabit', 'getTodayHabits', 'getHabitsByDate'].includes(toolName) &&
                                '⏳ Processing...'}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Ask about your habits or log a new one"
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
      </div>
    </div>
  );
}

