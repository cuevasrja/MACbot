import { TEAM_A, TEAM_B } from "../../constants/infoMAS.js"
import { getInvitadoByName, getInvitadosByTeam, showAllInvitados } from "../../models/invitadosMASModel.js"

export const MASMesssage = async (name) => {
    const invitado = await getInvitadoByName(name)
    const teamMembers = (await getInvitadosByTeam(invitado.team)).map(invitado => invitado.name)
    const givesTo = invitado.recieve
    let response = `El equipo de ${name} está conformado por: ${teamMembers.join(", ")}. \n`
    response += `${name}, te toca regalarle a: ${givesTo} \n`
    return response
}

export const getTeams = async () => {
    const invitados = await showAllInvitados()
    const teamA = invitados.filter(invitado => invitado.team === TEAM_A).map(invitado => invitado.name)
    const teamB = invitados.filter(invitado => invitado.team === TEAM_B).map(invitado => invitado.name)
    return {
        teamA: teamA,
        teamB: teamB
    }
}