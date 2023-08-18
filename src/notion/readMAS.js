import { INITIALS, RECEIVE, TEAM } from "../constants/notionProps";
import notion from "./connection";
import dotenv from "dotenv"

dotenv.config()
const NOTION_DB_ID = process.env.NOTION_DB_ID

const findPreparer = async (initials) => {
    const response = await notion.databases.query({
        database_id: NOTION_DB_ID,
        filter: {
            property: INITIALS,
            // ? Funciona con equals y con contains. Verificar si la propiedad es rich_text o title
            rich_text: {
                equals: initials
            }
        }
    })
    return response.results[0]

}

export const showTeamMembers = async (initials) => {
    const preparer = await findPreparer(initials)
    const preparerTeam = preparer.properties[TEAM].select.name
    const team = await notion.databases.query({
        database_id: NOTION_DB_ID,
        filter: {
            property: TEAM,
            select: {
                equals: preparerTeam
            }
        }
    })
    return team.results
        .filter(member => member.properties[INITIALS].title[0].plain_text !== initials)
        .map(member => member.properties[INITIALS].title[0].plain_text)
}

export const preparerGivesTo = async (initials) => {
    const preparer = await findPreparer(initials)
    const receiverId = preparer.properties[RECEIVE].relation[0].id
    const receiver = await notion.databases.query({
        database_id: NOTION_DB_ID,
        filter: {
            property: RECEIVE,
            relation: {
                contains: receiverId
            }
        }
    })
    return receiver.results[0].properties[INITIALS].title[0].plain_text
}