import { google } from 'googleapis';

require('dotenv').config();

const spreadsheetId = process.env.TAQUILLA_SHEET || undefined;

export async function readTaquilla(client) {
	const sheets = google.sheets({ version: 'v4', auth: client });

	const opt = {
		spreadsheetId,
		range: 'Horario!A2:F10',
	};

	const response = await sheets.spreadsheets.values.get(opt);

	console.log(response.data.values.length);

	return response.data.values;
}
