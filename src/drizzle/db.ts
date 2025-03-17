import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/data/env/server";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

const sql = neon(env.DATABASE_URL!);
export const db = drizzle({ schema, client: sql });


