import { TEAM_A, TEAM_B } from "../../constants/infoMAS.js"
import { showAllInvitados } from "../../models/invitadosMASModel.js"

/**
 * MASMessage(member, team)
 * This function returns a string with the team members and the name of the person to whom they have to give a gift.
 * @param {Object} member . Object with the name, team and receive of the member.
 * @param {String[]} team . Array of strings with the names of the members of the team.
 * @returns 
 */
export const MASMesssage = (member, team) => {
    const name = member.name
    const teamName = member.team
    const givesTo = member.receive
    let response = `El equipo de los ${teamName} está conformado por: ${team.join(", ")}. \n\n`
    response += `${name}, te toca ofrendarle a: ${givesTo} \n`
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
