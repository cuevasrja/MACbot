import { INITIALS, RECEIVE, TEAM } from "../constants/notionProps";
import notion from "./connection";
import dotenv from "dotenv"

dotenv.config()
const NOTION_DB_ID = process.env.NOTION_MAS_DB_ID

const findPreparer = async (initials) => {
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
    const receiverId = preparer.properties[RECEIVE].rich_text[0].plain_text
    const receiver = await notion.databases.query({
        database_id: NOTION_DB_ID,
        filter: {
            property: RECEIVE,
            rich_text: {
                equals: receiverId
            }
        }
    })
    return receiver.results[0].properties[INITIALS].title[0].plain_text
}