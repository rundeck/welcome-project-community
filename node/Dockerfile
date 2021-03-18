FROM ubuntu:16.04
# latest LTS

RUN apt-get -y update && \
    apt-get -y -qq install sudo  && \
    apt-get -y -qq install openssh-server && \
    apt-get -y -qq install \
        unzip \
        curl \
        netcat-traditional \
        ncurses-bin \
        iputils-ping \
        net-tools \
        jq \
        zip \
        wget \
        software-properties-common \
        sysstat \
        nginx

COPY setup /tmp/setup

RUN /tmp/setup/mk_rundeck_user

# Copy the config template from the docs
COPY rdeck_ssh_start /usr/local/sbin
COPY nginx_start /usr/local/sbin

EXPOSE 22

#RUN sudo service nginx start
#RUN chmod +x /usr/local/sbin/nginx_start

#CMD /usr/local/sbin/nginx_start

# CMD /usr/sbin/sshd -e -D
CMD /usr/local/sbin/rdeck_ssh_start
