// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

// Create a map of the preparadores.
export const PREPARADORES = JSON.parse(process.env.PREPARADORES_ID);
const jefe = parseInt(PREPARADORES['JZ']);
const admins = [
	jefe,
	parseInt(PREPARADORES['JC']),
	parseInt(PREPARADORES['LP']),
	parseInt(PREPARADORES['EC']),
]

/**
 * Check if the given ID is jefe's ID.
 * @param {Integer} id 
 * @returns {Boolean} True if the given ID is jefe's ID.
 */
export const isJefe = id => id === jefe;

/**
 * Check if the given ID is administrador's ID.
 * @param {Integer} id
 * @returns {Boolean} True if the given ID is administrador's ID.
 */
export const isAdmin = id => admins.some(admin => admin === id);