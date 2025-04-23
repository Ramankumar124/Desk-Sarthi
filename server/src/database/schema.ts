import { pgTable, timestamp, real, serial, pgEnum } from 'drizzle-orm/pg-core';

export const heatIndex = pgTable('sensor_data', {
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow().primaryKey(),
  temperature: real('temperature'),
  humidity: real('humidity'),
});
export const relayStateEnum = pgEnum('relay_state', ['ON', 'OFF']);

export const relaySwitches = pgTable('relay_switches', {
  id: serial('id').primaryKey(),
  relay1: relayStateEnum('relay1').notNull().default("OFF"),  // This will only accept 'ON' or 'OFF'
  relay2:relayStateEnum('relay2').notNull().default("OFF"),
  relay3:relayStateEnum('relay3').notNull().default("OFF"),
  relay4:relayStateEnum('relay4').notNull().default("OFF")


});
// This type can be used to type-check insert operations
export type NewSensorData = typeof heatIndex.$inferInsert;
export type NewRelayData=typeof relaySwitches.$inferInsert