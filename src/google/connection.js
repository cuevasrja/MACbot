import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// ---------------------------------------------------------------------------------------------------- //
// This function reads credentials and authenticates them for connection to the Google Spreadsheets API.
// Receive as a parameter the method to be executed.
// ---------------------------------------------------------------------------------------------------- //
export async function googleSpreadsheet(callback) {
	// Google Spreadsheet API credentials are read and saved in a variable.
	let asyncReadFile = promisify(fs.readFile);
	let data = await asyncReadFile(path.join(__dirname, '../../credentials/MACbot_secret.json'), 'utf8');
	let dataJSON = JSON.parse(data);

	// It is established that the connection is with read and write permissions when authenticating
	// the credentials with the API.
	let client = new google.auth.JWT(dataJSON.client_email, null, dataJSON.private_key, [
		'https://www.googleapis.com/auth/spreadsheets',
	]);

	// The function 'googleSpreadsheet' must return:
	// [Array] {
	// 			[Array] {
	// 				[Data dependent on the method used]
	//			}
	// 		}
	return await auth(client, callback);
}

// ---------------------------------------------------------------------------------------------------- //
// Function that establishes the relationship between API authentication with the method that will be
// used to obtain the data.
// ---------------------------------------------------------------------------------------------------- //
const auth = async (client, callback) => {
	// Returns a promise that evaluates the connection with the Google API.
	return new Promise((resolve, reject) => {
		// Check if the API token is valid.
		// eslint-disable-next-line no-unused-vars
		client.authorize(async (err, tokens) => {
			// If the token is not valid, reject and print the error.
			if (err) {
				console.log('Error while trying to authorize the token', err);
				reject(err);
			}
			// If the token is valid make a call with the method to use, then resolve the
			// information obtained.
			else {
				console.log('Connected to Google API.');
				let response = await callback(client);
				// If the answer is valid, resolve the data.
				if (response != -1) {
					resolve(response);
				} else {
					console.log(`The ${callback} has returned a ${response}.`);
				}
			}
		});
	});
};
