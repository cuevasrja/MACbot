import notion from "./connection.js";
import dotenv from "dotenv";
import { weekDays } from "../constants/notionProps.js";
dotenv.config();

const NOTION_DB_ID = process.env.NOTION_TAQUILLA_DB_ID;

const BLOCK = "Bloque";

/**
    Formato de la base de datos:
    - Bloque horario: Titulo
    - Lunes: rich_text, iniciales del preparador
    - Martes: rich_text, iniciales del preparador
    - Miércoles: rich_text, iniciales del preparador
    - Jueves: rich_text, iniciales del preparador
    - Viernes: rich_text, iniciales del preparador
*/

/**
 * preparersOfTheDay()
 * This fuction return an object with the initials of the preparers of the day. 
 * The value of each preparer is an array with the hours that the preparer is in taquilla.
 * @param {object} response . Response of the query to the database of taquilla.
 * @param {String} day . Day of the week (Lunes, Martes, Miércoles, Jueves, Viernes)
 * @returns {object} Object with the initials of the preparers of the day.
 */
const preparersOfTheDay = (response, day) => {
    // We get the initials of the preparers of the day.
    const preparers = [...new Set(response.results.map(result => result.properties[day].rich_text[0].plain_text))];
    // We create an object with the initials of the preparers as keys and an empty array as value.
    const preparersOfTheDay = {};
    // We fill the array with the hours that the preparer is in taquilla.
    preparers.forEach(preparer => preparersOfTheDay[preparer] = []);
    response.results.forEach(result => {
        const preparer = result.properties[day].rich_text[0].plain_text;
        const hour = result.properties[BLOCK].title[0].plain_text;
        preparersOfTheDay[preparer].push(hour);
    });
    return preparersOfTheDay;
}

/**
 * taquillaSchedule()
 * This function return an object with the initials of the preparers of the day.
 * @returns {Promise<object>} Object with the initials of the preparers of the day.
 */
export const taquillaSchedule = async () => {
    try {
        // First, we get the day of the week. It has to be between 1 and 5.
        const date = new Date();
        const hours = date.getHours()
        date.setHours(hours - 4);
        const day = weekDays[date.getDay() - 1];
        const response = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
                property: day,
                title: {
                    is_not_empty: true
                },
            },
        });
        return preparersOfTheDay(response, day);
    } catch (error) {
        console.log("Error en taquillaSchedule");
        console.error(error);
    }
}

/**
 * Show all the taquilla schedule.
 * @returns {Promise<object[]>} Array with all the taquilla schedule.
 */
export const taquillaDev = async () => {
    try {
        const response = await notion.databases.query({
            database_id: NOTION_DB_ID,
        });
        return response.results;
    } catch (error) {
        console.log("Error en taquillaDev");
        console.error(error);
    }
}