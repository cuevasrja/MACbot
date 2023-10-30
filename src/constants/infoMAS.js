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

export const BIENVENIDA = `¡El *MACamigo Secreto* ha comenzado en la aldea del *MAC*!

> Usa el comando /MAS para saber tu _equipo_ y a quien te toca ofrendarle. ¡Entérate ya de esa valiosa información!

> Con /MAS@help podrás ver las _reglas del juego_. Te recomiendo que las consultes si aún no lo has hecho.

> Para añadir una _sugerencia de ofrenda_ escribe /MAS@sug [sugerencia]. El _precio_ estimado de la misma debe estar entre *5-10$*. ¡Piensa bien lo que vas a pedir!

> Está atento a la visita de la _vidente_, lo que te diga puede cambiar el rumbo de la partida...

> Los _anuncios importantes_ los haré en este chat. Trata de no pasar por alto mis mensajes.

> Sin nada más que decir, les deseo *_mucha suerte_* a todos.

Att: El alcalde.

P.D.: No nos hacemos responsables por _aldeanos_ devorados y/o _lobos_ linchados.`
