import { TEAM_A, TEAM_B, questTime } from "../../constants/infoMAS.js"
import { JEFE } from "../../constants/preparadores.js"
import rules from "../../messages/rulesMAS.js"
import { getInvitadoByName, getInvitadoByTelegramID, registerInvitado, removeInvitado, updateSuggestion, verifyInvitadoID, verifyInvitadoName } from "../../models/invitadosMASModel.js"
import { getAllPreparadores } from "../../models/preparadorModel.js"
import bot from "../../settings/app.js"
import { MASMesssage, getTeams } from "./readMAS.js"
import { MASQuest, sendTeamMessage, startMAS } from "./startMAS.js"

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is a preparador or an invitado
    // If the user is not a preparador or an invitado, we send a message and cancel the function
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No eres invitado, no puedes usar este comando")
        return
    }
    const invitado = await getInvitadoByTelegramID(chatID)
    const name = invitado.name
    const givesTo = invitado.recieve
    const suggestions = (await getInvitadoByName(givesTo)).suggestion
    let response = await MASMesssage(name)
    response += `Te recomiendo regalarle: ${suggestions.length === 0 ? "Nada en particular" : suggestions}`
    response += `\n\nA ti te gustaria que te regalen: ${invitado.suggestion.length === 0 ? "Nada en particular" : invitado.suggestion}`
    response += "\n\nRecuerda que para ver esta informacion y la sugerencia de regalo en cualquier momento puedes usar el comando /MAS"
    bot.sendMessage(chatID, response)
})

let isMASPlaying = false

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@start command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@start/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    // const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === JEFE).telegram_id
    // // If the user is not the jefe, we send a message and cancel the function
    // if (chatID !== jefeChatID) {
    //     bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
    //     return
    // }
    // We check if MAS is already playing
    if (isMASPlaying) {
        bot.sendMessage(chatID, "MAS ya está jugando")
        return
    }
    const { teamA, teamB } = await startMAS()
    isMASPlaying = true
    console.log("Se ha iniciado el sorteo de MAS")
    sendTeamMessage(teamA, TEAM_A)
    sendTeamMessage(teamB, TEAM_B)
    console.log("Se ha enviado el mensaje a los equipos")

    // Cada 15 minutos se les pregunta a 3 personas al azar quien creen que es su amigo invisible
    setInterval(async () => {
        await MASQuest()
    }, questTime)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@stop command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@stop/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    // const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === JEFE).telegram_id
    // // If the user is not the jefe, we send a message and cancel the function
    // if (chatID !== jefeChatID) {
    //     bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
    //     return
    // }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando")
        return
    }
    isMASPlaying = false
    console.log("MAS ha terminado")
    bot.sendMessage(chatID, "MAS ha terminado")
})

let isMASActive = false

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@switch command and switches the MAS state.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@switch/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    // const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === JEFE).telegram_id
    // // If the user is not the jefe, we send a message and cancel the function
    // if (chatID !== jefeChatID) {
    //     bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
    //     return
    // }
    isMASActive = !isMASActive
    const message = isMASActive ? "MAS activo" : "MAS inactivo"
    bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@add [name] command and adds a new member to the list of members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@add (.+)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if MAS registration is active
    if (!isMASActive) {
        bot.sendMessage(chatID, "El registro de MAS está inactivo")
        return
    }
    // We take the name of the new member
    const name = match.slice(1).join(" ").trim()

    // We check if the name is already in use
    const nameNotUsed = await verifyInvitadoName(name)
    // We check if the telegram id is already in use
    const TelegramIDNotUsed = await verifyInvitadoID(chatID)

    // If the name and the telegram id are not in use, we register the new member.
    // Otherwise, we send a message to the user and cancel the function.
    if (!nameNotUsed && !TelegramIDNotUsed) {
        bot.sendMessage(chatID, "Ya estás registrado en MAS")
        return
    }
    if (!nameNotUsed) {
        bot.sendMessage(chatID, "Ya hay alguien registrado con ese nombre")
        return
    }
    if (!TelegramIDNotUsed) {
        bot.sendMessage(chatID, "Ya hay alguien registrado con ese telegram id")
        return
    }

    // We register the new member in the database
    registerInvitado({ telegram_id: chatID, name: name })
    bot.sendMessage(chatID, `Se ha registrado a ${name} como miembro de MAS`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@remove command and removes a member from the list of members of MAS with the telegram id.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@remove/, async msg => {
    const chatID = msg.chat.id
    // We check if MAS registration is active
    if (!isMASActive) {
        bot.sendMessage(chatID, "El registro de MAS está inactivo")
        return
    }
    // We verify that the user is registered
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS")
        return
    }
    // We get the name of the member
    const name = (await getInvitadoByTelegramID(chatID)).name
    // We remove the member from the database
    removeInvitado(chatID)
    bot.sendMessage(chatID, `Se ha eliminado a ${name} de la lista de miembros de MAS`)
    console.log(`Se ha eliminado a ${name} de la lista de miembros de MAS`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@teams command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@teams/, async msg => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando")
        return
    }
    // We get the members of the teams
    const { teamA, teamB } = await getTeams()
    let message = `Hay ${teamA.length + teamB.length} participantes distribuidos en dos equipos.`
    message += `\n\nEl equipo ${TEAM_A} está formado por: \n - ${teamA.join("\n - ")}`
    message += `\n\nEl equipo ${TEAM_B} está formado por: \n - ${teamB.join("\n - ")}`
    bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@restart command and restarts the MAS if the bot has been restarted or shut down. (Only for the jefe)
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@restart/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === JEFE).telegram_id
    // If the user is not the jefe, we send a message and cancel the function
    if (chatID !== jefeChatID) {
        bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
        return
    }
    isMASPlaying = true
    bot.sendMessage(chatID, "MAS ha sido reiniciado")
    console.log("MAS ha sido reiniciado")
    setInterval(async () => {
        await MASQuest()
    }, questTime)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@sug [suggestion] command and adds a suggestion to the member of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@sug (.+)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando")
        return
    }
    // We get the invitado
    const invitado = await getInvitadoByTelegramID(chatID)
    // We get the name of the member
    const name = invitado.name
    // We get the suggestion
    const suggestion = match.slice(1).join(" ").trim()
    // We add the suggestion to the member
    updateSuggestion(chatID, suggestion)
    console.log("Alguien ha añadido una sugerencia")
    bot.sendMessage(chatID, `${name}, se ha añadido la sugerencia: ${suggestion}`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@help command and sends a message with the rules and instructions of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@help/, async msg => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS")
        return
    }
    bot.sendMessage(chatID, rules)
})