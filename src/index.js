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

		    /**
     * rawHtmlResponse returns HTML inputted directly
     * into the worker script
     * @param {string} html
     */
			function rawHtmlResponse(html) {
				return new Response(html, {
				  headers: {
					"content-type": "text/html;charset=UTF-8",
				  },
				});
			  }
		
			  
    /**
     * readRequestBody reads in the incoming request body
     * Use await readRequestBody(..) in an async function to get the string
     * @param {Request} request the incoming request to read from
     */
    async function readRequestBody(request) {
		const contentType = request.headers.get("content-type");
		if (contentType.includes("application/json")) {
		  return JSON.stringify(await request.json());
		} else if (contentType.includes("application/text")) {
		  return request.text();
		} else if (contentType.includes("text/html")) {
		  return request.text();
		} else if (contentType.includes("form")) {
		  const formData = await request.formData();
		  const body = {};
		  for (const entry of formData.entries()) {
			body[entry[0]] = entry[1];
		  }
		  return JSON.stringify(body);
		} else {
		  // Perhaps some other type of data was submitted in the form
		  // like an image, or some other binary data.
		  return "a file";
		}
	  }


	  const { url } = request;
	  if (url.includes("form")) {
		return rawHtmlResponse(someForm);
	  }
	  if (request.method === "POST") {
		const reqBody = await readRequestBody(request);
		const retBody = `The request body sent in was ${reqBody}`;
		return new Response(retBody);
	  } else if (request.method === "GET") {
		return new Response("The request was a GET");
	  }

		if ( request.method !== "POST" ) {
			return new Response('He is risen!');
		}

		try {
			const data = await request.json();
		} catch (error) {
			return new Response( error.message );

		}

/*
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
		} catch (error) {
			return new Response( error.message );
		}
*/

		return new Response('He is not here, He is risen!');
	},
};

