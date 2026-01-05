import "dotenv/config";
import postgres, { Sql } from "postgres";

const connectionString: string | undefined = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

async function testConnection(): Promise<void> {
  console.log(
    "Testing connection to:",
    connectionString!.replace(/:([^:@]+)@/, ":****@")
  ); // Hide password in logs

  const sql: Sql = postgres(connectionString!, {
    ssl: "require",
    connect_timeout: 10,
  });

  try {
    const result = await sql<{ result: number }[]>`SELECT 1 as result`;
    console.log("Connection successful!", result);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await sql.end();
  }
}

testConnection();
