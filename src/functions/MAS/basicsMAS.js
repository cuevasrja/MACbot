import { TEAM_A, TEAM_B, questTime, BIENVENIDA } from "../../constants/infoMAS.js"
import { isJefe } from "../../constants/preparadores.js"
import rules from "../../messages/rulesMAS.js"
import { deleteAllInvitados, getInvitadoByTelegramID, registerInvitado, removeInvitado, showAllInvitados, updateSuggestion, verifyInvitadoID, verifyInvitadoName } from "../../models/invitadosMASModel.js"
import bot from "../../settings/app.js"
import { MASMesssage, getTeams, isPlayable } from "./readMAS.js"
import { MASQuest, startMAS } from "./startMAS.js"
import { sendMessage } from "../sendMessage.js"
import { MAS_ALREADY_REGISTERED, MAS_FINISHED, MAS_NOT_PLAYING, MAS_NOT_REGISTERED, MAS_PLAYING, MAS_REGIST_ACTIVE, MAS_REGIST_DISABLED, MAS_REGIST_INACTIVE, MAS_RESET, NAME_TOO_LONG, NAME_USED, NOT_NAME_GIVEN, NOT_SUGGESTION_GIVEN, SUGGESTION_TOO_LONG } from "../../messages/MASMessages.js"
import { NOT_INVITADO, NOT_JEFE } from "../../messages/permissions.js"

let isMASPlaying = false
let isMASQuest = true

let intervalID = null

if (await isPlayable()) {
    console.log("El juego de MAS fue reinicado automáticamente.")
    isMASPlaying = true
    isMASQuest = true
    intervalID = setInterval(async () => {
        await MASQuest()
    }, questTime)
}

/**
 * Stop the interval of MASQuest and set the intervalID to null.
 * @returns {void}
 */
export const stopMASInterval = () => {
    clearInterval(intervalID)
    intervalID = null
}
/**
 * Check if MAS is playing.
 * @returns {boolean} . True if MAS is playing, false otherwise.
 */
export const MASPlayingStatus = () => isMASPlaying

/**
 * Check if MASQuest is active.
 * @returns {boolean} . True if MASQuest is active, false otherwise.
 */
export const MASQuestStatus = () => isMASQuest

/**
 * Set the value of isMASPlaying.
 * @param {boolean} status 
 * @returns {void}
 */
export const setMASQuestStatus = status => isMASQuest = status

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@start command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@start/, async msg => {
    console.log("Se ha ejecutado el comando /MAS@start")
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    // We check if MAS is already playing
    if (isMASPlaying) {
        sendMessage(chatID, MAS_PLAYING)
        return
    }
    // We get the invitados and check if are a minimum of 8 and an even number
    let invitados = await showAllInvitados()
    if (invitados.length < 8) {
        sendMessage(chatID, "No hay suficientes participantes para jugar a MAS.")
        return
    }
    if (invitados.length % 2 !== 0) {
        sendMessage(chatID, "El número de participantes no es par.")
        return
    }
    console.log("Se ha iniciado el sorteo de MAS.")
    // We start MAS
    await startMAS()
    console.log("Sorteo de MAS terminado.")
    // We get the members of the teams
    invitados = await showAllInvitados()
    console.log(invitados)
    // We change the state of MAS to playing
    isMASPlaying = true
    isMASQuest = true
    // We send a message to the members of the teams
    invitados.forEach(invitado => {
        sendMessage(invitado.telegram_id, BIENVENIDA)
    })
    console.log("Se ha enviado el mensaje a los equipos.")

    if (intervalID !== null) {
        stopMASInterval()
    }

    // Every ${questTime} milliseconds, we send a message to the jefe with the number of participants in MAS.
    intervalID = setInterval(async () => {
        console.log("Se ejecuta MASQuest")
        await MASQuest()
    }, questTime)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@stop command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@stop/, async msg => {
    console.log("Se ha ejecutado el comando /MAS@stop")
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        sendMessage(chatID, MAS_NOT_PLAYING)
        return
    }

    const invitadosIDs = (await showAllInvitados()).map(invitado => invitado.telegram_id)
    // We send a message to all the members of MAS
    invitadosIDs.forEach(invitadoID => {
        sendMessage(invitadoID, MAS_FINISHED)
    })

    isMASPlaying = false
    isMASQuest = false
    clearInterval(intervalID)
    intervalID = null
    console.log("MAS ha terminado")
    // We send a message to the user to confirm if he wants to restart the database. 
    // The buttons are "Si" and "No" and only can be clicked once.
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Si",
                        callback_data: "yes"
                    },
                    {
                        text: "No",
                        callback_data: "no"
                    }
                ]
            ]
        }
    }
    bot.sendMessage(chatID, "MAS ha terminado. ¿Quieres reiniciar la Base de Datos? (Si/No)", opts)

    bot.on("callback_query", async query => {
        if (query.message.chat.id !== chatID) return
        const data = query.data
        // We erase the buttons
        bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatID, message_id: query.message.message_id })
        // If the user clicks "Si", we restart the database
        if (data === "yes") {
            await deleteAllInvitados()
            sendMessage(chatID, "La Base de Datos ha sido reiniciada.")
        }
        // If the user clicks "No", we send a message
        else {
            sendMessage(chatID, "La Base de Datos no ha sido reiniciada.")
        }
    })
})

