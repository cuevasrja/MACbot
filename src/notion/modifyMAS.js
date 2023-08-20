import notion from "./connection";
import { INITIALS, RECEIVE, SUGGESTION, TEAM } from "../constants/notionProps";
import dotenv from "dotenv";
dotenv.config();

const NOTION_DB_ID = process.env.NOTION_MAS_DB_ID;

// This function is used to delete all the pages in the database. It is used before starting the assignment.
const deletePagesInDB = async () => {
    const pages = await notion.databases.query({
        database_id: NOTION_DB_ID,
    });
    pages.results.map(async (page) => {
        await notion.pages.update({
            page_id: page.id,
            archived: true,
        });
    });
}

// This function is used to shuffle the list of participants.
const randomSort = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
}

// ? Revisar si participan solo preparadores o si también participa gente externa (Confirmar con JZ)
// This function is used to start the assignment. It returns an object with two arrays, one for each team.
export const startMAS = async () => {
    // We need a list of partcipants. This list has to have an even number of elements.
    const partcipants = await notion.databases.query({
        database_id: NOTION_DB_ID,
    }).map(participant => participant.properties[INITIALS].title[0].plain_text)
    // We clean the database before starting the assignment.
    deletePagesInDB();
    // We create two empty arrays to store the two teams.
    const teamA = [];
    const teamB = [];
    // We iterate over the half of the list of partcipants.
    for (let i = 0; i < partcipants.length / 2; i++) {
        // We assign the first half of the list to team A and the second half to team B.
        teamA.push(partcipants[i]);
        teamB.push(partcipants[i + partcipants.length / 2]);
    }
    const assignedParticipants = {};
    // We assign a random participant from the opposite team to each participant (except themselves).
    // Each participant will have a different random participant.
    for (let i = 0; i < partcipants.length; i++) {
        // We create a ternary operator to assign the opposite team to each participant.
        const team = partcipants[i] === teamA[i] ? teamB : teamA;
        // We create a list of the participants that have not been assigned yet.
        const notAssignedParticipants = team.filter(participant => !Object.values(assignedParticipants).includes(participant));
        // We select a random participant from the list of not assigned participants.
        const randomParticipant = randomSort(notAssignedParticipants)[0];
        // We add the participant and the random participant to the list of assigned participants.
        assignedParticipants[partcipants[i]] = randomParticipant;
        // We create a page in the database for each participant.
        /*
            * [INITIALS]: Is the Title of the page. It is a string. Usually the initials of the participant.
            * [TEAM]: Is a Select property. It can be "A" or "B".
            * [RECIEVE]: Is a String property. It is the initials of the participant that the current participant has to give to.
            * [SUGGESTION]: Is a String property. It is the suggestion that the participant has to give to the participant that they have to give to.
        */
        await notion.pages.create({
            parent: {
                database_id: NOTION_DB_ID,
            },
            properties: {
                [INITIALS]: {
                    title: [
                        {
                            text: {
                                content: partcipants[i],
                            },
                        },
                    ],
                },
                [TEAM]: {
                    select: {
                        name: partcipants[i] === teamA[i] ? "A" : "B",
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
            },
        });
    }
    // We return an object with two arrays, one for each team.
    return {
        teamA: assignedParticipants.slice(0, assignedParticipants.length / 2),
        teamB: assignedParticipants.slice(assignedParticipants.length / 2)
    }
}