import { BLOCKS_HOURS, weekDays } from "../../constants/notionProps.js";
import { JEFE } from "../../constants/preparadores.js";
import { getAllPreparadores, getPreparadorByTelegramID, verifyPreparadorID } from "../../models/preparadorModel.js";
import { taquillaSchedule } from "../../notion/readTaquilla.js";
import bot from "../../settings/app.js";

const taquillaScheduleMessage = async () => {
    const dateI = new Date();
    const hours = dateI.getHours()
    dateI.setHours(hours - 4);
    const day = dateI.getDay()
    // We get the schedule of the day
    const schedule = await taquillaSchedule()
    // We build the response
    let response = `El horario de taquilla hoy (${weekDays[day - 1]}) es: \n`
    // We iterate over the schedule. First, we take each preparer and their blocks
    for (const [preparer, block] of Object.entries(schedule)) {
        // We iterate over the blocks
        block.forEach((time, index) => {
            // We convert time to a int
            const i = parseInt(time) - 1
            if (index === 0) { // If it's the first block, we add the preparer
                response += `${preparer}: ${BLOCKS_HOURS[i]}\n`
            } else { // If it's not the first block, we add the block with an indentation
                response += `     ${BLOCKS_HOURS[i]}\n`
            }
        })
    }
    response += "Recuerda que si no puedes ir a taquilla, debes avisar con tiempo"
    return response
}

// isTaquillaActive is a boolean that indicates if the taquilla is active or not
let isTaquillaActive = true

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla@switch command and switches the taquilla state.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla@switch/, async msg => {
    const chatID = msg.chat.id
    console.log("Se va a ejecutar el comando /taquilla:switch")
    // We check if the user is the jefe
    // const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === JEFE).telegram_id
    // // If the user is not the jefe, we send a message and cancel the function
    // if (chatID !== jefeChatID) {
    //     bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
    //     return
    // }
    isTaquillaActive = !isTaquillaActive
    const message = isTaquillaActive ? "Taquilla abierta" : "Taquilla cerrada"
    bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla command and sends a message with the schedule of the day.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla/, async msg => {
    const chatID = msg.chat.id
    console.log("Buscando horario de taquilla del dia")
    // We check if the user is a preparador
    // If the user is not a preparador, we send a message and cancel the function
    if (await verifyPreparadorID(chatID)) {
        console.log("No es preparador")
        bot.sendMessage(chatID, "No eres preparador!!")
        return
    }
    // We get the initials of the preparer
    const preparer = (await getPreparadorByTelegramID(chatID)).initials
    const dateI = new Date();
    const hours = dateI.getHours()
    dateI.setHours(hours - 4);
    const day = dateI.getDay()
    // We check if it's a weekend
    if (day === 0 || day === 6) {
        bot.sendMessage(chatID, `No me jodas ${preparer} que es fin de semana, no hay taquilla!!`)
        return
    }
    // We check if the taquilla is active
    if (!isTaquillaActive) {
        bot.sendMessage(chatID, `Deja de joder ${preparer}, la taquilla está cerrada`)
        return
    }
    // If it's a weekday and the taquilla is active, we send the message
    const message = await taquillaScheduleMessage()
    bot.sendMessage(chatID, message)
})

/**
 * sendMessage()
 * This function sends a message to each preparer with their schedule of the day.
 */
const sendMessage = async () => {
    const dateI = new Date();
    const hours = dateI.getHours()
    dateI.setHours(hours - 4);
    const day = dateI.getDay()
    console.log(day, hours - 4)
    // We check if the taquilla is active
    if (isTaquillaActive) {
        // We check if it's a weekend. 0 is Sunday and 6 is Saturday
        if (day === 0 || day === 6) {
            return
        }
        console.log(`Hoy es ${weekDays[day - 1]}`)
        // If it's a weekday, we get the schedule of the day
        const schedule = await taquillaScshedule()
        // We get the IDs of the preparers of the day
        const preparers = (await getAllPreparadores())
            .map(preparer => [preparer.telegram_id, preparer.initials])
            .filter(preparer => Object.keys(schedule).includes(preparer[1]))
        // We send the message to each preparer
        preparers.forEach(preparer => {
            // We build the message
            let msg = `Hola ${preparer[1]}, recuerda que hoy ${weekDays[day - 1]} tienes taquilla. Tu horario es: \n`
            // We iterate over the blocks
            schedule[preparer[1]].forEach(time => {
                const i = parseInt(time) - 1
                msg += `     ${BLOCKS_HOURS[i]}\n`
            })
            // We add the last message
            msg += "Recuerda que si no puedes ir a taquilla, debes avisar con tiempo"
            bot.sendMessage(preparer[0], msg)
        })
    }
    // We calculate the milliseconds to the next day
    const next24Hours = 24 * 60 * 60 * 1000;
    // We send the message every 24 hours
    setInterval(() => {
        sendMessage();
    }, next24Hours);
}

const date = new Date();
let hours = date.getHours()
date.setHours(hours - 4);
hours = date.getHours()
// Convert to milliseconds
const hoursToMilliseconds = hours * 60 * 60 * 1000;
const minutesToMilliseconds = date.getMinutes() * 60 * 1000;
const secondsToMilliseconds = date.getSeconds() * 1000;
// Sum all the milliseconds
const milliseconds = hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
// Calculate the milliseconds to 8:00 am
const millisecondsToEight = 8 * 60 * 60 * 1000;
let millisecondsToStart = millisecondsToEight - milliseconds;
// If the milliseconds to start is negative, we add 24 hours
if (millisecondsToStart < 0) {
    millisecondsToStart += 24 * 60 * 60 * 1000;
}

// Every day at 8:00 am, we send the message
setInterval(() => {
    sendMessage();
}, millisecondsToStart);