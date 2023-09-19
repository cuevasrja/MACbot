// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const AL_ID = process.env.AL_ID || undefined;
const CW_ID = process.env.CW_ID || undefined;
const EC_ID = process.env.EC_ID || undefined;
const GL_ID = process.env.GL_ID || undefined;
const IC_ID = process.env.IC_ID || undefined;
const JC_ID = process.env.JC_ID || undefined;
const JZ_ID = process.env.JZ_ID || undefined;
const LP_ID = process.env.LP_ID || undefined;
const MO_ID = process.env.MO_ID || undefined;
const RL_ID = process.env.RL_ID || undefined;

// Create a map of the preparadores.
export const PREPARADORES = new Map([
	[AL_ID, 'AL'],
	[CW_ID, 'CW'],
	[EC_ID, 'EC'],
	[GL_ID, 'GL'],
	[IC_ID, 'IC'],
	[JC_ID, 'JC'],
	[JZ_ID, 'JZ'],
	[LP_ID, 'LP'],
	[MO_ID, 'MO'],
	[RL_ID, 'RL'],
]);

export const JEFE = 'JZ';