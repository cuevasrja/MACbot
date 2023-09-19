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
/MAS - Te devuelve el nombre de tus compañeros de MAS y la sugerencia de regalo. (Solo para miembros de MAS)
/MAS@add [nombre] - Te registra como miembro de MAS. (Con periodo de registro)
/MAS@remove - Te elimina de la lista de miembros de MAS. (Con periodo de registro)
/MAS@start - Inicia el juego de MAS. (Solo para el jefe)
/MAS@stop - Detiene el juego de MAS. (Solo para el jefe)
/MAS@switch - Activa o desactiva el periodo de registro de MAS. (Solo para el jefe)
`

export default commandsHelp