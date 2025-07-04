// convex/habits.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to add a new habit
export const addHabit = mutation({
  args: {
    habitName: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    const habitId = await ctx.db.insert("habits", {
      habitName: args.habitName,
      timestamp: args.timestamp,
      completed: true,
      createdAt: Date.now(),
    });
    return habitId;
  },
});

// Query to get all habits
export const getAllHabits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("habits").collect();
  },
});

// Query to get today's habits
export const getTodayHabits = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    const habits = await ctx.db.query("habits").collect();
    
    return habits.filter(habit => 
      habit.timestamp.startsWith(today)
    );
  },
});

// Query to get habits by date
export const getHabitsByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const habits = await ctx.db.query("habits").collect();
    
    return habits.filter(habit => 
      habit.timestamp.startsWith(args.date)
    );
  },
});

// Query to get habit statistics
export const getHabitStats = query({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db.query("habits").collect();
    const today = new Date().toISOString().split('T')[0];
    
    const todayHabits = habits.filter(habit => 
      habit.timestamp.startsWith(today)
    );
    
    const totalHabits = habits.length;
    const todayCount = todayHabits.length;
    
    // Group habits by name for frequency analysis
    const habitFrequency = habits.reduce((acc, habit) => {
      acc[habit.habitName] = (acc[habit.habitName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalHabits,
      todayCount,
      habitFrequency,
      todayHabits: todayHabits.map(h => ({
        habitName: h.habitName,
        timestamp: h.timestamp
      }))
    };
  },
});