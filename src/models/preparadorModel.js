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
	return resultado.rowCount === 0;
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

	let sql = 'DO $$ BEGIN ';

	for (let [key, value] of PREPARADORES) {
		// Comprobamos que el telegram_id no sea undefined
		if (key === undefined) continue;

		// Comprobar si el registro ya existe
		sql += `IF NOT EXISTS (SELECT 1 FROM "preparador" WHERE telegram_id = ${key} AND initials = '${value}') THEN `;
		// Insertar el registro si no existe
		sql += `INSERT INTO "preparador" (telegram_id, initials) VALUES (${key}, '${value}'); `;
		sql += 'END IF; ';
	}

	sql += 'END $$;';

	await pool.query(sql).catch(err => {
		throw new Error(`There was an error registering all preparadores - 'preparadoresModel'`, err);
	});
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "preparador"
// ---------------------------------------------------------------------------------------------------- //
export async function getAllPreparadores() {
	let sql = `SELECT * from "preparador"`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(`There was an error getting all preparadores - 'preparadoresModel'`, err);
	});

	// The function 'getAllPreparadores' must return an array of objects:
	//	[Object] '{ preparador_id: #intValue,
	//	 			telegram_id: #intValue,
	//				initials: #stringValue,
	//	 		 }'

	return resultado.rows;
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "preparador" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function getPreparadorByTelegramID(telegram_id) {
	let sql = `SELECT * from "preparador" WHERE telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error getting the preparador with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});

	// The function 'getPreparadorByTelegramID' must return an object:
	//	[Object] '{ preparador_id: #intValue,
	//	 			telegram_id: #intValue,
	//				initials: #stringValue,
	//	 		 }'
	return resultado.rows[0];
}