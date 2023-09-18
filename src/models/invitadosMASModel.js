import pool from './connection.js';

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function verifyInvitadoID(telegram_id) {
    console.log(`**Query 'verifyInvitadoID' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where telegram_id = ${telegram_id}`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'verifyInvitadoID' must return:
    // [Boolean] {
    //				- If the row count is 0, it returns a true expression.
    //				- If the row count is greater than or equal to 1, it returns a false expression.
    //			 }
    return resultado.rowCount === 0;
}

// ---------------------------------------------------------------------------------------------------- //
// INSERT INTO "invitado_mas" (telegram_id, name) values ###.
// ---------------------------------------------------------------------------------------------------- //
export async function registerInvitado(telegramData) {
    console.log(`**Query 'registerInvitado' in invitadosMASModel.`);

    let sql = `insert into "invitado_mas" (telegram_id, name) values (${telegramData.telegram_id}, '${telegramData.name}')`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegramData.telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// REMOVE FROM "invitado_mas" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function removeInvitado(telegram_id) {
    console.log(`**Query 'removeInvitado' in invitadosMASModel.`);
    let sql = `delete from "invitado_mas" where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function searchTelegramID(name) {
    console.log(`**Query 'searchTelegramID' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where name = '${name}'`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'searchTelegramID' must return: 
    // [Object] {
    //				- telegram_id
    //				- user_id
    //				- name
    //			 }

    return resultado.rows[0]
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function getInvitadoByTelegramID(telegram_id) {
    console.log(`**Query 'getInvitadoByTelegramID' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where telegram_id = ${telegram_id}`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'getInvitadoByTelegramID' must return: 
    // [Object] {
    //				- telegram_id
    //				- user_id
    //				- name
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
    //					- user_id
    //					- name
    //              }
    //			 }
    return resultado.rows;
}