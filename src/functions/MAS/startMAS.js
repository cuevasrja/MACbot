import { TEAM_A, TEAM_B, questTime } from "../../constants/infoMAS.js";
import { getInvitadoByName, showAllInvitados, switchCheckedByName, updateRecord } from "../../models/invitadosMASModel.js";
import bot from "../../settings/app.js";
import { MASPlayingStatus } from "./basicsMAS.js";
import { MASMesssage } from "./readMAS.js";

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
 * @returns {String[][]} . Array of two arrays of strings, one for each team.
 */
export const startMAS = async () => {
    try {
        // We need a list of participants. This list has to have an even number of elements.
        const invitados = await showAllInvitados()
        const participantsOrdered = invitados.map((invitado) => invitado.name);
        const participants = randomSort(participantsOrdered);
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
        participants.forEach(async (part, i) => {
            // We create a ternary operator to assign the opposite team to each participant.
            const team = part === teamA[i] ? teamB : teamA;
            // We create a list of the participants that have not been assigned yet.
            const notAssignedParticipants = team.filter(participant => !Object.values(assignedParticipants).includes(participant));
            // We select a random participant from the list of not assigned participants.
            const randomParticipant = randomSort(notAssignedParticipants)[0];
            // We add the participant and the random participant to the list of assigned participants.
            assignedParticipants[part] = randomParticipant;
            // We create a ternary operator to assign the team to each participant.
            const teamName = part === teamA[i] ? TEAM_A : TEAM_B;
            // We found the telegram_id of the participant.
            const participantID = invitados.find(invitado => invitado.name === part).telegram_id
            // We update the database with the assigned participants.
            console.log(participantID, randomParticipant, teamName);
            await updateRecord(participantID, randomParticipant, teamName)
            // await updateRecieve(participantID, randomParticipant)
            // await updateTeam(participantID, teamName)
        })
        // We return an array with the two teams.
        const teams = [teamA, teamB]
        return teams
    } catch (error) {
        console.log("Error en startMAS");
        console.error(error);
    }
}

/**
 * teamMessage()
 * This function returns a message with the two teams.
 * @param {String[]} teamA . Array of strings with the names of the participants in team A.
 * @param {String[]} teamB . Array of strings with the names of the participants in team B.
 * @returns {String} . Message with the two teams.
 */
export const teamMessage = (teamA, teamB) => {
    try {
        let message = `Hay ${teamA.length + teamB.length} participantes distribuidos en dos equipos.`;
        message += `\n\nEl equipo ${TEAM_A} está formado por: \n - ${teamA.join("\n - ")}`;
        message += `\n\nEl equipo ${TEAM_B} está formado por: \n - ${teamB.join("\n - ")}`;
        return message;
    } catch (error) {
        console.log("Error en teamMessage");
        console.error(error);
    }
}

/**
 * sendTeamMessage()
 * This function sends a message to each participant with the team they are in and the participant they have to give a gift to.
 * @param {String[]} team . Array of strings with the names of the participants in the team.
 * @param {String} teamName . String with the name of the team.
 */
export const sendTeamMessage = async (team, teamName) => {
    team.forEach(async (member) => {
        const memberID = (await getInvitadoByName(member)).telegram_id
        let response = `Bienvenido al equipo ${teamName} de MAS. \n\n`
        response += (await MASMesssage(member)) + "\n\n"
        response += "Recuerda que para ver esta informacion y la sugerencia de regalo en cualquier momento puedes usar el comando /MAS"
        bot.sendMessage(memberID, response)
    })
}

/**
 * randomTrueFalse()
 * This function returns a random boolean.
 * @returns {Boolean}
 */
const randomTrueFalse = () => {
    return Math.random() < 0.5
}

export const MASQuest = async () => {
    // We check if the MAS is active
    if (!MASPlayingStatus()) return
    const invitados = await showAllInvitados()
    // We take the first three unchecked invitados
    const unchecked = invitados.filter(invitado => !invitado.checked)
    const randomsUnchecked = randomSort(unchecked).slice(0, 3)
    // We send a message to each of the three invitados, to try to guess their secret santa between 3 random invitados
    randomsUnchecked.forEach(async (invitado) => {
        const name = invitado.name
        const givesTo = await getInvitadoByName(invitado.recieve)
        // We create a random boolean to decide if we show the correct answer or not. The correct answer will be a false option.
        const desition = randomTrueFalse()
        let oppositeTeam = randomSort(invitados.filter(opposite => opposite.team !== invitado.team))
        // If the desition is false, we remove the correct answer from the list of options.
        if (!desition) {
            oppositeTeam = oppositeTeam.filter(opposite => opposite.name !== givesTo.name)
        }
        const [first, second, third] = oppositeTeam.slice(0, 3).map(opposite => opposite.name)

        // We create the options for the message, with the three options. 
        // The text of the options is the name of the invitado.
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: first,
                            callback_data: first
                        }
                    ],
                    [
                        {
                            text: second,
                            callback_data: second
                        }
                    ],
                    [
                        {
                            text: third,
                            callback_data: third
                        }
                    ]
                ]
            }
        }
        // We send a message to the invitado with the three options
        bot.sendMessage(invitado.telegram_id, `¿Quién crees que es tu amigo invisible? (Selecciona una opción)`, opts)

        // We create a listener for the callback query, to check if the invitado has selected an option.
        bot.on("callback_query", async (query) => {
            // We get the chatID of the query.
            const chatID = query.message.chat.id
            // We check if the query is from the invitado we are looking for.
            if (query.from.id !== invitado.telegram_id) return
            const nameSelected = query.data
            // We erase the listener, to avoid multiple answers.
            bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatID, message_id: query.message.message_id })
            let response = `Has elegido a ${nameSelected} como tu amigo invisible.\n\n`
            // We send a message to the invitado if they have selected the "correct" option or not.
            response += desition ?
                `¡Has acertado! Tu amigo invisible es ${nameSelected}. (O te estoy mintiendo? xD)` :
                `Tu amigo invisible no es ${nameSelected}.`
            bot.sendMessage(invitado.telegram_id, response)
        })

        await switchCheckedByName(name)
    })
    setInterval(async () => {
        await MASQuest()
    }, questTime)
}