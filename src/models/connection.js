import pkg from 'pg';
const { Pool } = pkg;
// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

// ---------------------------------------------------------------------------------------------------- //
// Database credentials.
// ---------------------------------------------------------------------------------------------------- //
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

export default pool;
