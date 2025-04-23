import { pgTable, timestamp, real, serial } from 'drizzle-orm/pg-core';

export const heatIndex = pgTable('sensor_data', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow().primaryKey(),
  temperature: real('temperature'),
  humidity: real('humidity'),
});

// This type can be used to type-check insert operations
export type NewSensorData = typeof heatIndex.$inferInsert;