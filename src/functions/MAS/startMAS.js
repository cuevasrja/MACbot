import { TEAM_A, TEAM_B, questTime } from "../../constants/infoMAS.js";
import { showAllInvitados, switchCheckedByName, updateRecord } from "../../models/invitadosMASModel.js";
import bot from "../../settings/app.js";
import { MASPlayingStatus, MASQuestStatus, setMASQuestStatus, stopMASInterval } from "./basicsMAS.js";
import { MASMesssage } from "./readMAS.js";
import { sendMessage } from "../sendMessage.js";

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
 * It assigns a random participant from the opposite team to each participant (except themselves).
 * Each participant will have a different random participant.
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
        message += `\n\nEl equipo de los ${TEAM_A} está conformado por: \n - ${teamA.join("\n - ")}`;
        message += `\n\nEl equipo de los ${TEAM_B} está conformado por: \n - ${teamB.join("\n - ")}`;
        return message;
    } catch (error) {
        console.log("Error en teamMessage");
        console.error(error);
    }
}

/**
 * sendTeamMessage()
 * This function sends a message to each participant with the team they are in and the participant they have to give a gift to.
 * @param {String} teamName . String with the name of the team.
 * @param {Object[]} teamInfo . Array of objects with the name, team and receive of each participant.
 */
export const sendTeamMessage = (teamName, teamInfo) => {
    const team = teamInfo.map(invitado => invitado.name)
    teamInfo.forEach((member) => {
        const memberID = member.telegram_id
        let response = `¡Bienvenido al equipo de los ${teamName}! \n\n`
        response += MASMesssage(member, team) + "\n\n"
        response += "Recuerda que puedes usar el comando /MAS en cualquier momento para ver esta información y la sugerencia de regalo."
        bot.sendMessage(memberID, response)
        console.log(`Mensaje enviado a ${member.name}`)
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

/**
 * MASQuest()
 * This function sends a message to each participant with three options, one of them could be the correct answer.
 * The correct answer is the participant they have to give a gift to.
 */
export const MASQuest = async () => {
    console.log("MASQuest")
    // We check if the MAS is active
    if (!MASPlayingStatus() || !MASQuestStatus()) return
    const invitados = await showAllInvitados()
    // We take the first three unchecked invitados
    const unchecked = invitados.filter(invitado => !invitado.checked)
    const randomsUnchecked = unchecked.length > 3 ? randomSort(unchecked).slice(0, 3) : randomSort(unchecked)
    if (randomsUnchecked.length === 0) {
        console.log("No hay más invitados por comprobar")
        setMASQuestStatus(false)
        stopMASInterval()
        return
    }
    console.log(randomsUnchecked)
    // We send a message to each of the three invitados, to try to guess their secret santa between 3 random invitados
    randomsUnchecked.forEach(async (invitado) => {
        const name = invitado.name
        await switchCheckedByName(name)
        const givesTo = invitados.find(inv => inv.name === invitado.receive)
        let oppositeTeam = randomSort(invitados.filter(opposite => opposite.team !== invitado.team))
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
        await bot.sendMessage(invitado.telegram_id, `¡La vidente se te ha aparecido en sueños! Es tu oportunidad de preguntarle quien crees que es tu MACamigo secreto (Selecciona una opción).`, opts)

        // We create a listener for the callback query, to check if the invitado has selected an option.
        bot.on("callback_query", async (query) => {
            // We get the chatID of the query.
            const chatID = query.message.chat.id
            // We check if the query is from the invitado we are looking for.
            if (query.from.id != invitado.telegram_id) return
            const nameSelected = query.data
            // We erase the listener, to avoid multiple answers.
            bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatID, message_id: query.message.message_id })
            let response = `Has elegido a ${nameSelected} como tu amigo secreto.\n\n`
            // We send a message to the invitado if they have selected the "correct" option or not.
            if (nameSelected == givesTo.name) {
                response += `¡Has acertado! (tal vez...) Tu MACamigo secreto es ${nameSelected} (o quizá no...).`
            }
            else {
                response += randomTrueFalse() ?
                    `¡Has acertado! (tal vez...) Tu MACamigo secreto es ${nameSelected} (o quizá no...).` :
                    `Lástima. Tu MACamigo secreto no es ${nameSelected}.`
            }
            await sendMessage(chatID, response)
        })
    })
}
