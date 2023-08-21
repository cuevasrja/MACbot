import notion from "./connection";
import dotenv from "dotenv";
dotenv.config();

const NOTION_DB_ID = process.env.NOTION_TAQUILLA_DB_ID;

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCK = "Hora";

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
 * @param {Object} response . Resultado de la consulta a la base de datos de Notion en taquillaSchedule
 * @returns {Object} Object with the initials of the preparers of the day.
 */
const preparersOfTheDay = (response) => {
    // First, we get the day of the week. It has to be between 0 and 4.
    const day = weekDays[new Date().getDay() - 1];
    // We get the initials of the preparers of the day.
    const preparers = [...new Set(...response.results.map(result => result.properties[day].rich_text[0].plain_text))];
    // We create an object with the initials of the preparers as keys and an empty array as value.
    const preparersOfTheDay = {};
    // We fill the array with the hours that the preparer is in taquilla.
    preparers.forEach(preparer => preparersOfTheDay[preparer] = []);
    response.results.forEach(result => {
        const preparer = result.properties[day].rich_text[0].plain_text;
        preparersOfTheDay[preparer].push(result.properties[BLOCK].title[0].plain_text);
    }
    );
    return preparersOfTheDay;
}

/**
 * taquillaSchedule()
 * This function return an object with the initials of the preparers of the day.
 * @returns {Object} Object with the initials of the preparers of the day.
 */
export const taquillaSchedule = async () => {
    // First, we get the day of the week. It has to be between 0 and 4.
    const day = weekDays[new Date().getDay() - 1];
    const response = await notion.databases.query({
        database_id: NOTION_DB_ID,
        filter: {
            property: day,
            title: {
                is_not_empty: true
            },
        },
    });
    return preparersOfTheDay(response);
}