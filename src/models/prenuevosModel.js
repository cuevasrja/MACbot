import pool from './connection.js';

/**
 * Verify if the telegram_id exists in the database.
 * The SQL code is: select * from "prenuevo" where telegram_id = ###;
 * @param {Integer} telegram_id 
 * @returns {Boolean} True if the telegram_id does not exist in the database, false if it exists.
 */
export async function verifyTelegramID(telegram_id) {
	console.log(`**Query 'verifyTelegramID' in prenuevosModel.`);

	let sql = `select * from "prenuevo" where telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the telegram_id: ${telegram_id} - 'prenuevosModel'`,
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

/**
 * Register a new user in the database.
 * The SQL code is: insert into "prenuevo" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values (###, '###', '###', '###');
 * @param {object} telegramData - Object with the data of the user to be registered.
 */
export async function registerTelegramData(telegramData) {
	console.log(`**Query 'registerTelegramID' in prenuevosModel.`);

	let telegram_id = telegramData.id || undefined;
	let telegram_firstname = telegramData.first_name || undefined;
	let telegram_lastname = telegramData.last_name || undefined;
	let telegram_username = telegramData.username || undefined;

	let sql = `insert into "prenuevo" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values (${telegram_id}, '${telegram_firstname}', '${telegram_lastname}', '${telegram_username}')`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error writing the user's table with the telegram_id: ${telegram_id} - 'prenuevosModel'`,
			err
		);
	});
}
