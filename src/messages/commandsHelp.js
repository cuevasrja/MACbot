// ! ACTUALIZAR CADA VEZ QUE SE AÑADA UN COMANDO NUEVO

export const COMMANDS = `*LISTA DE COMANDOS*
_------------ Comandos generales ------------_
/help - Te devuelve la lista de comandos.
/id - Te devuelve el ID del chat.

_----------- Comandos de admision -----------_
/start - Te devuelve el mensaje de bienvenida a la admision.
/admision - Inicias tu registro en la admision.

*Solo para prenuevos*
/enlace - Te devuelve el enlace al grupo de admision.

_--------- Comandos de Preparadores ---------_
/hostname - Te devuelve el hostname del servidor.
/taquilla - Te devuelve el horario de taquilla.
/preparadores - Te devuelve la lista de preparadores.
/dev - Muestra los comandos de desarrollo.
/admision@remove - Elimina un prenuevo de la admision.
/admision@show - Te devuelve la lista de prenuevos.

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

export const DEV_COMMANDS = `*LISTA DE COMANDOS*
_------------ MAC Amigo Secreto ------------_
/MAS@dev - Inicia el juego de MAC Amigo Secreto.
/MAS@prueba - Registra los preparadores en la base de datos del juego de MAC Amigo Secreto.
/MAS@dbQuest - Vuelve a poner el checked de todos los invitados en false.
/MAS@Quest - Realiza una pregunta a 3 invitados al azar.

_---------------- Taquilla ------------------_
/taquilla@dev - Te devuelve el horario de taquilla.

Advertencia: Estos comandos son solo para desarrollo. No los uses en el grupo de admisión, MAC Amigo Secreto o en el grupo de preparadores.
(Revisar que los comandos no estén desactivados)
`