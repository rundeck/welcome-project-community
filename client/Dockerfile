FROM node:12.20.1

RUN  apt-get update && apt-get upgrade -y -qq && \
     apt-get install -y -qq --no-install-recommends wget git curl jq

RUN mkdir /rundeck-cli
COPY rundeck-cli /rundeck-cli
COPY project /rundeck-cli/projects
COPY import.yml /rundeck-cli

WORKDIR /rundeck-cli

COPY scripts ./scripts
RUN chmod +x ./scripts/init.sh

RUN npm install

CMD ./scripts/init.sh
