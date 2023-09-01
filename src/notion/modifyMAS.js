import notion from "./connection";
import { INITIALS, RECEIVE, SUGGESTION, TEAM } from "../constants/notionProps";
import dotenv from "dotenv";
import { getParticipantsMAS } from "./readMAS";
dotenv.config();

const NOTION_DB_ID = process.env.NOTION_MAS_DB_ID;

/**
 * isParticipantInDB()
 * This function checks if the participant with the given initials is in the database.
 * @param {String} initials . Initials of the participant.
 * @returns {Boolean}
 */
export const isParticipantInDB = async (initials) => {
    try {
        // We get the participant with the given initials.
        const response = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
                property: INITIALS,
                title: {
                    equals: initials,
                },
            },
        });
        // We check if the participant is in the database.
        return response.results.length > 0;
    } catch (error) {
        console.log("Error en isParticipantInDB");
        console.error(error);
    }
}

/**
 * addParticipant()
 * This function adds a participant to the database.
 * @param {String} initials . Initials of the participant.
 */
export const addParticipant = async (initials) => {
    try {
        // We add the participant to the database.
        await notion.pages.create({
            parent: {
                database_id: NOTION_DB_ID,
            },
            properties: {
                [INITIALS]: {
                    title: [
                        {
                            text: {
                                content: initials,
                            },
                        },
                    ],
                },
                [TEAM]: {
                    select: {
                        name: "",
                    },
                },
                [RECEIVE]: {
                    rich_text: [
                        {
                            text: {
                                content: "",
                            },
                        },
                    ],
                },
                [SUGGESTION]: {
                    rich_text: [
                        {
                            text: {
                                content: "",
                            },
                        },
                    ],
                },
            },
        });
    } catch (error) {
        console.log("Error en addParticipant");
        console.error(error);
    }
}

/**
 * deletePagesInDB()
 * This function deletes all the pages in the database.
 * @returns {void}
*/
export const deletePagesInDB = async () => {
    try {
        // We get all the pages in the database.
        const pages = await notion.databases.query({
            database_id: NOTION_DB_ID,
        });
        // We iterate over the pages and archive them.
        pages.results.map(async (page) => {
            await notion.pages.update({
                page_id: page.id,
                archived: true,
            });
        });
    } catch (error) {
        console.log("Error en deletePagesInDB");
        console.error(error);
    }
}

/**
 * randomSort()
 * This function returns an array with the elements of the original array in a random order.
 * @param {String[]} arr . Array of strings.
 * @returns {String[]} . Array of strings in a random order.
 */
const randomSort = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
}

/**
 * startMAS()
 * This function starts the MAS assignment.
 * @returns {Object} . Object with two arrays, one for each team.
 */
export const startMAS = async () => {
    try {
        // We need a list of participants. This list has to have an even number of elements.
        const participantsObj = getParticipantsMAS();
        const participants = participantsObj.map(participant => participant[INITIALS].title[0].plain_text);
        // // We clean the database before starting the assignment.
        // deletePagesInDB();
        // We create two empty arrays to store the two teams.
        const teamA = [];
        const teamB = [];
        // We iterate over the half of the list of participants.
        for (let i = 0; i < participants.length / 2; i++) {
            // We assign the first half of the list to team A and the second half to team B.
            teamA.push(participants[i]);
            teamB.push(participants[i + participants.length / 2]);
        }
        const assignedParticipants = {};
        // We assign a random participant from the opposite team to each participant (except themselves).
        // Each participant will have a different random participant.
        for (let i = 0; i < participants.length; i++) {
            // We create a ternary operator to assign the opposite team to each participant.
            const team = participants[i] === teamA[i] ? teamB : teamA;
            // We create a list of the participants that have not been assigned yet.
            const notAssignedParticipants = team.filter(participant => !Object.values(assignedParticipants).includes(participant));
            // We select a random participant from the list of not assigned participants.
            const randomParticipant = randomSort(notAssignedParticipants)[0];
            // We add the participant and the random participant to the list of assigned participants.
            assignedParticipants[participants[i]] = randomParticipant;
            // We create a page in the database for each participant.
            /*
                * [INITIALS]: Is the Title of the page. It is a string. Usually the initials of the participant.
                * [TEAM]: Is a Select property. It can be "A" or "B".
                * [RECIEVE]: Is a String property. It is the initials of the participant that the current participant has to give to.
                * [SUGGESTION]: Is a String property. It is the suggestion that the participant has to give to the participant that they have to give to.
            */
            await notion.pages.update({
                page_id: participantsObj[i].id,
                properties: {
                    [INITIALS]: {
                        title: [
                            {
                                text: {
                                    content: participants[i],
                                },
                            },
                        ],
                    },
                    [TEAM]: {
                        select: {
                            name: participants[i] === teamA[i] ? "A" : "B",
                        },
                    },
                    [RECEIVE]: {
                        rich_text: [
                            {
                                text: {
                                    content: randomParticipant,
                                },
                            },
                        ]
                    },
                    [SUGGESTION]: {
                        rich_text: [
                            {
                                text: {
                                    content: "",
                                },
                            },
                        ],
                    },
                }
            });
        }
        // We return an object with two arrays, one for each team.
        return {
            teamA: assignedParticipants.slice(0, assignedParticipants.length / 2),
            teamB: assignedParticipants.slice(assignedParticipants.length / 2)
        }
    } catch (error) {
        console.log("Error en startMAS");
        console.error(error);
    }
}

/**
 * updateSuggestion()
 * This function updates the suggestion of the participant with the given initials.
 * @param {String} initials . Initials of the participant.
 * @param {String} suggestion . Suggestion of the participant.
 */
export const updateSuggestion = async (initials, suggestion) => {
    try {
        // We get the participant with the given initials.
        const participant = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
                property: INITIALS,
                title: {
                    equals: initials,
                },
            },
        });
        // We update the suggestion of the participant.
        await notion.pages.update({
            page_id: participant.results[0].id,
            properties: {
                [SUGGESTION]: {
                    rich_text: [
                        {
                            text: {
                                content: suggestion,
                            },
                        },
                    ],
                },
            },
        });
    } catch (error) {
        console.log("Error en updateSuggestion");
        console.error(error);
    }
}