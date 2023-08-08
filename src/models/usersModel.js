import pool from './connection.js';

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "user" WHERE carnet = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function searchCarnet(carnet) {
	console.log(`**Query 'searchCarnet' in usersModel.`);

	let sql = `select * from "user" where carnet = '${carnet}'`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user's query with the student credential: ${carnet} - 'usersModel'`,
			err
		);
	});

	//	The function 'searchCarnet' must return:
	//	[Object] '{ usuario_id: #intValue,
	// 				id_telegram: #intValue,
	//				nombre: #stringValue,
	// 				carnet: #stringValue,
	//				telefono: #intValue,
	//	 		 }'
	return resultado.rows[0];
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "user" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function verifyTelegramID(telegram_id) {
	console.log(`**Query 'verifyTelegramID' in usersModel.`);

	let sql = `select * from "user" where telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the telegram_id: ${telegram_id} - 'userModel'`,
			err
		);
	});

	// The function 'verifyTelegramID' must return:
	// [Boolean] {
	//				- If the row count is 0, it returns a true expression.
	//				- If the row count is greater than or equal to 1, it returns a false expression.
	//			 }
	// It returns true if the user has not written to the bot before. By default, it returns false.
	return resultado.rowCount === 0;
}

// ---------------------------------------------------------------------------------------------------- //
// INSERT INTO "user" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values ###.
// ---------------------------------------------------------------------------------------------------- //
export async function registerTelegramData(telegramData) {
	console.log(`**Query 'registerTelegramID' in usersModel.`);

	let telegram_id = telegramData.id || undefined;
	let telegram_firstname = telegramData.first_name || undefined;
	let telegram_lastname = telegramData.last_name || undefined;
	let telegram_username = telegramData.username || undefined;

	let sql = `insert into "user" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values (${telegram_id}, '${telegram_firstname}', '${telegram_lastname}', '${telegram_username}')`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error writing the user's table with the telegram_id: ${telegram_id} - 'usersModel'`,
			err
		);
	});
}
