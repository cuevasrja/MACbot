// ! ACTUALIZAR CADA VEZ QUE SE AÑADA UN COMANDO NUEVO

const commandsHelp = `LISTA DE COMANDOS
------------------ Comandos generales ------------------------
/help - Te devuelve la lista de comandos.
/id - Te devuelve el ID del chat.
------------------ Comandos de admision ----------------------
/start - Te devuelve el mensaje de bienvenida a la admision.
/enlace - Te devuelve el enlace al grupo de admision. (Solo para prenuevos)
------------------ Comandos de Preparadores ------------------
/taquilla - Te devuelve el horario de taquilla. (Solo para preparadores)
/taquilla@switch - Activa o desactiva la taquilla. (Solo para el jefe)
/hostname - Te devuelve el hostname del servidor. (Solo para preparadores)
------------------ Comandos de Invitados ---------------------
/MAS - Te devuelve el nombre de tus compañeros de MAC Amigo Secreto y las sugerencias de regalo. (Solo para miembros)
/MAS@teams - Te devuelve los equipos de MAC Amigo Secreto. (Solo para miembros)
/MAS@add [nombre] - Te registra como miembro de MAC Amigo Secreto. (Con periodo de registro)
/MAS@remove - Te elimina de la lista de miembros de MAC Amigo Secreto. (Con periodo de registro y solo para miembros)
/MAS@sug [sugerencia] - Te añade una sugerencia de regalo. (Solo para miembros)
/MAS@start - Inicia el juego de MAC Amigo Secreto. (Solo para el jefe)
/MAS@stop - Detiene el juego de MAC Amigo Secreto. (Solo para el jefe)
/MAS@switch - Activa o desactiva el periodo de registro de MAC Amigo Secreto. (Solo para el jefe)
/MAS@restart - Reinicia el juego de MAC Amigo Secreto en caso de que el bot se haya reiniciado o apagado. (Solo para el jefe)
/MAS@help - Muestra las reglas e instrucciones del MAC Amigo Secreto. (Solo para miembros)
`

export default commandsHelp