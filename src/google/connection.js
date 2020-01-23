import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export async function googleSpreadsheet(callback) {
	let asyncReadFile = promisify(fs.readFile);
	let data = await asyncReadFile(path.join(__dirname, '../../credentials/MACbot_secret.json'), 'utf8');
	let dataJSON = JSON.parse(data);
	const client = new google.auth.JWT(dataJSON.client_email, null, dataJSON.private_key, [
		'https://www.googleapis.com/auth/spreadsheets',
	]);

	return await auth(client, callback);
}

const auth = async (client, callback) => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line no-unused-vars
		client.authorize(async (err, tokens) => {
			if (err) {
				console.log('Error while trying to authorize the token', err);
				reject(err);
			}
			console.log('Connected to Google API.');
			let response = await callback(client);
			resolve(response);
		});
	});
};
