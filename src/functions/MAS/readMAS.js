import { getInvitadoByName, getInvitadosByTeam } from "../../models/invitadosMASModel.js"

export const MASMesssage = async (name) => {
    const invitado = await getInvitadoByName(name)
    const teamMembers = (await getInvitadosByTeam(invitado.team)).map(invitado => invitado.name)
    const givesTo = invitado.recieve
    let response = `El equipo de ${name} está conformado por: ${teamMembers.join(", ")}. \n`
    response += `${name}, te toca regalarle a: ${givesTo} \n`
    return response
}