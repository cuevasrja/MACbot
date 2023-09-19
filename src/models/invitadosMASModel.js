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
// SELECT * FROM "invitado_mas" WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function verifyInvitadoName(name) {
    console.log(`**Query 'verifyInvitadoName' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where name = '${name}'`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'verifyInvitadoName' must return:
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
export async function getInvitadoByName(name) {
    console.log(`**Query 'getInvitadoByName' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where name = '${name}'`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'getInvitadoByName' must return: 
    // [Object] {
    //				- telegram_id (Int)
    //				- user_id (Int)
    //				- name (String)
    //              - team (String)
    //              - checked (Boolean)
    //              - suggestion (String)
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
    //				- telegram_id (Int)
    //				- user_id (Int)
    //				- name (String)
    //              - team (String)
    //              - checked (Boolean)
    //              - suggestion (String)
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
    //					- telegram_id (Int)
    //					- user_id (Int)
    //					- name (String)
    //                  - team (String)
    //                  - checked (Boolean)
    //                  - suggestion (String)
    //              }
    //			 }
    return resultado.rows;
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE team = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function getInvitadosByTeam(team) {
    console.log(`**Query 'getInvitadosByTeam' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where team = '${team}'`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the team: ${team} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'getInvitadosByTeam' must return: 
    // [Array] {
    //				- Each position of the array is a user.
    //				- Each user is an object.
    //				- Each object has the following properties:
    //              [Object] {
    //					- telegram_id (Int)
    //					- user_id (Int)
    //					- name (String)
    //                  - team (String). The same as the parameter.
    //                  - checked (Boolean)
    //                  - suggestion (String)
    //              }
    //			 }
    return resultado.rows;
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET team = ### WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateTeam(telegram_id, team) {
    console.log(`**Query 'updateTeam' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set team = '${team}' where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET team = ### WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateTeamByName(name, team) {
    console.log(`**Query 'updateTeamByName' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set team = '${team}' where name = '${name}'`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET recieve = ### WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateRecieve(telegram_id, recieve) {
    console.log(`**Query 'updateRecieve' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set recieve = ${recieve} where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET recieve = ### WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateRecieveByName(name, recieve) {
    console.log(`**Query 'updateRecieveByName' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set recieve = ${recieve} where name = '${name}'`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET recieve = ###, team = ### WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateRecieveAndTeamByName(name, recieve, team) {
    console.log(`**Query 'updateRecieveAndTeamByName' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set recieve = ${recieve}, team = '${team}' where name = '${name}'`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });
}


// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET checked = not checked WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function switchChecked(telegram_id) {
    console.log(`**Query 'switchChecked' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set checked = not checked where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET checked = not checked WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function switchCheckedByName(name) {
    console.log(`**Query 'switchCheckedByName' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set checked = not checked where name = '${name}'`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// SELECT * FROM "invitado_mas" WHERE checked = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function getCheckedInvitados(checked) {
    console.log(`**Query 'getCheckedInvitados' in invitadosMASModel.`);

    let sql = `select * from "invitado_mas" where checked = ${checked}`;

    let resultado = await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the checked: ${checked} - 'invitadosMASModel'`,
            err
        );
    });

    // The function 'getCheckedInvitados' must return: 
    // [Array] {
    //				- Each position of the array is a user.
    //				- Each user is an object.
    //				- Each object has the following properties:
    //              [Object] {
    //					- telegram_id (Int)
    //					- user_id (Int)
    //					- name (String)
    //                  - team (String)
    //                  - checked (Boolean). The same as the parameter.
    //                  - suggestion (String)
    //              }
    //			 }
    return resultado.rows;
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET suggestion = ### WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateSuggestion(telegram_id, suggestion) {
    console.log(`**Query 'updateSuggestion' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set suggestion = '${suggestion}' where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// UPDATE "invitado_mas" SET suggestion = ### WHERE name = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function updateSuggestionByName(name, suggestion) {
    console.log(`**Query 'updateSuggestionByName' in invitadosMASModel.`);

    let sql = `update "invitado_mas" set suggestion = '${suggestion}' where name = '${name}'`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    });
}

// ---------------------------------------------------------------------------------------------------- //
// DELETE FROM "invitado_mas".
// ---------------------------------------------------------------------------------------------------- //
export async function deleteAllInvitados() {
    console.log(`**Query 'deleteAllInvitados' in invitadosMASModel.`);

    let sql = `delete from "invitado_mas"`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query - 'invitadosMASModel'`,
            err
        );
    });

    console.log("Se eliminaron todos los invitados de la tabla 'invitado_mas'")
}

// ---------------------------------------------------------------------------------------------------- //
// DELETE FROM "invitado_mas" WHERE telegram_id = ###.
// ---------------------------------------------------------------------------------------------------- //
export async function deleteInvitado(telegram_id) {
    console.log(`**Query 'deleteInvitado' in invitadosMASModel.`);

    let sql = `delete from "invitado_mas" where telegram_id = ${telegram_id}`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });

    console.log(`Se ha eliminado el invitado con telegram_id: ${telegram_id}`)
}