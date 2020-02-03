import { google } from 'googleapis';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
require('dotenv').config();

// ---------------------------------------------------------------------------------------------------- //
// URL of the sheet where the data is obtained
// ---------------------------------------------------------------------------------------------------- //
const spreadsheetId = process.env.TAQUILLA_SHEET || undefined;

// ---------------------------------------------------------------------------------------------------- //
// Function that is responsible for reading specific data on the sheet.
// Receive as parameter the authenticator of the Google Sheet API.
// ---------------------------------------------------------------------------------------------------- //
export async function readTaquilla(client) {
	try {
		// Version used for the connection to the sheet and the authenticator for the data request.
		let sheets = google.sheets({ version: 'v4', auth: client });

		// Options you set in which ranges of the sheet the data is read.
		let opt = {
			spreadsheetId,
			range: 'Horario!A2:F10',
		};

		// The data obtained is saved in a variable.
		let response = await sheets.spreadsheets.values.get(opt);

		// The data obtained is printed on the console. (Debugging tracks)
		console.log(response.data.values);

		// The function 'readTaquilla' must return:
		// [Array] {
		// 			[Array] {
		// 				[Data]
		//			}
		// 		}
		return response.data.values;
	} catch (err) {
		// If there is an error, it prints it and the function returns the value -1.
		console.log(`There was an error in obtaining data from the spreadsheet.`, err);
		return -1;
	}
}