let isMASActive = false

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@switch command and switches the MAS state.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@switch/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    isMASActive = !isMASActive
    const message = isMASActive ? MAS_REGIST_ACTIVE : MAS_REGIST_DISABLED
    sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@add [name] command and adds a new member to the list of members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@add (.*)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if MAS is already playing
    if (isMASPlaying) {
        sendMessage(chatID, MAS_PLAYING)
        return
    }
    // We check if MAS registration is active
    if (!isMASActive) {
        sendMessage(chatID, MAS_REGIST_INACTIVE)
        return
    }
    if (match.length < 2) {
        sendMessage(chatID, NOT_NAME_GIVEN)
        return
    }

    // We take the name of the new member
    const name = match.slice(1).join(" ").trim()

    if (name.length > 50) {
        sendMessage(chatID, NAME_TOO_LONG)
        return
    }

    // We check if the name is already in use
    const nameNotUsed = await verifyInvitadoName(name)
    // We check if the telegram id is already in use
    const TelegramIDNotUsed = await verifyInvitadoID(chatID)

    // If the name and the telegram id are not in use, we register the new member.
    // Otherwise, we send a message to the user and cancel the function.
    if (!TelegramIDNotUsed) {
        sendMessage(chatID, MAS_ALREADY_REGISTERED)
        return
    }
    if (!nameNotUsed) {
        sendMessage(chatID, NAME_USED)
        return
    }

    // We register the new member in the database
    registerInvitado(chatID, name)
    sendMessage(chatID, `Se ha registrado a ${name} en el ayuntamiento para participar en el evento de MAS.`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@remove command and removes a member from the list of members of MAS with the telegram id.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@remove/, async msg => {
    const chatID = msg.chat.id
    // We check if MAS is already playing
    if (isMASPlaying) {
        sendMessage(chatID, MAS_PLAYING)
        return
    }
    // We check if MAS registration is active
    if (!isMASActive) {
        sendMessage(chatID, MAS_REGIST_INACTIVE)
        return
    }
    // We verify that the user is registered
    if (await verifyInvitadoID(chatID)) {
        sendMessage(chatID, MAS_NOT_REGISTERED)
        return
    }
    // We get the name of the member
    const name = (await getInvitadoByTelegramID(chatID)).name
    // We remove the member from the database
    removeInvitado(chatID)
    sendMessage(chatID, `Se ha eliminado a ${name} de la lista de participantes de MAS. Tus datos registrados en el ayuntamiento serán incinerados.`)
    console.log(`Se ha eliminado a ${name} de la lista de participantes de MAS`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@teams command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@teams/, async msg => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        sendMessage(chatID, MAS_NOT_REGISTERED)
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        sendMessage(chatID, MAS_NOT_PLAYING)
        return
    }
    // We get the members of the teams
    const { teamA, teamB } = await getTeams()
    let message = `Hay ${teamA.length + teamB.length} participantes distribuidos en dos equipos.`
    message += `\n\nEl equipo de los ${TEAM_A} está conformado por: \n - ${teamA.join("\n - ")}`
    message += `\n\nEl equipo de los ${TEAM_B} está conformado por: \n - ${teamB.join("\n - ")}`
    sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@restart command and restarts the MAS if the bot has been restarted or shut down. (Only for the jefe)
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@restart/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    isMASPlaying = true
    isMASQuest = true
    sendMessage(chatID, MAS_RESET)
    console.log("MAS ha sido reiniciado")

    if (intervalID !== null) {
        stopMASInterval()
    }

    intervalID = setInterval(async () => {
        await MASQuest()
    }, questTime)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@sug [suggestion] command and adds a suggestion to the member of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@sug (.*)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        sendMessage(chatID, MAS_NOT_REGISTERED)
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        sendMessage(chatID, MAS_NOT_PLAYING)
        return
    }
    if (match.length < 2) {
        sendMessage(chatID, NOT_SUGGESTION_GIVEN)
        return
    }
    // We get the invitado
    const invitado = await getInvitadoByTelegramID(chatID)
    // We get the name of the member
    const name = invitado.name
    // We get the suggestion
    const suggestion = match.slice(1).join(" ").trim()
    if (suggestion.length > 200) {
        sendMessage(chatID, SUGGESTION_TOO_LONG)
        return
    }
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
        sendMessage(chatID, MAS_NOT_REGISTERED)
        return
    }
    sendMessage(chatID, rules)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@show command and sends the participants of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@show/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    // We get the members of the teams
    const invitados = await showAllInvitados()
    let message = "Los participantes de MAS son: \n"
    message += invitados.map(invitado => `${invitado.name} - ${invitado.telegram_id} - ${invitado.team} - ${invitado.receive} - ${invitado.checked}`).join("\n")
    sendMessage(chatID, message)
    // Show all invitados in the console
    invitados.forEach(invitado => {
        console.log(invitado)
    })
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@clean command and cleans the participants of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@clean/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    // We get the members of the teams
    await deleteAllInvitados()
    sendMessage(chatID, "Se han eliminado todos los participantes de MAS.")
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@echo [message] command and sends a message with the message to all the members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@echo (.+)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if the user is the jefe
    console.log(chatID)
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        sendMessage(chatID, NOT_JEFE)
        return
    }
    // We get the message
    const message = match.slice(1).join(" ").trim().replace(/\\n/g, "\n").replace(/\\t/g, " ").replace(/ +/g, " ")
    // We get the members of the teams
    const invitados = await showAllInvitados()
    // We send the message to all the members of MAS
    invitados.forEach(invitado => {
        const id = invitado.telegram_id
        if (!isJefe(id)) sendMessage(id, message)
    })
    // We send a message to the user to confirm that the message has been sent
    sendMessage(chatID, "Se ha enviado el mensaje a todos los participantes de MAS.")
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS$/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is a preparador or an invitado
    // If the user is not a preparador or an invitado, we send a message and cancel the function
    if (await verifyInvitadoID(chatID)) {
        sendMessage(chatID, NOT_INVITADO)
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        sendMessage(chatID, MAS_NOT_PLAYING)
        return
    }
    // We get the invitados
    const invitados = await showAllInvitados()
    const invitado = invitados.find(invitado => invitado.telegram_id == chatID)
    console.log("Invitado", invitado)
    const givesTo = invitado?.receive
    const givesToInfo = invitados.find(invitado => invitado.name == givesTo)
    console.log("Regala a:", givesToInfo)
    const suggestions = givesToInfo?.suggestion
    const team = invitados.filter(inv => inv.team === invitado.team).map(invitado => invitado.name)
    let response = MASMesssage(invitado, team)

    response += `Te recomiendo ofrendarle: ${suggestions?.length === 0 ? "Nada en particular" : suggestions}`
    response += `\n\nA ti te gustaria que te ofrenden: ${invitado.suggestion.length === 0 ? "Nada en particular" : invitado.suggestion}`
    response += "\n\nRecuerda que puedes usar el comando /MAS en cualquier momento para ver esta información y la sugerencia de regalo."
    sendMessage(chatID, response)
})
