import { TEAM_A, TEAM_B, questTime, BIENVENIDA } from "../../constants/infoMAS.js"
import { isJefe } from "../../constants/preparadores.js"
import rules from "../../messages/rulesMAS.js"
import { deleteAllInvitados, getInvitadoByTelegramID, registerInvitado, removeInvitado, showAllInvitados, updateSuggestion, verifyInvitadoID, verifyInvitadoName } from "../../models/invitadosMASModel.js"
import { getAllPreparadores } from "../../models/preparadorModel.js"
import bot from "../../settings/app.js"
import { MASMesssage, getTeams } from "./readMAS.js"
import { MASQuest, sendTeamMessage, startMAS } from "./startMAS.js"
import { sendMessage } from "../sendMessage.js"

let isMASPlaying = false
let isMASQuest = true

let intervalID = null

export const MASPlayingStatus = () => isMASPlaying
export const MASQuestStatus = () => isMASQuest
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    // We check if MAS is already playing
    if (isMASPlaying) {
        bot.sendMessage(chatID, "MAS ya está jugando.")
        return
    }
    // We get the invitados and check if are a minimum of 8 and an even number
    let invitados = await showAllInvitados()
    if (invitados.length < 8) {
        bot.sendMessage(chatID, "No hay suficientes participantes para jugar a MAS.")
        return
    }
    if (invitados.length % 2 !== 0) {
        bot.sendMessage(chatID, "El número de participantes no es par.")
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
        clearInterval(intervalID)
        intervalID = null
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando.")
        return
    }

    const invitadosIDs = (await showAllInvitados()).map(invitado => invitado.telegram_id)
    // We send a message to all the members of MAS
    invitadosIDs.forEach(invitadoID => {
        bot.sendMessage(invitadoID, "MAS ha terminado. ¡Gracias a toda la aldea por participar!")
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
            bot.sendMessage(chatID, "La Base de Datos ha sido reiniciada.")
        }
        // If the user clicks "No", we send a message
        else {
            bot.sendMessage(chatID, "La Base de Datos no ha sido reiniciada.")
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    isMASActive = !isMASActive
    const message = isMASActive ? "MAS activo" : "MAS inactivo"
    bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@add [name] command and adds a new member to the list of members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@add (.+)/, async (msg, match) => {
    const chatID = msg.chat.id
    // We check if MAS is already playing
    if (isMASPlaying) {
        bot.sendMessage(chatID, "MAS ya está jugando.")
        return
    }
    // We check if MAS registration is active
    if (!isMASActive) {
        bot.sendMessage(chatID, "El registro de MAS está inactivo.")
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
        bot.sendMessage(chatID, "Ya estás registrado en MAS.")
        return
    }
    if (!nameNotUsed) {
        bot.sendMessage(chatID, "Ya hay alguien con ese nombre en nuestros registros.")
        return
    }
    if (!TelegramIDNotUsed) {
        bot.sendMessage(chatID, "Ya hay alguien con ese Telegram ID en nuestros registros.")
        return
    }

    // We register the new member in the database
    registerInvitado(chatID, name)
    bot.sendMessage(chatID, `Se ha registrado a ${name} en el ayuntamiento para participar en el evento de MAS.`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@remove command and removes a member from the list of members of MAS with the telegram id.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@remove/, async msg => {
    const chatID = msg.chat.id
    // We check if MAS is already playing
    if (isMASPlaying) {
        bot.sendMessage(chatID, "MAS ya está jugando.")
        return
    }
    // We check if MAS registration is active
    if (!isMASActive) {
        bot.sendMessage(chatID, "El registro de MAS está inactivo.")
        return
    }
    // We verify that the user is registered
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS.")
        return
    }
    // We get the name of the member
    const name = (await getInvitadoByTelegramID(chatID)).name
    // We remove the member from the database
    removeInvitado(chatID)
    bot.sendMessage(chatID, `Se ha eliminado a ${name} de la lista de participantes de MAS. Tus datos registrados en el ayuntamiento serán incinerados.`)
    console.log(`Se ha eliminado a ${name} de la lista de participantes de MAS`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@teams command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@teams/, async msg => {
    const chatID = msg.chat.id
    // We check if the usder is in MAS
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No estás registrado en MAS.")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando.")
        return
    }
    // We get the members of the teams
    const { teamA, teamB } = await getTeams()
    let message = `Hay ${teamA.length + teamB.length} participantes distribuidos en dos equipos.`
    message += `\n\nEl equipo de los ${TEAM_A} está conformado por: \n - ${teamA.join("\n - ")}`
    message += `\n\nEl equipo de los ${TEAM_B} está conformado por: \n - ${teamB.join("\n - ")}`
    bot.sendMessage(chatID, message)
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    isMASPlaying = true
    isMASQuest = true
    bot.sendMessage(chatID, "MAS ha sido reiniciado.")
    console.log("MAS ha sido reiniciado")

    if (intervalID !== null) {
        clearInterval(intervalID)
        intervalID = null
    }

    intervalID = setInterval(async () => {
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
        bot.sendMessage(chatID, "No estás registrado en MAS.")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando.")
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
        bot.sendMessage(chatID, "No estás registrado en MAS.")
        return
    }
    bot.sendMessage(chatID, rules)
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    // We get the members of the teams
    const invitados = await showAllInvitados()
    let message = "Los participantes de MAS son: \n"
    message += invitados.map(invitado => `${invitado.name} - ${invitado.telegram_id} - ${invitado.team} - ${invitado.receive} - ${invitado.checked}`).join("\n")
    bot.sendMessage(chatID, message)
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    // We get the members of the teams
    await deleteAllInvitados()
    bot.sendMessage(chatID, "Se han eliminado todos los participantes de MAS.")
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
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    // We get the message
    const message = match.slice(1).join(" ").trim()
    // We get the members of the teams
    const invitados = await showAllInvitados()
    // We send the message to all the members of MAS
    invitados.forEach(invitado => {
        bot.sendMessage(invitado.telegram_id, message)
    })
    // We send a message to the user to confirm that the message has been sent
    bot.sendMessage(chatID, "Se ha enviado el mensaje a todos los participantes de MAS.")
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@prueba command and insert preparadores in the database. (Command for development, please comment this command if it's not necessary)
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@prueba/, async msg => {
    const chatID = msg.chat.id
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    const preparadores = await getAllPreparadores()
    const preparadoresToInsert = preparadores.filter(preparador => preparador.initials !== 'NG')
    preparadoresToInsert.forEach(async preparador => {
        console.log(preparador)
        await registerInvitado(preparador.telegram_id, preparador.initials)
    })
    bot.sendMessage(chatID, "Se han insertado los preparadores en la base de datos.")
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS@dev command and sends a message with the team members of MAS. (Command for development, please comment this command if it's not necessary)
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS@dev/, async msg => {
    const chatID = msg.chat.id
    if (!isJefe(chatID)) {
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    if (isMASPlaying) {
        bot.sendMessage(chatID, "MAS ya está jugando")
        return
    }
    const teams = await startMAS()
    console.log("Termino startMAS");
    console.log(teams)
    const teamA = teams[0]
    const teamB = teams[1]
    isMASPlaying = true
    console.log("Se ha iniciado el sorteo de MAS")
    await sendTeamMessage(teamA, TEAM_A)
    await sendTeamMessage(teamB, TEAM_B)
    console.log("Se ha enviado el mensaje a los equipos")
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS$/, async msg => {
    const chatID = msg.chat.id
    // We check if the user is a preparador or an invitado
    // If the user is not a preparador or an invitado, we send a message and cancel the function
    if (await verifyInvitadoID(chatID)) {
        bot.sendMessage(chatID, "No eres invitado. No puedes usar este comando.")
        return
    }
    // We check if MAS is already playing
    if (!isMASPlaying) {
        bot.sendMessage(chatID, "MAS no está jugando.")
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
    bot.sendMessage(chatID, response)
})
