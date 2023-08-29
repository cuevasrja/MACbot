import { INITIALS, RECEIVE, TEAM } from "../constants/notionProps.js";
import notion from "./connection.js";
import dotenv from "dotenv"

dotenv.config()
const NOTION_DB_ID = process.env.NOTION_MAS_DB_ID

/**
    Formato de la base de datos:
    - Iniciales: Titulo
    - Equipo: select
    - Recibe: rich_text, iniciales del preparador
    - Sugerencias: rich_text
*/

/**
 * findPreparer()
 * This function returns the preparer with the given initials.
 * @param {String} initials . Initials of the preparer.
 * @returns {Object} . Object with the preparer and its properties.
 */
const findPreparer = async (initials) => {
    try {
        // We get the preparer with the given initials.
        const response = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
                property: INITIALS,
                title: {
                    equals: initials
                }
            }
        })
        return response.results[0]
    } catch (error) {
        console.log("Error en findPreparer")
        console.error(error)
    }
}

/**
 * showTeamMembers()
 * This function returns an array with the initials of the members of the team of the preparer with the given initials.
 * @param {String} initials . Initials of the preparer.
 * @returns {String[]} . Array with the initials of the members of the team of the preparer with the given initials.
 */
export const showTeamMembers = async (initials) => {
    try {
        // We get the preparer with the given initials.
        const preparer = await findPreparer(initials)
        // We get the team of the preparer.
        const preparerTeam = preparer.properties[TEAM].select.name
        // We get the members of the team.
        const team = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
                property: TEAM,
                select: {
                    equals: preparerTeam
                }
            }
        })
        // We return an array with the initials of the members of the team without the initials of the preparer.
        return team.results
            .filter(member => member.properties[INITIALS].title[0].plain_text !== initials)
            .map(member => member.properties[INITIALS].title[0].plain_text)
    } catch (error) {
        console.log("Error en showTeamMembers")
        console.error(error)
    }
}

/**
 * preparerGivesTo()
 * This function returns the initials of the preparer that the preparer with the given initials has to give to.
 * @param {String} initials . Initials of the preparer.
 * @returns {String} . Initials of the preparer that the preparer with the given initials has to give to.
 */
export const preparerGivesTo = async (initials) => {
    try {
        // We get the preparer with the given initials.
        const preparer = await findPreparer(initials)
        // We get the initials of the preparer that the preparer with the given initials has to give to.
        const receiver = preparer.properties[RECEIVE].rich_text[0].plain_text
        return receiver
    } catch (error) {
        console.log("Error en preparerGivesTo")
        console.error(error)
    }
}

/**
 * getParticipantsMAS()
 * This function returns an array with the initials of the participants of the MAS.
 * @returns {String[]} . Array with the initials of the participants of the MAS.
 */
export const getParticipantsMAS = async () => {
    try {
        const response = await notion.databases.query({
            database_id: NOTION_DB_ID,
        })
        return response.results
    } catch (error) {
        console.log("Error en getParticipantsMAS")
        console.error(error)
    }
}