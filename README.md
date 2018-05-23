[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/RocketChat/Rocket.Chat/raw/master/LICENSE)
# hubot-synologychat
Hubot Synology Chat Adapter

### What's Synology Chat

Synology Chat is a slack-like chat service provided by Synology inc.

https://www.synology.com/dsm/feature/chat

### What's Synology Chat Bot

Synology Chat is a chatbot feature in Synology Chat, provided a direct message interface for chatbot developer to interact with users.

https://www.synology.com/knowledgebase/DSM/help/Chat/chat_integration

### What's Hubot

Hubot is a Chatbot framework by Github inc.

https://hubot.github.com/

### What's this

This is a hubot adapter, provides a fast way to connect hubot into synology chat

### Install

##### Docker

You can quickly spin up a docker image with:

```
docker run -it \
	-e SYNOCHAT_PORT=<your chatbot outgoing listen port> \
	-e SYNOCHAT_URL=<your chatbot incoming url and port> \
	-e SYNOCHAT_TOKEN=<your chatbot token> \
	-e BOT_NAME=synohubot \
	-e EXTERNAL_SCRIPTS=hubot-pugme,hubot-help \
	-p <your chatbot outgoing listen port>:<your chatbot outgoing listen port> \
	ensky/hubot-synologychat
```

##### Custom Scripts

If you want to include your own custom scripts you can by doing:

```
docker run -it \
	-e SYNOCHAT_PORT=<your chatbot outgoing listen port> \
	-e SYNOCHAT_URL=<your chatbot incoming url and port> \
	-e SYNOCHAT_TOKEN=<your chatbot token> \
	-e BOT_NAME=synohubot \
	-e EXTERNAL_SCRIPTS=hubot-pugme,hubot-help \
	-p <your chatbot outgoing listen port>:<your chatbot outgoing listen port> \
	-v $PWD/scripts:/home/hubot/scripts \
	ensky/hubot-synologychat
```
