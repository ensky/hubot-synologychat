FROM node:8-slim
MAINTAINER Ensky Lin <enskylin@gmail.com>

RUN npm install -g yo generator-hubot  &&  \
	useradd hubot -m

USER hubot

WORKDIR /home/hubot

ENV BOT_NAME "synohubot"
ENV BOT_OWNER "No owner specified"
ENV BOT_DESC "Hubot with synology chat adapter"

ENV EXTERNAL_SCRIPTS=hubot-diagnostics,hubot-help,hubot-google-images,hubot-google-translate,hubot-pugme,hubot-maps,hubot-rules,hubot-shipit

RUN yo hubot --owner="$BOT_OWNER" --name="$BOT_NAME" --description="$BOT_DESC" --defaults && \
	sed -i /heroku/d ./external-scripts.json && \
	sed -i /redis-brain/d ./external-scripts.json && \
	npm install hubot-scripts

ADD . /home/hubot/node_modules/hubot-synologychat

# hack added to get around owner issue: https://github.com/docker/docker/issues/6119
USER root
RUN chown hubot:hubot -R /home/hubot/node_modules/hubot-synologychat
USER hubot

RUN cd /home/hubot/node_modules/hubot-synologychat && \
	npm install && \
	cd /home/hubot

CMD node -e "console.log(JSON.stringify('$EXTERNAL_SCRIPTS'.split(',')))" > external-scripts.json && \
	npm install $(node -e "console.log('$EXTERNAL_SCRIPTS'.split(',').join(' '))") && \
	bin/hubot -n $BOT_NAME -a synologychat
