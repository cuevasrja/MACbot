import pool from './connection.js';

/**
 * Verify if the user is already registered in the database.
 * The SQL code is SELECT * FROM "invitado_mas" WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 * @returns {Boolean} True if the telegram_id does not exist in the database, false if it exists.
 */
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

/**
 * Verify if the user is already registered in the database using the name.
 * The SQL code is: SELECT * FROM "invitado_mas" WHERE name = ###.
 * @param {String} name 
 * @returns {Boolean} True if the name does not exist in the database, false if it exists.
 */
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

/**
 * Register a new user in the database.
 * The SQL code is: INSERT INTO "invitado_mas" (telegram_id, name) VALUES (###, ###).
 * @param {Integer} telegram_id 
 * @param {String} name 
 */
export async function registerInvitado(telegram_id, name) {
    console.log(`**Query 'registerInvitado' in invitadosMASModel.`);

    let sql = `insert into "invitado_mas" (telegram_id, name) values (${telegram_id}, '${name}')`;

    await pool.query(sql).catch(err => {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    });
}

/**
 * Remove a user from the database.
 * The SQL code is: DELETE FROM "invitado_mas" WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 */
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

/**
 * Get the user's name from the database.
 * The SQL code is: SELECT name FROM "invitado_mas" WHERE telegram_id = ###.
 * @param {String} name 
 * @returns {object} { name: String, team: String, checked: Boolean, suggestion: String, receive: String }

 */
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
    //              - receive (String)
    //			 }

    return resultado.rows[0]
}

/**
 * Find the user's name from the database using the telegram_id.
 * The SQL code is: SELECT name FROM "invitado_mas" WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 * @returns {object} { name: String, team: String, checked: Boolean, suggestion: String, receive: String }
 */
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
    //              - receive (String)
    //			 }

    return resultado.rows[0]
}

/**
 * Show all users in the database.
 * The SQL code is: SELECT * FROM "invitado_mas".
 * @returns {Array} [Object] { name: String, team: String, checked: Boolean, suggestion: String, receive: String }
 */
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
    //                  - receive (String)
    //              }
    //			 }
    return resultado.rows;
}

/**
 * Find all users in the database using the team.
 * The SQL code is: SELECT * FROM "invitado_mas" WHERE team = ###.
 * @param {String} team 
 * @returns {Array} [Object] { name: String, team: String, checked: Boolean, suggestion: String, receive: String }
 */
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
    //                  - receive (String)
    //              }
    //			 }
    return resultado.rows;
}

/**
 * Update the user's team in the database using the telegram_id.
 * The SQL code is: UPDATE "invitado_mas" SET team = ### WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 * @param {String} team 
 */
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

/**
 * Update the user's team in the database using the name.
 * @param {String} name 
 * @param {String} team 
 */
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

/**
 * Update the user's receive and team in the database using the telegram_id.
 * The SQL code is: UPDATE "invitado_mas" SET receive = ###, team = ### WHERE telegram_id = ###.
 * @param {Integer} id 
 * @param {String} receiveValue 
 * @param {String} teamValue 
 */
export async function updateRecord(id, receiveValue, teamValue) {
    console.log(`**Query 'updateRecord' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET receive = $1, team = $2 WHERE telegram_id  = $3', [receiveValue, teamValue, id]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the id: ${id} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Switch the user's checked value in the database using the telegram_id.
 * The SQL code is: UPDATE "invitado_mas" SET checked = not checked WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 */
export async function switchChecked(telegram_id) {
    console.log(`**Query 'switchChecked' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET checked = not checked WHERE telegram_id  = $1', [telegram_id]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Switch the user's checked value in the database using the name.
 * @param {String} name 
 */
export async function switchCheckedByName(name) {
    console.log(`**Query 'switchCheckedByName' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET checked = not checked WHERE name  = $1', [name]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Set the user's checked value to false in the database using the telegram_id.
 * The SQL code is: UPDATE "invitado_mas" SET checked = false WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 */
export async function setCheckedFalse(telegram_id) {
    console.log(`**Query 'setCheckedFalse' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET checked = false WHERE telegram_id  = $1', [telegram_id]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Update the user's suggestion in the database using the telegram_id.
 * @param {Integer} telegram_id 
 * @param {String} suggestion 
 */
export async function updateSuggestion(telegram_id, suggestion) {
    console.log(`**Query 'updateSuggestion' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET suggestion = $1 WHERE telegram_id  = $2', [suggestion, telegram_id]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the telegram_id: ${telegram_id} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Update the user's suggestion in the database using the name.
 * @param {String} name 
 * @param {String} suggestion 
 */
export async function updateSuggestionByName(name, suggestion) {
    console.log(`**Query 'updateSuggestionByName' in invitadosMASModel.`);
    // get a connection from the pool
    const client = await pool.connect();

    try {
        // update the record with the given id
        await client.query('UPDATE "invitado_mas" SET suggestion = $1 WHERE name  = $2', [suggestion, name]);
    } catch (err) {
        throw new Error(
            `There was an error in the user registration query with the name: ${name} - 'invitadosMASModel'`,
            err
        );
    } finally {
        // release the connection back to the pool
        client.release();
    }
}

/**
 * Delete all users in the database.
 * The SQL code is: DELETE FROM "invitado_mas".
 */
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

/**
 * Delete a user in the database using the telegram_id.
 * The SQL code is: DELETE FROM "invitado_mas" WHERE telegram_id = ###.
 * @param {Integer} telegram_id 
 */
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