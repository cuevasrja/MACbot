import { getPrenuevo } from '../../models/prenuevosModel';
import bot from '../../settings/app';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();
const ADMISION_ID = process.env.ADMISION_ID || undefined;

/**
 * This function is responsible for remove a prenuevo from the admission group.
 * @param {String} carnet
 * @returns {Promise<void>}
 */
export const removeFromAdmission = async carnet => {
    console.log(`**Function 'removePrenuevo' in groupAdmin.`);

    // We get the chatID of the prenuevo.
    const prenuevo = await getPrenuevo(carnet);
    const chatID = prenuevo.telegram_id;

    // We remove the prenuevo from the group.
    bot.kickChatMember(ADMISION_ID, chatID);
}