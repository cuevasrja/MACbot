import { TEAM_A, TEAM_B, questTime } from "../../constants/infoMAS.js";
import { getInvitadoByName, showAllInvitados, updateRecieveAndTeamByName } from "../../models/invitadosMASModel.js";
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
 * @returns {Object} . Object with two arrays, one for each team.
 */
export const startMAS = async () => {
    try {
        // We need a list of participants. This list has to have an even number of elements.
        const participantsOrdered = (await showAllInvitados()).map((invitado) => invitado.name);
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
        for (let i = 0; i < participants.length; i++) {
            // We create a ternary operator to assign the opposite team to each participant.
            const team = participants[i] === teamA[i] ? teamB : teamA;
            // We create a list of the participants that have not been assigned yet.
            const notAssignedParticipants = team.filter(participant => !Object.values(assignedParticipants).includes(participant));
            // We select a random participant from the list of not assigned participants.
            const randomParticipant = randomSort(notAssignedParticipants)[0];
            // We add the participant and the random participant to the list of assigned participants.
            assignedParticipants[participants[i]] = randomParticipant;
            // We create a ternary operator to assign the team to each participant.
            const teamName = participants[i] === teamA[i] ? TEAM_A : TEAM_B;
            // We update the database with the assigned participants.
            await updateRecieveAndTeamByName(participants[i], randomParticipant, teamName)
        }
        // We return an object with two arrays, one for each team.
        return {
            teamA: teamA,
            teamB: teamB,
        }
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
        const memberID = await getInvitadoByName(member).telegram_id
        let response = `Bienvenido al equipo ${teamName} de MAS. \n\n`
        response += await MASMesssage(member) + "\n\n"
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
    const unchecked = invitados.filter(invitado => !invitado.checked)
    const randomsUnchecked = randomSort(unchecked).slice(0, 3)
    randomsUnchecked.forEach(async (invitado) => {
        const name = invitado.name
        const givesTo = await getInvitadoByName(invitado.recieve)
        const desition = randomTrueFalse()
        let oppositeTeam = randomSort(invitados.filter(opposite => opposite.team !== invitado.team))
        if (!desition) {
            oppositeTeam = oppositeTeam.filter(opposite => opposite.name !== givesTo.name)
        }
        const [first, second, third] = oppositeTeam.slice(0, 3)

        // TODO: Enviar botones con los tres posibles nombres
        bot.sendMessage(invitado.telegram_id, `¿Quién crees que es tu amigo invisible? (Selecciona una opción)`)

        switchCheckedByName(name)
    })
    setInterval(async () => {
        await MASQuest()
    }, questTime)
}