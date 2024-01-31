import pool from './connection.js';

/**
 * Verify if the telegram_id exists in the database.
 * The SQL code is: select * from "prenuevo" where telegram_id = ###;
 * @param {Integer} telegram_id 
 * @returns {Promise<Boolean>} True if the telegram_id does not exist in the database, false if it exists.
 */
export async function verifyPrenuevo(telegram_id) {
	console.log(`**Query 'verifyPrenuevo' in prenuevosModel.`);

	let sql = `select * from "prenuevo" where telegram_id = ${telegram_id}`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the telegram_id: ${telegram_id} - 'prenuevosModel'`,
			err
		);
	});

	// The function 'verifyPrenuevo' must return:
	// [Boolean] {
	//		- If the row count is 0, it returns a true expression.
	//		- If the row count is greater than or equal to 1, it returns a false expression.
	// }
	return resultado.rowCount === 0;
}

/**
 * Verify if the carnet exists in the database.
 * The SQL code is: select * from "prenuevo" where carnet = '###';
 * @param {String} carnet
 * @returns {Promise<Boolean>} True if the carnet does not exist in the database, false if it exists.
 */
export async function verifyPrenuevoCarnet(carnet) {
	console.log(`**Query 'verifyPrenuevoCarnet' in prenuevosModel.`);

	let sql = `select * from "prenuevo" where carnet = '${carnet}'`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error in the user registration query with the carnet: ${carnet} - 'prenuevosModel'`,
			err
		);
	});

	// The function 'verifyPrenuevoCarnet' must return:
	// [Boolean] {
	//		- If the row count is 0, it returns a true expression.
	//		- If the row count is greater than or equal to 1, it returns a false expression.
	// }
	return resultado.rowCount === 0;
}

/**
 * Register a new user in the database.
 * The SQL code is: insert into "prenuevo" (telegram_id, name, carnet) values (###, '###', '###');
 * @param {Integer} telegram_id
 * @param {String} name
 * @param {String} carnet
 * @returns {Promise<void>}
 */
export async function registerPrenuevo(telegram_id, name, carnet) {
	console.log(`**Query 'registerPrenuevo' in prenuevosModel.`);

	let sql = `insert into "prenuevo" (telegram_id, name, carnet) values (${telegram_id}, '${name}', '${carnet}')`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error writing the user's table with the telegram_id: ${telegram_id} - 'prenuevosModel'`,
			err
		);
	});
}

/**
 * Delete a user from the database.
 * The SQL code is: delete from "prenuevo" where carnet = '###';
 * @param {String} carnet
 * @returns {Promise<void>}
 */
export async function deletePrenuevo(carnet) {
	console.log(`**Query 'deletePrenuevo' in prenuevosModel.`);
	let sql = `delete from "prenuevo" where carnet = '${carnet}'`;

	await pool.query(sql).catch(err => {
		throw new Error(
			`There was an error deleting the user's table with the carnet: ${carnet} - 'prenuevosModel'`,
			err
		);
	});
}

/**
 * Get the information of all the users in the database.
 * The SQL code is: select name from "prenuevo";
 * @returns {Promise<Array<Object>>} An array of objects with the information of all the users.
 */
export async function getAllPrenuevos() {
	console.log(`**Query 'getAllPrenuevos' in prenuevosModel.`);

	let sql = `select name from "prenuevo"`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(`There was an error getting all the users - 'prenuevosModel'`, err);
	});

	/* The function 'getAllPrenuevos' must return:
	[Array<Object>] {
		- An array of objects with the information of all the users.
		- If there are no users, it returns an empty array.
		- Example: [
			{name: 'Juan', carnet: '12-34567', telegram_id: 123456789}, 
			{name: 'Pedro', carnet: '12-34567', telegram_id: 123456789}
		]
	*/
	return resultado.rows;
}

/**
 * Get the information of a user in the database using the carnet.
 * The SQL code is: select * from "prenuevo" where carnet = '###';
 * @param {String} carnet
 * @returns {Promise<Object>} An object with the information of the user.
 */
export async function getPrenuevo(carnet) {
	console.log(`**Query 'getPrenuevo' in prenuevosModel.`);

	let sql = `select * from "prenuevo" where carnet = '${carnet}'`;

	let resultado = await pool.query(sql).catch(err => {
		throw new Error(`There was an error getting the user with the carnet: ${carnet} - 'prenuevosModel'`, err);
	});

	/* The function 'getPrenuevo' must return:
	[Object] {
		- An object with the information of the user.
		- If there is no user, it returns an empty object.
		- Example: {name: 'Juan', carnet: '12-34567', telegram_id: 123456789}
	*/
	return resultado.rows[0];
}

/**
 * Delete all the users in the database.
 * The SQL code is: delete from "prenuevo";
 * @returns {Promise<void>}
 */
export async function deleteAllPrenuevos() {
	console.log(`**Query 'deleteAllPrenuevos' in prenuevosModel.`);

	let sql = `delete from "prenuevo"`;

	await pool.query(sql).catch(err => {
		throw new Error(`There was an error deleting all the users - 'prenuevosModel'`, err);
	});
}