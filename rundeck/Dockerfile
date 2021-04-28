ARG RUNDECK_IMAGE
FROM ${RUNDECK_IMAGE}

RUN  sudo apt-get update && \
     sudo apt-get install -y -qq --no-install-recommends wget git curl jq iputils-ping sysstat

COPY data/resources.yml /home/rundeck
COPY data/realm.properties /home/rundeck/server/config
COPY data/linux_id_rsa /home/rundeck
COPY data/plugins/. /home/rundeck/libext
