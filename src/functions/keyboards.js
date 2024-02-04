import { PARSE } from '../constants/botSettings.js';
import { ALREADY_ASSISTED, BACK, DONT_KNOW, FAQ, JOIN_GROUP, LOGIN, NO, YES } from '../constants/responses.js';
// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
import { faq } from '../messages/admission.js';
dotenv.config();

const ADMISION_URL = process.env.ADMISION_URL || undefined;

// ---------------------------------------------------------------------------------------------------- //
// This file stores all the keyboards shown on the telegram board.
// ---------------------------------------------------------------------------------------------------- //

// ! Deprecated
export const preLogin = {
	parse_mode: PARSE,
	reply_markup: {
		keyboard: [[LOGIN, DONT_KNOW], [FAQ]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

// ! Deprecated
export const yes_preLogin = {
	parse_mode: PARSE,
	reply_markup: {
		keyboard: [[ALREADY_ASSISTED], [NO, FAQ]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const login = {
	parse_mode: PARSE,
	reply_markup: {
		keyboard: [[LOGIN], [BACK]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const badLogin = {
	parse_mode: PARSE,
	reply_markup: {
		keyboard: [[LOGIN, DONT_KNOW], [FAQ]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const replyOpts = {
	parse_mode: PARSE,
	reply_markup: JSON.stringify({
		force_reply: true,
	}),
};

export const inlineURL = {
	parse_mode: PARSE,
	reply_markup: {
		inline_keyboard: [
			[
				{
					text: JOIN_GROUP,
					url: ADMISION_URL,
				},
			],
		],
	},
};

export const faqsOpts = {
	parse_mode: 'HTML',
	reply_markup: {
		inline_keyboard: faq.content.map((message, i) => {
			return [
				{
					text: message.title,
					callback_data: i.toString()
				}
			]

		})
	}
}
