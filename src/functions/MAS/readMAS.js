import { TEAM_A, TEAM_B } from "../../constants/infoMAS.js"
import { getInvitadoByName, getInvitadosByTeam, showAllInvitados } from "../../models/invitadosMASModel.js"

/**
 * MASMessage()
 * This function returns a string with the team members and the name of the person to whom they have to give a gift.
 * @param {*} name 
 * @returns 
 */
export const MASMesssage = async (name) => {
    const invitado = await getInvitadoByName(name)
    const teamMembers = (await getInvitadosByTeam(invitado.team)).map(invitado => invitado.name)
    const givesTo = invitado.receive
    let response = `El equipo de ${name} está conformado por: ${teamMembers.join(", ")}. \n`
    response += `${name}, te toca regalarle a: ${givesTo} \n`
    return response
}

/**
 * getTeams()
 * This function returns an object with the two teams.
 * @returns {Object}. Object with the two teams.
 */
export const getTeams = async () => {
    const invitados = await showAllInvitados()
    const teamA = invitados.filter(invitado => invitado.team === TEAM_A).map(invitado => invitado.name)
    const teamB = invitados.filter(invitado => invitado.team === TEAM_B).map(invitado => invitado.name)
    return {
        teamA: teamA,
        teamB: teamB
    }
}