'use strict';
const Adapter = require.main.require('hubot/src/adapter')
const Response = require.main.require('hubot/src/response')
const {
	TextMessage
} = require.main.require('hubot/src/message')
const SynologyChatBot = require('synology-chat-bot');
const Express = require('express');

class SynologyChatAdapter extends Adapter {
	constructor(robot) {
		super(robot);
		const env = process.env;
		'SYNOCHAT_TOKEN,SYNOCHAT_URL,SYNOCHAT_PORT'.split(',').forEach((envVariable) => {
			if (env[envVariable] === undefined || env[envVariable] === '') {
				throw 'need env.' + envVariable;
			}
		});
	}

	run() {
		this.robot.logger.info(`[startup] Synology Chat adapter in use`);
		this.robot.logger.info(`[startup] Respond to name: ${this.robot.name}`)
		this._initBot();
	}

	_initBot() {
		const env = process.env;
		this.app = Express();
		this.bot = new SynologyChatBot(env.SYNOCHAT_TOKEN, env.SYNOCHAT_URL, this.app);
		this.bot.route(env.SYNOCHAT_ROUTE || '/');

		this.bot.on('request', (outgoingRequest, response, next) => {
			const user = this.robot.brain.userForId(parseInt(outgoingRequest.user_id, 10), {
				name: outgoingRequest.username
			});

			let textMessage = new TextMessage(user, `@${this.robot.name}: ${outgoingRequest.text}`, parseInt(outgoingRequest.post_id, 10));
			this.robot.logger.info(`user: ${JSON.stringify(user)}`);
			this.robot.logger.info(`TextMessage: ${textMessage.toString()}`);
			this.robot.receive(textMessage);
			response.end();
		});

		this.app.listen(env.SYNOCHAT_PORT);
		this.emit('connected');
	}

	/** Send messages to user addressed in envelope */
	send(envelope, ...strings) {
		this.robot.logger.info(`envelope: ${envelope.toString()}`);

		return strings.forEach((text) => {
			this.bot.send([envelope.user.id], new SynologyChatBot.Message(text))
				.then(() => {
					this.robot.logger.debug(`[success] sent message ${text} to user ${envelope.user.name}`);
				})
				.catch((e) => {
					this.robot.logger.debug(`[failed] sent message ${text} to user ${envelope.user.name}, ${e.toString()}`);
				});
		});
	}

	/** Reply to a user's message (mention them if not a DM) */
	reply(envelope, ...strings) {
		this.robot.logger.info(`envelope: ${envelope.toString()}`);

		strings = strings.map((s) => `@${envelope.user.name} ${s}`);
		return this.send(envelope, ...strings);
	}
}

exports.use = (robot) => new SynologyChatAdapter(robot);