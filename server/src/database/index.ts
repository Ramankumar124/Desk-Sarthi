import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let db: ReturnType<typeof drizzle> | null = null;

const DBConnection = async () => {
  try {
    // Initialize the database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });

    db = drizzle(pool);
    return db;
  } catch (error: any) {
    console.log(`Database connection failed ${error}`);
    process.exit(1);
  }
};

export { DBConnection, db };
