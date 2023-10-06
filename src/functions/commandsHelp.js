// ! ACTUALIZAR CADA VEZ QUE SE AÑADA UN COMANDO NUEVO

const commandsHelp = `*LISTA DE COMANDOS*
_------------ Comandos generales ------------_
/help - Te devuelve la lista de comandos.
/id - Te devuelve el ID del chat.

_----------- Comandos de admision -----------_
/start - Te devuelve el mensaje de bienvenida a la admision.

*Solo para prenuevos*
/enlace - Te devuelve el enlace al grupo de admision.

_--------- Comandos de Preparadores ---------_
/hostname - Te devuelve el hostname del servidor.
/taquilla - Te devuelve el horario de taquilla.
/preparadores - Te devuelve la lista de preparadores.

*Solo para el jefe*
/taquilla@switch - Activa o desactiva la taquilla.

_----------- Comandos de Invitados -----------_
/MAS - Te devuelve el nombre de tus compañeros de MAC Amigo Secreto y las sugerencias de regalo.
/MAS@teams - Te devuelve los equipos de MAC Amigo Secreto.
/MAS@sug [[sugerencia]] - Te añade una sugerencia de regalo.
/MAS@help - Muestra las reglas e instrucciones del MAC Amigo Secreto.

*Con periodo de registro*
/MAS@add [[nombre]] - Te registra como miembro de MAC Amigo Secreto. 
/MAS@remove - Te elimina de la lista de miembros de MAC Amigo Secreto. 

*Solo para el jefe*
/MAS@start - Inicia el juego de MAC Amigo Secreto. 
/MAS@stop - Detiene el juego de MAC Amigo Secreto.
/MAS@switch - Activa o desactiva el periodo de registro de MAC Amigo Secreto.
/MAS@restart - Reinicia el juego de MAC Amigo Secreto en caso de que el bot se haya reiniciado o apagado.
/MAS@echo [[mensaje]] - Envia un mensaje a todos los miembros de MAC Amigo Secreto.
/MAS@show - Te devuelve la lista de miembros de MAC Amigo Secreto.
/MAS@clean - Limpia la lista de miembros de MAC Amigo Secreto.
`

export default commandsHelp