import { isJefe } from "../../constants/preparadores.js"
import { setCheckedFalse, showAllInvitados } from "../../models/invitadosMASModel.js"
import bot from "../../settings/app.js"

// ! COMANDOS DE DESARROLLO (COMENTAR ANTES DE SUBIR A PRODUCCION)

// ------------------------------------------------------------------------------------------------ //
// The bot listens to the /MAS@dbQuest command and set the checked value of all the invitados to false.
// ------------------------------------------------------------------------------------------------ //
bot.onText(/^\/MAS@dbQuest$/, async msg => {
    const chatID = msg.chat.id
    // If the user is not the jefe, we send a message and cancel the function
    if (!isJefe(chatID)) {
        bot.sendMessage(chatID, "¡¡No me jodas!! ¡¡Que no eres el jefe!!")
        return
    }
    const invitados = await showAllInvitados()
    invitados.forEach(async inv => {
        await setCheckedFalse(inv.telegram_id)
    })
    bot.sendMessage(chatID, "Se han actualizado los preparadores en la base de datos.")
})