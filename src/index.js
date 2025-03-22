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

export default {
	async fetch(request, env, ctx) {

		if ( request.method !== "POST" ) {
			return new Response('He is risen!');
		}

		//const data = await request.json();


		const sender = "contact@hindleychristianfellowship.co.uk";
		const recipient = "fozzedout@gmail.com";

		const msg = createMimeMessage();
		msg.setSender({ name: "HCF", addr: sender });
		msg.setRecipient( recipient );
		msg.setSubject( "An email generated in a worker" );
		msg.addMessage({
			contentType: "text/plain",
			data: `Congratulations, you just sent an email!`
		});

		var message = new EmailMessage( sender, recipient, msg.asRaw() );

		try {
			await env.emailBinding.send( message );
		} catch (e) {
			return new Response( e.message );
		}


		return new Response('He is not here, He is risen!');
	},
};

