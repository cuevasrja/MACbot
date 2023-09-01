import pool from './connection.js';

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "preparador" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function verifyTelegramID(telegram_id) {
	console.log(`**Query 'verifyTelegramID' in preparadoresModel.`);

	let sql = `select * from "preparador" where telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});

	// The function 'verifyTelegramID' must return:
	// [Boolean] {
	//				- If the row count is 0, it returns a true expression.
	//				- If the row count is greater than or equal to 1, it returns a false expression.
	//			 }
	return resultado.rowCount === 0 ? true : false;
}

// ---------------------------------------------------------------------------------------------------- //
// INSERT INTO "preparador" (telegram_id, initials) values ###.
// ---------------------------------------------------------------------------------------------------- //
export async function registerTelegramData(telegram_id, initials) {
	console.log(`**Query 'registerTelegramID' in preparadoresModel.`);

	let sql = `insert into "preparador" (telegram_id, initials) values (${telegram_id}, '${initials}')`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error writing the user's table with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});
}

export async function registerAllPreparadores(PREPARADORES) {
	console.log(`**Query 'registerAllPreparadores' in preparadoresModel.`);

	let sql = `insert into "preparador" (telegram_id, initials) values `;

	for (let [key, value] of PREPARADORES) {
		if (key === undefined) continue;
		sql += `(${key}, '${value}'),`;
	}

	sql = sql.slice(0, -1);

	await pool.query(sql).catch(err => {
		throw new Error(`There was an error registering all preparadores - 'preparadoresModel'`, err);
	});
}

// This function returns all the preparadores registered in the database.
export async function getAllPreparadores() {
	let sql = `select * from "preparador"`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(`There was an error getting all preparadores - 'preparadoresModel'`, err);
	});

	return resultado.rows;
}
