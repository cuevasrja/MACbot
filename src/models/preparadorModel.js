import pool from './connection.js';

/**
 * Verify if the telegram_id exists in the database.
 * The SQL code is: select * from "preparador" where telegram_id = ###;
 * @param {Integer} telegram_id 
 * @returns {Boolean} True if the telegram_id does not exist in the database, false if it exists.
 */
export async function verifyPreparadorID(telegram_id) {
	console.log(`**Query 'verifyPreparadorID' in preparadoresModel.`);

	const sql = `select * from "preparador" where telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});

	// The function 'verifyPreparadorID' must return:
	// [Boolean] {
	//				- If the row count is 0, it returns a true expression.
	//				- If the row count is greater than or equal to 1, it returns a false expression.
	//			 }
	return resultado.rowCount === 0;
}

/**
 * Insert a new preparador in the database.
 * @param {Integer} telegram_id 
 * @param {String} initials 
 */
export async function registerTelegramData(telegram_id, initials) {
	console.log(`**Query 'registerTelegramID' in preparadoresModel.`);

	const sql = `insert into "preparador" (telegram_id, initials) values (${telegram_id}, '${initials}')`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error writing the user's table with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});
}

/**
 * Insert all preparadores in the database.
 * The SQL code is: DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM "preparador" WHERE telegram_id = ### AND initials = '###') THEN INSERT INTO "preparador" (telegram_id, initials) VALUES (###, '###'); END IF; END $$;
 * @param {Map<String, object>} PREPARADORES - Map with the telegram_id and initials of all preparadores. 
 */
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

/**
 * Get all preparadores from the database.
 * The SQL code is: select * from "preparador";
 * @returns {Array<object>} Array with all preparadores.
 */
export async function getAllPreparadores() {
	const sql = `SELECT * from "preparador"`;

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

/**
 * Get the preparador with the telegram_id.
 * @param {Integer} telegram_id 
 * @returns {object} Object with the data of the preparador.
 */
export async function getPreparadorByTelegramID(telegram_id) {
	const sql = `SELECT * from "preparador" WHERE telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error getting the preparador with the telegram_id: ${telegram_id} - 'preparadoresModel'`,
			err
		);
	});

	// The function 'getPreparadorByTelegramID' must return an object:
	//	[Object] '{ 
	//				user_id: #intValue,
	//	 			telegram_id: #intValue,
	//				initials: #stringValue,
	//	 		 }'
	return resultado.rows[0];
}

/**
 * Get the preparador with the initials.
 * The SQL code is: select * from "preparador" where initials = '###';
 * @param {String} initials 
 * @returns {object} Object with the data of the preparador.
 */
export async function getPreparadorByInitials(initials) {
	const sql = `SELECT * from "preparador" WHERE initials = '${initials}'`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error getting the preparador with the initials: ${initials} - 'preparadoresModel'`,
			err
		);
	});

	// The function 'getPreparadorByInitials' must return an object:
	//	[Object] '{
	//				user_id: #intValue,
	//	 			telegram_id: #intValue,
	//				initials: #stringValue,
	//	 		 }'
	return resultado.rows[0];
}