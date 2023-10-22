export const TEAM_A = "Aldeanos"

export const TEAM_B = "Lobos"

// The time is in milliseconds. 
// So, to set a new time, you have to multiply the minutes by 60 seconds and by 1000 milliseconds.
// Example: 1 minute = 1 * 60 * 1000 = 60000
// If you want to set hours, you have to multiply the hours by 60 minutes, by 60 seconds and by 1000 milliseconds.
// Example: 1 hour = 1 * 60 * 60 * 1000 = 3600000
// If you want to set days, you have to multiply the days by 24 hours, by 60 minutes, by 60 seconds and by 1000 milliseconds.
// Example: 1 day = 1 * 24 * 60 * 60 * 1000 = 86400000
// Format: time = days * hours * minutes * seconds * milliseconds
// Actual time: 15 minutes (Update if you change the time)
export const questTime = 15 * 60 * 1000

export const BIENVENIDA = `¡El MACamigo Secreto ha comenzado en la aldea del MAC!
Usa el comando /MAS para saber tu equipo y a quien te toca ofrendarle. ¡Entérate ya de esa valiosa información!
Con /MAS@help podrás ver las reglas del juego. Te recomiendo que las consultes si aún no lo has hecho.
Para añadir una sugerencia de regalo escribe /MAS@sug seguido de tu sugerencia. El precio estimado de la misma debe estar entre 5-10$. ¡Piensa bien lo que vas a pedir!
Está atento a la visita de la Vidente, lo que te diga puede cambiar el rumbo de la partida...
Sin nada más que decir, les deseo mucha suerte a todos.
Att: El Alcalde.
P.D.: No nos hacemos responsables por aldeanos devorados y/o lobos linchados.`