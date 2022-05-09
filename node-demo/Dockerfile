FROM rundeck/node-demo

#Add commands here to customize node-demo image.
#Adjust docker-compose to build from this file by replacing:
# image: rundeck/node-demo
# with
# build:
#   context: node-demo

COPY wait_for_key.sh  /usr/local/sbin/wait_for_key
RUN chmod +x /usr/local/sbin/wait_for_key

CMD /usr/local/sbin/wait_for_key && /usr/local/sbin/rdeck_ssh_start
