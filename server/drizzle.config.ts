import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: './Drizzle',
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    //@ts-ignore
    url: process.env.DATABASE_URL!,
  },
});
