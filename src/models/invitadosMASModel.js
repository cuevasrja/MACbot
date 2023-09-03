import pool from './connection.js';

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function verifyTelegramID(telegram_id) {
    console.log(`**Query 'verifyTelegramID' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where telegram_id = ${telegram_id}`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
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
// INSERT INTO "invitado_mas" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values ###.
// ---------------------------------------------------------------------------------------------------- //
export async function registerTelegramData(telegramData) {
    console.log(`**Query 'registerTelegramData' in invitadosMASModel.`);

    let sql = `insert into "invitado_mas" (telegram_id, telegram_firstname, telegram_lastname, telegram_username) values (${telegramData.telegram_id}, '${telegramData.telegram_firstname}', '${telegramData.telegram_lastname}', '${telegramData.telegram_username}')`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegramData.telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE telegram_firstname = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function searchTelegramID(telegram_firstname) {
    console.log(`**Query 'searchTelegramID' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where telegram_firstname = '${telegram_firstname}'`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_firstname: ${telegram_firstname} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'searchTelegramID' must return: 
    // [Object] {
    //				- telegram_id
    //				- telegram_firstname
    //				- telegram_lastname
    //				- telegram_username
    //			 }

    return resultado.rows[0]
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas"
// ---------------------------------------------------------------------------------------------------- //
export async function showAllInvitados() {
    console.log(`**Query 'showAllInvitados' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas"`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'showAllUsers' must return: All users.
    // [Array] {
    //				- Each position of the array is a user.
    //				- Each user is an object.
    //				- Each object has the following properties:
    //              [Object] {
    //					- telegram_id
    //					- telegram_firstname
    //					- telegram_lastname
    //					- telegram_username 
    //              }
    //			 }
    return resultado.rows;
}