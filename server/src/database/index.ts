import { drizzle } from "drizzle-orm/node-postgres";

let db: ReturnType<typeof drizzle> | null = null;

const DBConnection = async () => {
  try {
    db = drizzle(process.env.DATABASE_URL!);
    console.log(`Database connection done`,db);
    return db;
  } catch (error: any) {
    console.log(`Database connection failed ${error}`);
    process.exit(1);
  }
};

export { DBConnection, db };
