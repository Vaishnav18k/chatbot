// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    habitName: v.string(),
    timestamp: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_date", ["timestamp"])
    .index("by_completion", ["completed"])
    .index("by_created_at", ["createdAt"]),
});