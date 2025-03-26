/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

const corsHeaders = {
	'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
	'Access-Control-Allow-Methods': 'GET,POST,HEAD,OPTIONS', // Allowed methods. Others could be GET, PUT, DELETE etc.
	'Access-Control-Allow-Origin': '', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
}

const corsWhitelist = [
	"https://hindleychristianfellowship.co.uk",
	"https://hindleychristianfellowship.uk",
	"https://hartcommonchurch.co.uk",
	"https://hartcommonchurch.uk",
];

const sendEmail = async (env, name, email, message) => {
	const sender = "contact@hindleychristianfellowship.co.uk";
	const recipient = "fozzedout@gmail.com";

	const msg = createMimeMessage();
	msg.setSender({ name: "Hindley Christian Fellowship", addr: sender });
	msg.setRecipient( recipient );
	msg.setSubject( "Hindley Christian Fellowship Website Contact" );
	msg.addMessage({
		contentType: "text/plain",
		data: `Name: ${name}
Email: ${email}
Comment:
${message}`
	});

	var message = new EmailMessage( sender, recipient, msg.asRaw() );

	try {
		await env.emailBinding.send( message );
	} catch (error) {
		return error.message;
	}

	return "Thank you! We've received your message and will get back to you soon.";
}


export default {
	async fetch(request, env, ctx) {
		    const origin = request.headers.get('Origin');

		if ( !origin || !corsWhitelist.includes(origin) ) {
			return new Response( `Invalid header: ${origin}` );
		}

		corsHeaders["Access-Control-Allow-Origin"] = origin;

		// Handle OPTIONS preflight request
		if (request.method === 'OPTIONS') {
				return new Response(null, {
					status: 204,
					headers: corsHeaders,
				});

		} else if ( request.method === "POST" ) {
			let data;
			try {
				data = await request.json();
			} catch (error) {
				return new Response( error.message, { headers: corsHeaders } );
			}

			return new Response(
				await sendEmail(env, data.name, data.email, data.comment),
				{ headers: corsHeaders }
			);
		}

		return new Response('He is not here, He is risen!', { headers: corsHeaders });
	},
};

